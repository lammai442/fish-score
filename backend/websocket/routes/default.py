from utils.connection import send_to_connection

# Importerar funktionen som skickar data


def default(connection_id, event):
    # Körs om klienten skickar ett okänt meddelande

    send_to_connection(
        connection_id, {"type": "error", "message": "Unknown message type"}
    )
    # Skickar felmeddelande till klienten

    return {"statusCode": 200}
