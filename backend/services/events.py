from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from utils.help_functions import filter_items_keys, filter_item_keys

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
        events_response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq("EVENT#NAME"),
        )

        event_items = events_response.get("Items", [])
        cleaned_event_items = filter_items_keys(event_items)
        return cleaned_event_items

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


# Eventobjekt som används för Websocket och EventPage
def get_event_view_in_db(event_id):
    try:
        # Hämtar hem alla items som är inom ett event
        response = table.query(KeyConditionExpression=Key("PK").eq(f"EVENT#{event_id}"))

        items = response.get("Items", [])

        event_item = None
        teams = []
        catches = []
        messages = []

        # Loopar och lägger in varje item i respektive variabel
        for item in items:
            sk = item["SK"]

            if sk == "EVENT":
                event_item = item

            elif sk.startswith("TEAM#"):
                teams.append(item)

            elif sk.startswith("CATCH#"):
                catches.append(item)

            elif sk.startswith("MESSAGE#"):
                messages.append(item)

        if not event_item:
            return {"success": False, "error": "Event not found"}

        # Filtrerar bort nycklar
        cleaned_teams = filter_items_keys(teams)
        cleaned_catches = filter_items_keys(catches)
        cleaned_event_view = filter_item_keys(event_item)
        cleaned_messages = filter_items_keys(messages)

        # Lägg catches till rätt team
        catches_by_team = {}
        for catch in cleaned_catches:
            team_id = catch["teamId"]
            catches_by_team.setdefault(team_id, []).append(catch)

        # Lägg catches på varje team
        for team in cleaned_teams:
            team_id = team["teamId"]
            team["catches"] = catches_by_team.get(team_id, [])

        # Sortera alla catches med senaste först
        sorted_activity = sorted(
            cleaned_catches, key=lambda catch: catch["createdAt"], reverse=True
        )

        # Sortera alla messages med senaste först
        sorted_messages = sorted(
            cleaned_messages, key=lambda message: message["createdAt"], reverse=True
        )

        event_view = {
            **cleaned_event_view,
            "teams": cleaned_teams,
            "activity": sorted_activity,
            "messages": sorted_messages,
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
            "entityType": "EVENT",
            "lookupType": "EVENT#NAME",
            "lookupValue": event_name.lower(),
            "teamCount": 0,
            "subscribers": [],
        }

        table.put_item(Item=db_item)

        return {"success": True, "event": filter_item_keys(db_item)}

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


def end_event_in_db(event_id, event_status, user_id):

    try:
        event_response = table.get_item(Key={"PK": f"EVENT#{event_id}", "SK": "EVENT"})

        event_item = event_response.get("Item")

        if not event_item:
            return {"success": False, "error": "Could not find event item"}

        if not event_item["createdBy"] == user_id:
            return {"success": False, "error": "Not authorized"}

        event_item["status"] = event_status
        now = datetime.now(timezone.utc).isoformat()

        table.update_item(
            Key={"PK": f"EVENT#{event_id}", "SK": "EVENT"},
            UpdateExpression="SET #status = :event_status, modifiedAt = :modifiedAt",
            ExpressionAttributeValues={
                ":event_status": event_status,
                ":modifiedAt": now,
            },
            ExpressionAttributeNames={"#status": "status"},
            ConditionExpression="attribute_exists(PK) AND attribute_exists(SK)",
        )

        return {"success": True, "eventStatus": event_status}

    except ClientError as e:
        if e.response["Error"]["Code"] == "ConditionalCheckFailedException":
            return {"success": False, "error": "Event not found"}

        return {"success": False, "error": str(e)}
