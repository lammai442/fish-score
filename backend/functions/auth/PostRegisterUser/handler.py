import json
import boto3
from datetime import datetime
import os
import 

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ.get("USERS_TABLE", "fishScore"))


def handler(event, context):
    # Body från request
    body = json.loads(event.get("body", "{}"))
    email = body.get("email")
    firstName = body.get("firstName")
    lastName = body.get("lastName")

    if not email or not firstName or not lastName:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing email, firstname or lastname"}),
        }

    # now = datetime.utcnow().isoformat()
    # item = {
    #     "PK": f"USER#{email}",
    #     "SK": "PROFILE",
    #     "entityType": "USER",
    #     "email": email,
    #     "firstName": firstName,
    #     "lastName": lastName,
    #     "createdAt": now,
    #     "totalCatchWeight": 0,
    #     "maxCatchWeight": 0,
    # }

    # table.put_item(Item=item, ConditionExpression="attribute_not_exists(PK)")

    return {
        "statusCode": 201,
        "body": json.dumps(
            {"email": email, "firstName": firstName, "lastName": lastName}
        ),
    }
