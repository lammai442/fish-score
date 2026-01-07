from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

table = get_dynamodb_table()


def create_new_event_in_db(event_name, created_by):

    eventExist = get_event_by_event_name(event_name)

    # Avbryt om eventen redan finns i databasen
    if eventExist["success"]:
        return {"success": False, "error": "Event with this name already exist"}

    event_id = str(uuid.uuid4())[:5]
    now = datetime.now(timezone.utc).isoformat()

    event_item = {
        "PK": f"EVENT#event-{event_id}",
        "SK": "EVENT",
        "eventName": event_name,
        "entityType": "EVENT",
        "createdBy": created_by,
        "createdAt": now,
        "lookupPK": f"EVENTNAME#{event_name}",
        "lookupSK": event_id,
        "teams": [],
    }

    try:
        table.put_item(
            Item=event_item,
            ConditionExpression="attribute_not_exists(PK)",
        )

        return {
            "success": True,
            "event": {
                "eventId": f"event-{event_id}",
                "eventName": event_name,
                "createdBy": created_by,
                "createdAt": now,
            },
        }

    except ClientError as e:
        return {"success": False, "error": str(e)}


def get_event_by_event_name(event_name):
    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("lookupPK").eq("EVENT#NAME")
        & Key("lookupSK").eq(event_name),
    )

    if response["Count"] > 0:
        return {"success": True, "event": response["Items"][0]}
    else:
        return {"success": False, "error": "Event not found"}
