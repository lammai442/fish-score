from datetime import datetime, timezone
import uuid
from .table import get_dynamodb_table
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
from services.users import get_user_by_user_id
from utils.help_functions import filter_item_keys

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

        message_id = f"message-{str(uuid.uuid4())[:5]}"
        now = datetime.now(timezone.utc).isoformat()

        message_item = {
            "PK": f"EVENT#{event_id}",
            "SK": f"MESSAGE#{message_id}",
            "createdAt": now,
            "createdBy": user_id,
            "eventId": event_id,
            "entityType": "MESSAGE",
            "eventName": event_item["eventName"],
            "lookupType": f"USER#{user_id}#MESSAGE",
            "lookupValue": message_id,
            "message": message,
            "messageId": message_id,
            "messageUserFullName": user_full_name,
            "modifiedAt": None,
        }

        table.put_item(Item=message_item)

        return {"success": True, "message": filter_item_keys(message_item)}

    except ClientError as e:
        return {"success": False, "error": str(e)}
