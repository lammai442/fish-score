from websocket.routes.connect import connect
from websocket.routes.disconnect import disconnect
from websocket.routes.default import default

# Importerar alla routes


def handler(event, context):
    # Lambda-entrypoint

    route_key = event["requestContext"]["routeKey"]
    # Avgör vilken WebSocket-route som anropats

    connection_id = event["requestContext"]["connectionId"]
    # Unikt id för klienten

    routes = {"$connect": connect, "$disconnect": disconnect, "$default": default}
    # Mappar routeKey till funktion

    route_handler = routes.get(route_key)
    # Hämtar rätt funktion

    if not route_handler:
        return {"statusCode": 400}

    return route_handler(connection_id, event)
