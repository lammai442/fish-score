from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from .users import get_user_by_user_id
from decimal import Decimal

table = get_dynamodb_table()


def add_catch_in_db(event_id, team_id, user_id, catch_weight):
    user = get_user_by_user_id(user_id)
    catch_weight_decimal = Decimal(str(catch_weight))

    if user is None:
        return {"success": False, "error": "User not found"}

    user_full_name = f"{user['firstName']} {user['lastName']}"

    try:
        team_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{team_id}",
            }
        )

        team_item = team_response.get("Item")

        if not team_item:
            return {"success": False, "error": "Team not found"}

        catch_id = str(uuid.uuid4())[:5]
        now = datetime.now(timezone.utc).isoformat()

        catches = team_item.get("catches", [])

        item = {
            "catchId": catch_id,
            "catchedBy": user_id,
            "catchersFullName": user_full_name,
            "createdAt": now,
            "catchWeight": catch_weight_decimal,
        }

        catches.append(item)

        # Spara över nya catches
        team_item["catches"] = catches

        # Uppdatera teamets totalvikt
        team_item["totalCatchWeight"] = round(
            team_item.get("totalCatchWeight", 0) + catch_weight_decimal, 1
        )

        table.update_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{team_id}",
            },
            UpdateExpression="SET catches = :catches, totalCatchWeight = :totalCatchWeight",
            ExpressionAttributeValues={
                ":catches": catches,
                ":totalCatchWeight": team_item["totalCatchWeight"],
            },
        )

        return {"success": True, "updatedTeam": team_item}

    except ClientError as e:
        return {"success": False, "error": str(e)}
