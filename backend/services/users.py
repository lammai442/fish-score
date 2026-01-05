from .table import get_dynamodb_table
from boto3.dynamodb.conditions import Key


def get_user_by_email(email):
    table = get_dynamodb_table()

    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("lookupPK").eq("USER#EMAIL")
        & Key("lookupSK").eq(email),
    )

    if response["Count"] > 0:
        return {"success": True, "user": response["Items"][0]}
    else:
        return {"success": False, "error": "User not found"}


def get_user_by_user_id(user_id):
    table = get_dynamodb_table()

    response = table.get_item(Key={"PK": f"USER#{user_id}", "SK": "PROFILE"})

    if "Item" in response:
        return response["Item"]
    return None
