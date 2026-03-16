from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from .users import get_user_by_user_id
from decimal import Decimal

table = get_dynamodb_table()


def create_new_team_in_db(event_id, team_name, created_by):
    try:
        event_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": "EVENT",
            }
        )

        event_item = event_response.get("Item")

        if not event_item:
            return {"success": False, "error": "Event not found"}

        # Kontrollera att teamnamnet inte redan finns i samma event
        existing_team_response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq(f"EVENT#{event_id}#TEAMNAME")
            & Key("lookupValue").eq(team_name.lower()),
        )

        if existing_team_response.get("Items"):
            return {
                "success": False,
                "error": "Team with this name already exist in this event",
            }

        team_id = f"team-{str(uuid.uuid4())[:5]}"
        now = datetime.now(timezone.utc).isoformat()

        db_team_item = {
            "PK": f"EVENT#{event_id}",
            "SK": f"TEAM#{team_id}",
            "teamId": team_id,
            "teamName": team_name,
            "createdBy": created_by,
            "createdAt": now,
            "members": [],
            "totalCatchWeight": Decimal("0"),
            "lookupType": f"EVENT#{event_id}#TEAMNAME",
            "lookupValue": team_name.lower(),
        }

        table.put_item(Item=db_team_item)

        return {"success": True, "team": db_team_item}

    except ClientError as e:
        return {"success": False, "error": str(e)}


def get_team_by_team_name(event_id, team_name):
    team_name_lower = team_name.lower()

    try:
        response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq(f"EVENT#{event_id}#TEAMNAME"),
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


def join_team_in_db(event_id, team_id, user_id):
    user = get_user_by_user_id(user_id)

    if user is None:
        return {"success": False, "error": "User not found"}

    user_full_name = f"{user['firstName']} {user['lastName']}"

    try:
        # Hämta alla team i eventet
        teams_response = table.query(
            KeyConditionExpression=Key("PK").eq(f"EVENT#{event_id}")
            & Key("SK").begins_with("TEAM#")
        )

        teams = teams_response.get("Items", [])

        # Kontrollera om användaren redan är med i något lag i eventet
        for team in teams:
            members = team.get("members", [])
            if any(member["userId"] == user_id for member in members):
                return {"success": False, "error": "User is already in a team"}

        team_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{team_id}",
            }
        )

        team_item = team_response.get("Item")

        if not team_item:
            return {"success": False, "error": "Team not found"}

        members = team_item.get("members", [])

        already_member = any(member["userId"] == user_id for member in members)
        if already_member:
            return {"success": False, "error": "User already in team"}

        members.append(
            {
                "userId": user_id,
                "name": user_full_name,
            }
        )

        table.update_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{team_id}",
            },
            UpdateExpression="SET members = :members",
            ExpressionAttributeValues={
                ":members": members,
            },
        )

        return {"success": True, "message": "Joined team successfully"}

    except ClientError as e:
        return {"success": False, "error": str(e)}
