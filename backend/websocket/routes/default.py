from backend.services.websocket_connection import send_to_connection


def default(connection_id, event):
    # Runs if client doesnt recognise message type
    send_to_connection(
        connection_id, {"type": "error", "message": "Unknown message type"}
    )

    return {"statusCode": 200}
