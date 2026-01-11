from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

table = get_dynamodb_table()


def get_event_in_db():
    try:
        response = table.query(
            IndexName="GSI1", KeyConditionExpression=Key("lookupPK").eq("EVENT#NAME")
        )

        return response.get("Items", [])

    except ClientError as e:
        print("DynamoDB ClientError:", e)
        return None


def create_new_event_in_db(event_name, created_by):

    eventExist = get_event_by_event_name(event_name)
    print("EVENTEXIST: ", eventExist)

    # Avbryt om eventen redan finns i databasen
    if eventExist["success"]:
        return {"success": False, "error": "Event with this name already exist"}

    event_id = str(uuid.uuid4())[:5]
    now = datetime.now(timezone.utc).isoformat()

    event_item = {
        "PK": f"EVENT#event-{event_id}",
        "SK": "EVENT",
        "eventName": event_name,
        "createdBy": created_by,
        "lookupPK": "EVENT#NAME",
        "lookupSK": event_name.lower(),
        "entityType": "EVENT",
        "createdAt": now,
        "teams": [],
        "status": "ongoing",
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
    event_name_lower = event_name.lower()
    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("lookupPK").eq("EVENT#NAME")
        & Key("lookupSK").eq(event_name_lower),
    )

    if response["Count"] > 0:
        return {"success": True, "event": response["Items"][0]}
    else:
        return {"success": False, "error": "Event not found"}
