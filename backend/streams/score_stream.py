from utils.connection import send_to_connection, remove_connection
import boto3
import os
from boto3.dynamodb.types import TypeDeserializer

# Importerar AWS-klienter och hjälpklasser

dynamodb = boto3.client("dynamodb")
deserializer = TypeDeserializer()


def is_event_record(record):
    # Skicka alla händelser som gäller events, lag eller fångster

    new_image = record["dynamodb"].get("NewImage")
    old_image = record["dynamodb"].get("OldImage")

    def check_image(image):
        if not image:
            return False
        pk = image.get("PK", {}).get("S")
        sk = image.get("SK", {}).get("S")
        return pk and pk.startswith("EVENT#") and sk == "EVENT"

    return check_image(new_image) or check_image(old_image)


def handler(event, context):
    # Lambda-entrypoint för streamen

    table_name = os.environ.get("USERS_TABLE", "fishScore")
    table = boto3.resource("dynamodb").Table(table_name)

    # Hämtar alla aktiva anslutningar
    connections = table.query(
        KeyConditionExpression="PK = :pk",
        ExpressionAttributeValues={":pk": "CONNECTION"},
    )["Items"]

    # Loopar igenom alla DynamoDB-streamrecords
    for record in event["Records"]:
        if not is_event_record(record):
            continue

        # Använder NewImage om den finns, annars OldImage
        image = record["dynamodb"].get("NewImage") or record["dynamodb"].get("OldImage")

        # Konverterar DynamoDB-format till Python-dict
        data = {k: deserializer.deserialize(v) for k, v in image.items()}

        # Skapar meddelande att skicka via WebSocket
        message = {"type": "eventUpdate", "data": data}

        # Loopar igenom alla aktiva anslutningar och skickar meddelandet
        for conn in connections:
            try:
                send_to_connection(conn["SK"].replace("CONNECTION#", ""), message)
            except Exception as e:
                # Tar bort anslutningar som inte längre är aktiva
                if "GoneException" in str(e):
                    remove_connection(conn["SK"].replace("CONNECTION#", ""))

    return {"statusCode": 200}
