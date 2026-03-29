from utils.connection import send_to_connection, remove_connection
from utils.help_functions import filter_item_keys
import boto3
import os
from boto3.dynamodb.types import TypeDeserializer
from decimal import Decimal
from services.events import get_event_view_in_db

deserializer = TypeDeserializer()


def make_json_safe(value):
    if isinstance(value, list):
        return [make_json_safe(v) for v in value]
    if isinstance(value, dict):
        return {k: make_json_safe(v) for k, v in value.items()}
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)
    return value


def deserialize_image(image):
    return {k: deserializer.deserialize(v) for k, v in image.items()}


def extract_changed_item(record):
    event_name = record.get("eventName")
    dynamodb_data = record.get("dynamodb", {})

    # REMOVE har ingen NewImage, så där används OldImage
    if event_name == "REMOVE":
        image = dynamodb_data.get("OldImage")
    else:
        image = dynamodb_data.get("NewImage")

    if not image:
        return None

    return deserialize_image(image)


def extract_event_id(item):
    pk = item.get("PK")
    if not pk or not pk.startswith("EVENT#"):
        return None

    return pk.replace("EVENT#", "", 1)


def is_event_related_item(item):
    pk = item.get("PK")
    sk = item.get("SK")

    if not pk or not sk:
        return False

    if not str(pk).startswith("EVENT#"):
        return False

    return (
        sk == "EVENT"
        or str(sk).startswith("TEAM#")
        or str(sk).startswith("CATCH#")
        or str(sk).startswith("MESSAGE#")
        or str(sk).startswith("EVENT")
    )


def handler(event, context):
    print("LAMBDA TRIGGERED")

    table_name = os.environ.get("USERS_TABLE", "fishScore")
    table = boto3.resource("dynamodb").Table(table_name)

    connections = table.query(
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": "CONNECTION"},
    )["Items"]

    # Undvik att skicka exakt samma record flera gånger i samma batch
    processed_records = set()

    for record in event.get("Records", []):
        changed_item = extract_changed_item(record)
        if not changed_item:
            continue

        if not is_event_related_item(changed_item):
            continue

        event_id = extract_event_id(changed_item)
        if not event_id:
            continue

        entity_type = changed_item.get("entityType", "EVENT")
        action = record.get("eventName", "MODIFY")

        # Försök dedupa bättre än bara eventId
        dedupe_key = f"{event_id}:{entity_type}:{action}:{changed_item.get('SK', '')}"
        if dedupe_key in processed_records:
            continue
        processed_records.add(dedupe_key)

        # Hämta senaste fulla eventvyn efter förändringen
        event_response = get_event_view_in_db(event_id)
        if not event_response["success"]:
            print(f"Could not fetch full event view for eventId={event_id}")
            continue

        changed_by = (
            changed_item.get("createdBy") or changed_item.get("updatedBy") or None
        )

        update_kind = changed_item.get("update_kind")
        cleaned_entity = filter_item_keys(changed_item)

        message = {
            "type": "eventUpdate",
            "entityType": entity_type,
            "action": action,
            "eventId": event_id,
            "changedBy": changed_by,
            "entity": make_json_safe(cleaned_entity),
            "data": make_json_safe(event_response["event"]),
            "subscribers": event_response["event"]["subscribers"],
            "updateKind": update_kind,
        }

        for conn in connections:
            connection_id = conn["SK"].replace("CONNECTION#", "")
            try:
                send_to_connection(connection_id, message)
            except Exception as e:
                print(f"Failed sending to connection {connection_id}: {e}")
                if "GoneException" in str(e):
                    remove_connection(connection_id)

    return {"statusCode": 200}
