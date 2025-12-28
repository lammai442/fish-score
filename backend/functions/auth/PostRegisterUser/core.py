import boto3
from datetime import datetime
import os

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("USERS_TABLE", "fishScore"))

def create_user_logic(user_id, email):
    now = datetime.utcnow().isoformat()
    item = {
        "PK": f"USER#{email}",
        "SK": "PROFILE",
        "entityType": "USER",
        "email": email,
        "name": name,
        "createdAt": now,
        "totalCatchWeight": 0,
        "maxCatchWeight": 0
    }
    table.put_item(Item=item, ConditionExpression="attribute_not_exists(PK)")
    return {"userId": user_id, "email": email}
