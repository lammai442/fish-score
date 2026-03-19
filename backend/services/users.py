from .table import get_dynamodb_table
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from utils.help_functions import filter_items_keys, filter_item_keys
from decimal import Decimal

table = get_dynamodb_table()


def get_user_by_email(email):
    try:
        user_response = table.query(
            IndexName="LookupIndex",
            KeyConditionExpression=Key("lookupType").eq("USER#EMAIL")
            & Key("lookupValue").eq(email),
        )

        user_items = user_response.get("Items", [])

        if not user_items:
            return {"success": False, "error": "Could not find user by email"}

        return {"success": True, "user": user_items[0]}

    except ClientError as e:
        return {"success:": False, "error": "Error fetching user by email: {e}"}


def get_user_by_user_id(user_id):

    user_response = table.get_item(Key={"PK": f"USER#{user_id}", "SK": "PROFILE"})

    if "Item" in user_response:
        return user_response["Item"]
    return None


def get_user_profile_in_db(user_id):
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

        # Ändrar om catchWeight till float istället sträng
        for c in user_catches:
            c["catchWeight"] = float(c["catchWeight"])

        filtered_user = {
            "createdAt": user_item["createdAt"],
            "email": user_item["email"],
            "firstName": user_item["firstName"],
            "lastName": user_item["lastName"],
            "userId": user_item["id"],
        }
        user_profile = {
            "stats": {
                "totalCatches": total_catches,
                "totalCatchWeight": float(total_catches_weight),
                "highestCatchWeight": (
                    float(highest_catch["catchWeight"]) if highest_catch else 0
                ),
            },
            "catches": filter_items_keys(user_catches),
            "user": filtered_user,
        }

        return {"success": True, "userProfile": user_profile}
    except ClientError as e:
        return {"success": False, "error": str(e)}
