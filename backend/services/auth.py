from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from .users import get_user_by_email
from utils.hash_bcrypt import hash_password


def register_user_to_db(data):
    table = get_dynamodb_table()
    emailExist = get_user_by_email(data["email"])

    # Cancel if email already exist i database
    if emailExist["success"]:
        return {"success": False, "error": "Email already exists"}

    user_id = str(uuid.uuid4())[:5]
    now = datetime.now(timezone.utc).isoformat()

    user_item = {
        "PK": f"USER#user-{user_id}",
        "SK": "PROFILE",
        "id": f"user-{user_id}",
        "lookupType": "USER#EMAIL",
        "lookupValue": data["email"],
        "entityType": "USER",
        "email": data["email"],
        "password": hash_password(data["password"]),
        "firstName": data["firstName"],
        "lastName": data["lastName"],
        "createdAt": now,
        "totalCatchWeight": 0,
        "totalCatches": 0,
    }

    try:
        table.put_item(
            Item=user_item,
            ConditionExpression="attribute_not_exists(PK)",
        )

        return {
            "success": True,
            "user": {"userId": f"user-{user_id}", "email": data["email"]},
        }

    except ClientError as e:
        return {"success": False, "error": str(e)}
