from backend.services.websocket_connection import store_connection
from flask import g
from middlewares.require_auth import require_auth


@require_auth
def connect(connection_id, event):
    try:
        user_id = g.user["sub"]

        if not user_id:
            print("Connect failed: user_id missing")
            return {"statusCode": 401}

        store_connection(connection_id, user_id)
        print("Connect successful:", connection_id)
        return {"statusCode": 200}
    except Exception as e:
        print("Connect failed:", e)
        return {"statusCode": 500}
