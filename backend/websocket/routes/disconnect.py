from utils.connection import remove_connection

# Importerar funktionen som tar bort connectionId


def disconnect(connection_id, event):
    # Körs när klienten kopplar ner

    remove_connection(connection_id)
    # Tar bort anslutningen från DynamoDB

    return {"statusCode": 200}
