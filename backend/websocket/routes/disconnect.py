from backend.services.websocket_connection import remove_connection


def disconnect(connection_id, event):
    # Disconnect connection and remove from DynamoDB

    remove_connection(connection_id)

    return {"statusCode": 200}
