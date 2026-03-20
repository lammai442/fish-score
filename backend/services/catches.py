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
            },
        )
        team_item = team_response.get("Item")

        catch_id = f"catch-{str(uuid.uuid4())[:5]}"
        now = datetime.now(timezone.utc).isoformat()

        catch_item = {
            "PK": f"EVENT#{event_id}",
            "SK": f"CATCH#{catch_id}",
            "catchId": catch_id,
            "catchedBy": user_id,
            "catchersFullName": user_full_name,
            "createdAt": now,
            "catchWeight": catch_weight_decimal,
            "eventId": event_id,
            "teamId": team_id,
            "teamName": team_item["teamName"],
            "lookupType": f"USER#{user_id}#CATCH",
            "lookupValue": now,
        }

        table.put_item(Item=catch_item)

        # Uppdatera teamets totalvikt
        team_item["totalCatchWeight"] = round(
            team_item.get("totalCatchWeight", 0) + catch_weight_decimal, 1
        )

        table.update_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{team_id}",
            },
            UpdateExpression="SET totalCatchWeight = :totalCatchWeight",
            ExpressionAttributeValues={
                ":totalCatchWeight": team_item["totalCatchWeight"],
            },
        )

        return {"success": True, "catch": catch_item}

    except ClientError as e:
        return {"success": False, "error": str(e)}


def edit_catch_in_db(event_id, catch_id, user_id, catch_weight):
    try:
        catch_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"CATCH#{catch_id}",
            },
        )

        catch_item = catch_response.get("Item")

        if not catch_item:
            return {
                "success": False,
                "error": "Catch not found",
            }

        if not catch_item["catchedBy"] == user_id:
            return {"success": False, "error": "User is not same as catched user"}

        team_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{catch_item['teamId']}",
            }
        )

        team_item = team_response.get("Item")
        if not team_item:
            return {"success": False, "error": "Team not found"}

        # Räkna ut differens mellan gamla och nya catch_weight
        old_catch_weight = catch_item["catchWeight"]
        new_catch_weight = Decimal(str(catch_weight))

        diff = new_catch_weight - old_catch_weight
        now = datetime.now(timezone.utc).isoformat()

        # Uppdaterar catch
        table.update_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"CATCH#{catch_id}",
            },
            UpdateExpression="SET catchWeight = :catchWeight, modifiedAt = :modifiedAt",
            ExpressionAttributeValues={
                ":catchWeight": new_catch_weight,
                ":modifiedAt": now,
            },
        )

        # Uppdaterar teamets totalvikt
        table.update_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{catch_item['teamId']}",
            },
            UpdateExpression="SET totalCatchWeight = totalCatchWeight + :diff",
            ExpressionAttributeValues={
                ":diff": diff,
            },
        )

        return {"success": True, "updatedCatch": old_catch_weight}

    except ClientError as e:
        return {"success": False, "error": str(e)}


def delete_catch_in_db(event_id, catch_id, user_id):
    try:
        event_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": "EVENT",
            },
        )

        event_item = event_response.get("Item")

        if not event_item:
            return {"success": False, "error": "Event not found"}

        if event_item.get("status") != "ongoing":
            return {"success": False, "error": "Event is closed"}

        catch_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"CATCH#{catch_id}",
            },
        )

        catch_item = catch_response.get("Item")

        if not catch_item:
            return {"success": False, "error": "Catch not found"}

        if catch_item["catchedBy"] != user_id:
            return {"success": False, "error": "Not authorized"}

        team_id = catch_item["teamId"]

        team_response = table.get_item(
            Key={"PK": f"EVENT#{event_id}", "SK": f"TEAM#{team_id}"}
        )

        team_item = team_response.get("Item")

        if not team_item:
            return {"success": False, "error": "Team not found"}

        # Uppdaterar teamets totalvikt
        table.update_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"TEAM#{team_id}",
            },
            UpdateExpression="SET totalCatchWeight = totalCatchWeight - :catch_weight",
            ExpressionAttributeValues={":catch_weight": catch_item["catchWeight"]},
        )

        # Raderar catchen från db
        table.delete_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"CATCH#{catch_id}",
            },
        )

        return {"success": True, "message": "Successfully deleted catch"}

    except ClientError as e:
        return {"success": False, "error": str(e)}
