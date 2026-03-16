from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

table = get_dynamodb_table()


def update_event_in_db(event_id, new_event_name):
    try:
        response = table.update_item(
            Key={"PK": f"EVENT#{event_id}", "SK": "EVENT"},
            UpdateExpression="SET eventName = :name",
            ExpressionAttributeValues={":name": new_event_name},
            ReturnValues="ALL_NEW",
        )

        return {"success": True, "updatedEvent": response["Attributes"]}

    except ClientError as e:
        print("DynamoDB ClientError:", e)
        return None


def get_all_events_in_db():
    try:
        response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq("EVENT#NAME"),
        )

        return response.get("Items", [])

    except ClientError as e:
        print("DynamoDB ClientError:", e)
        return None


def get_event_in_db(event_id):
    try:
        response = table.get_item(
            Key={"PK": f"EVENT#{event_id}", "SK": "EVENT"},
        )
        # Hämtar den sökta listan
        item = response.get("Item")

        # Returnera endast objektet i listan
        return item
    except ClientError as e:
        print("DynamoDB ClientError:", e)
        return None


def get_event_view_in_db(event_id):
    try:
        response = table.query(KeyConditionExpression=Key("PK").eq(f"EVENT#{event_id}"))

        items = response.get("Items", [])

        event_item = None
        teams = []
        catches = []

        for item in items:
            sk = item["SK"]

            if sk == "EVENT":
                event_item = item

            elif sk.startswith("TEAM#"):
                teams.append(item)

            elif sk.startswith("CATCH#"):
                catches.append(item)

        if not event_item:
            return {"success": False, "error": "Event not found"}

        for team in teams:
            for key in ["PK", "SK", "lookupType", "lookupValue"]:
                team.pop(key, None)

        # Koppla catches till rätt team
        catches_by_team = {}
        for catch in catches:
            team_id = catch["teamId"]
            catches_by_team.setdefault(team_id, []).append(catch)

        # Lägg catches på varje team
        for team in teams:
            team_id = team["teamId"]
            team["catches"] = catches_by_team.get(team_id, [])

        event_view = {
            **event_item,
            "teams": teams,
        }

        return {"success": True, "event": event_view}

    except ClientError as e:
        return {"success": False, "error": str(e)}


def create_new_event_in_db(event_name, created_by):
    try:
        # Kontrollera om event med samma namn redan finns
        existing_event_response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq("EVENT#NAME")
            & Key("lookupValue").eq(event_name.lower()),
        )

        if existing_event_response.get("Items"):
            return {"success": False, "error": "Event with this name already exist"}

        event_id = f"event-{str(uuid.uuid4())[:5]}"
        now = datetime.now(timezone.utc).isoformat()

        db_item = {
            "PK": f"EVENT#{event_id}",
            "SK": "EVENT",
            "eventId": event_id,
            "eventName": event_name,
            "status": "ongoing",
            "createdBy": created_by,
            "createdAt": now,
            "lookupType": "EVENT#NAME",
            "lookupValue": event_name.lower(),
            "teamCount": 0,
        }

        table.put_item(Item=db_item)

        # Returnera gärna i samma shape som frontend redan förväntar sig
        return {
            "success": True,
            "event": {
                "id": event_id,
                "eventName": event_name,
                "status": "ongoing",
                "createdBy": created_by,
                "createdAt": now,
                "teamCount": 0,
            },
        }

    except ClientError as e:
        return {"success": False, "error": str(e)}


def get_event_by_event_name(event_name):
    event_name_lower = event_name.lower()
    response = table.query(
        IndexName="LookupIndex",
        KeyConditionExpression=Key("lookupType").eq("EVENT#NAME"),
    )

    if response["Count"] > 0:
        # Kontroll om något av eventet har samma namn
        matching_event = next(
            (
                item
                for item in response["Items"]
                if item.get("eventName", "").lower() == event_name_lower
            ),
            None,
        )

        if matching_event:
            return {"success": True, "event": matching_event}

    return {"success": False, "error": "Event not found"}
