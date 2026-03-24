from backend.services.websocket_connection import send_to_connection, remove_connection
import boto3
import os
from boto3.dynamodb.types import TypeDeserializer
from decimal import Decimal
from services.events import get_event_view_in_db

# Importing AWS-clients

dynamodb = boto3.client("dynamodb")
deserializer = TypeDeserializer()


def make_json_safe(value):
    if isinstance(value, list):
        return [make_json_safe(v) for v in value]
    if isinstance(value, dict):
        return {k: make_json_safe(v) for k, v in value.items()}
    if isinstance(value, Decimal):
        return int(value) if value % 1 == 0 else float(value)
    return value


def extract_event_id_from_record(record):
    new_image = record["dynamodb"].get("NewImage")
    old_image = record["dynamodb"].get("OldImage")

    image = new_image or old_image
    if not image:
        return None

    pk = image.get("PK", {}).get("S")
    if not pk or not pk.startswith("EVENT#"):
        return None

    return pk.replace("EVENT#", "", 1)


def is_event_related_record(record):
    new_image = record["dynamodb"].get("NewImage")
    old_image = record["dynamodb"].get("OldImage")

    image = new_image or old_image
    if not image:
        return False

    pk = image.get("PK", {}).get("S")
    sk = image.get("SK", {}).get("S")

    if not pk or not sk:
        return False

    if not pk.startswith("EVENT#"):
        return False

    return (
        sk == "EVENT"
        or sk.startswith("TEAM#")
        or sk.startswith("CATCH#")
        or sk.startswith("MESSAGE#")
    )


def handler(event, context):
    print("LAMBDA TRIGGERED")

    table_name = os.environ.get("USERS_TABLE", "fishScore")
    table = boto3.resource("dynamodb").Table(table_name)

    connections = table.query(
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": "CONNECTION"},
    )["Items"]

    sent_event_ids = set()

    for record in event["Records"]:
        if not is_event_related_record(record):
            continue

        event_id = extract_event_id_from_record(record)
        if not event_id:
            continue

        # Undvik att skicka samma event flera gånger i samma batch
        if event_id in sent_event_ids:
            continue

        sent_event_ids.add(event_id)

        # Skapar eventobjekt som skickas till client
        event_response = get_event_view_in_db(event_id)
        if not event_response["success"]:
            continue

        message = {
            "type": "eventUpdate",
            "data": make_json_safe(event_response["event"]),
        }

        for conn in connections:
            connection_id = conn["SK"].replace("CONNECTION#", "")
            try:
                send_to_connection(connection_id, message)
            except Exception as e:
                if "GoneException" in str(e):
                    remove_connection(connection_id)

    return {"statusCode": 200}


# def is_event_record(record):
#     # Send all records for events, teams och catches

#     new_image = record["dynamodb"].get("NewImage")
#     old_image = record["dynamodb"].get("OldImage")

#     def check_image(image):
#         if not image:
#             return False
#         pk = image.get("PK", {}).get("S")
#         sk = image.get("SK", {}).get("S")
#         return pk and pk.startswith("EVENT#") and sk == "EVENT"


#     result = check_image(new_image) or check_image(old_image)
#     print("IS EVENT RECORD:", result)
#     return result

# def handler(event, context):
#     print("LAMBDA TRIGGERED")
#     print("RAW EVENT:", event)

#     # Lambda-entrypoint for stream

#     table_name = os.environ.get("USERS_TABLE", "fishScore")
#     table = boto3.resource("dynamodb").Table(table_name)

#     # Get all active connections
#     connections = table.query(
#         KeyConditionExpression="PK = :pk",
#         ExpressionAttributeValues={":pk": "CONNECTION"},
#     )["Items"]

#     print("ACTIVE CONNECTIONS:", connections)

#     # Loop through all DynamDB-streamrecords
#     for record in event["Records"]:
#         print("STREAM RECORD:", record)
#         if not is_event_record(record):
#             print("SKIPPED RECORD")
#             continue

#         # Use NewImage if it exist, else OldImage
#         image = record["dynamodb"].get("NewImage") or record["dynamodb"].get("OldImage")

#         # Convert DynamoDB-format to Python-dict
#         data = {k: deserializer.deserialize(v) for k, v in image.items()}

#         safe_data = make_json_safe(data)

#         # Create message and send through Websocket
#         message = {"type": "eventUpdate", "data": safe_data}
#         print("SENDING MESSAGE:", message)

#         # Loop through all active connections and send message
#         for conn in connections:
#             connection_id = conn["SK"].replace("CONNECTION#", "")
#             try:
#                 print("SENDING TO CONNECTION:", connection_id)
#                 send_to_connection(connection_id, message)
#             except Exception as e:
#                 # Remove all unactive connections
#                 print("SEND ERROR:", str(e))
#                 if "GoneException" in str(e):
#                     remove_connection(conn["SK"].replace("CONNECTION#", ""))

#     return {"statusCode": 200}
