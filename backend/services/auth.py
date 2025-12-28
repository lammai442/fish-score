import boto3
from datetime import datetime
import os
import uuid

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("USERS_TABLE", "fishScore"))


def register_user(email, first_name, last_name):

    user_id = str(uuid.uuid4())[:5]
    now = datetime.utcnow().isoformat()
    item = {
        "PK": f"USER#{user_id}",
        "SK": "PROFILE",
        "entityType": "USER",
        "email": email,
        "firstName": first_name,
        "lastName": last_name,
        "createdAt": now,
        "totalCatchWeight": 0,
        "maxCatchWeight": 0,
    }

    table.put_item(Item=item, ConditionExpression="attribute_not_exists(PK)")
    return {"userId": user_id, "email": email}
