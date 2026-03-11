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


def create_new_event_in_db(event_name, created_by):

    eventExist = get_event_by_event_name(event_name)

    # Cancel if event already exist in database
    if eventExist["success"]:
        return {"success": False, "error": "Event with this name already exist"}

    event_id = str(uuid.uuid4())[:5]
    now = datetime.now(timezone.utc).isoformat()

    event_item = {
        "PK": f"EVENT#event-{event_id}",
        "SK": "EVENT",
        "id": f"event-{event_id}",
        "eventName": event_name,
        "createdBy": created_by,
        "lookupType": "EVENT#NAME",
        "lookupValue": f"event-{event_id}",
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


def create_new_team_in_db(data):
    event_id = data["eventId"]
    team_name = data["teamName"]
    members = data["members"]

    try:
        response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": "EVENT",
            }
        )

        event_item = response.get("Item")

        if not event_item:
            return {"success": False, "error": "Event not found"}

        teams = event_item.get("teams", [])

        for team in teams:
            existing_name = team.get("teamName")
            if existing_name == team_name:
                return {
                    "success": False,
                    "error": "A team with this name already exists in this event",
                }

        team_id = str(uuid.uuid4())[:5]
        now = datetime.now(timezone.utc).isoformat()

        new_team = {
            "teamId": f"team_{team_id}",
            "teamName": team_name.strip(),
            "createdAt": now,
            "members": members,
            "catches": [],
            "totalCatchWeight": 0,
        }

        teams.append(new_team)

        table.update_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": "EVENT",
            },
            UpdateExpression="SET teams = :teams",
            ExpressionAttributeValues={
                ":teams": teams,
            },
        )

        return {"success": True, "team": new_team}

    except ClientError as e:
        return {"success": False, "error": str(e)}

    # teamExist = get_team_by_team_name(data["teamName"])

    # if teamExist["success"]:
    #     return {"success": False, "error": "Team with this name already exist"}

    # team_id = str(uuid.uuid4())[:5]
    # now = datetime.now(timezone.utc).isoformat()

    # team_item = {
    #     "PK": f"EVENT#{data["eventId"]}",
    #     "SK": f"TEAM#team-{team_id}",
    #     "id": f"team_{team_id}",
    #     "eventId": f"event_{data["eventId"]}",
    #     "teamName": data["teamName"],
    #     "createdBy": data["createdBy"],
    #     "lookupType": "EVENT#TEAMNAME",
    #     "lookupValue": data["teamName"],
    #     "entityType": "TEAM",
    #     "createdAt": now,
    #     "members": data["members"],
    #     "totalCatches": 0,
    # }

    # try:
    #     table.put_item(
    #         Item=team_item,
    #         ConditionExpression="attribute_not_exists(PK)",
    #     )

    #     return {
    #         "success": True,
    #         "team": {
    #             "teamId": f"team-{team_id}",
    #             "eventName": data["teamName"],
    #             "createdBy": data["createdBy"],
    #             "createdAt": now,
    #         },
    #     }

    # except ClientError as e:
    #     return {"success": False, "error": str(e)}


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


def get_team_by_team_name(event_id, team_name):
    team_name_lower = team_name.lower()

    try:
        response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq("EVENT#TEAMNAME"),
        )

        if response["Count"] > 0:
            # Kontroll om något av Teamen har samma namn
            matching_team = next(
                (
                    item
                    for item in response["Items"]
                    if item.get("teamName", "").lower() == team_name_lower
                ),
                None,
            )

            if matching_team:
                return {"success": True, "team": matching_team}

        return {"success": False, "error": "Team not found"}

    except ClientError as e:
        return {"success": False, "error": str(e)}
