from .table import get_dynamodb_table
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from utils.help_functions import filter_items_keys
from decimal import Decimal

table = get_dynamodb_table()


def get_user_by_email(email):

    user_response = table.query(
        IndexName="LookupIndex",
        KeyConditionExpression=Key("lookupType").eq("USER#EMAIL")
        & Key("lookupValue").eq(email),
    )

    if user_response["Count"] > 0:
        return {"success": True, "user": user_response["Items"][0]}
    else:
        return {"success": False, "error": "User not found"}


def get_user_by_user_id(user_id):

    user_response = table.get_item(Key={"PK": f"USER#{user_id}", "SK": "PROFILE"})

    if "Item" in user_response:
        return user_response["Item"]
    return None


def get_user_stats_in_db(user_id):
    try:
        user_response = table.get_item(Key={"PK": f"USER#{user_id}", "SK": "PROFILE"})

        user_item = user_response.get("Item")
        if not user_item:
            return {"success": False, "error": "Could not find user"}

        user_catch_response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq(f"USER#{user_id}#CATCH"),
        )

        user_catches = user_catch_response.get("Items", [])

        total_catches = len(user_catches)
        total_catches_weight = sum(
            (c["catchWeight"] for c in user_catches), Decimal("0")
        )
        highest_catch = max(user_catches, key=lambda c: c["catchWeight"], default=None)

        user_stats = {
            "userId": user_id,
            "totalCatches": total_catches,
            "totalCatchWeight": float(total_catches_weight),
            "highestCatchWeight": (
                float(highest_catch["catchWeight"]) if highest_catch else 0
            ),
            "catches": filter_items_keys(user_catches),
            "userFirstName": user_item["firstName"],
            "userLastName": user_item["lastName"],
        }

        return {"success": True, "userStats": user_stats}
    except ClientError as e:
        return {"success": False, "error": str(e)}
