import json
import os
import boto3


# Skapar klient för att kunna skicka data till WebSocket-klienter
apigw_client = boto3.client(
    "apigatewaymanagementapi", endpoint_url=os.environ["WEBSOCKET_ENDPOINT"]
)

# Skapar DynamoDB-resource
dynamodb = boto3.resource("dynamodb")

table_name = os.environ.get("USERS_TABLE", "fishScore")
table = dynamodb.Table(table_name)


# Skickar data till en specifik WebSocket-anslutning
def send_to_connection(connection_id, data):

    # Data måste vara bytes
    apigw_client.post_to_connection(
        ConnectionId=connection_id, Data=json.dumps(data).encode("utf-8")
    )


# Sparar connectionId i DynamoDB
def store_connection(connection_id, user_id=None):

    # Grundobjekt för anslutningen
    item = {
        "PK": "CONNECTION",
        "SK": f"CONNECTION#{connection_id}",
        "timestamp": int(__import__("time").time()),
    }

    # Sparar userId om det finns
    if user_id:
        item["userId"] = user_id

    # Skriver till DynamoDB
    table.put_item(Item=item)


def remove_connection(connection_id):
    # Tar bort connectionId från DynamoDB
    table.delete_item(Key={"PK": "CONNECTION", "SK": f"CONNECTION#{connection_id}"})
