from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from services.users import get_user_by_user_id

table = get_dynamodb_table()


def add_message_in_db(event_id, message, user_id):
    user = get_user_by_user_id(user_id)

    if user is None:
        return {"success": False, "error": "User not found"}

    user_full_name = f"{user['firstName']} {user['lastName']}"

    if not message or not message.strip():
        return {"success": False, "error": "Message cannot be empty"}

    try:
        event_response = table.get_item(
            Key={
                "PK": f"EVENT#{event_id}",
                "SK": f"EVENT",
            },
        )
        event_item = event_response.get("Item")

        if event_item is None:
            return {"success": False, "error": "Event not found"}

        if event_item["status"] == "completed":
            return {"success": False, "error": "Event is completed"}

        message_id = f"message-{str(uuid.uuid4())[:5]}"
        now = datetime.now(timezone.utc).isoformat()

        message_item = {
            "PK": f"EVENT#{event_id}",
            "SK": f"MESSAGE#{message_id}",
            "messageId": message_id,
            "message": message,
            "createdBy": user_id,
            "messageUserFullName": user_full_name,
            "eventName": event_item["eventName"],
            "createdAt": now,
            "modifiedAt": None,
            "eventId": event_id,
            "lookupType": f"USER#{user_id}#MESSAGE",
            "lookupValue": message_id,
        }

        table.put_item(Item=message_item)

        return {"success": True, "message": message_item}

    except ClientError as e:
        return {"success": False, "error": str(e)}
