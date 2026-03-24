from utils.connection import store_connection
from utils.tokens import verify_token


def connect(connection_id, event):
    try:
        print("EVENT:", event)
        print("QUERY PARAMS:", event.get("queryStringParameters"))
        # query_params = event.get("queryStringParameters") or {}
        # token = query_params.get("token")

        # if not token:
        #     return {"statusCode": 401}

        # payload = verify_token(token)
        # if not payload:
        #     return {"statusCode": 401}

        # user_id = payload["sub"]
        # # user_id = user.get("sub")
        # # user_id = g.user["sub"]

        # if not user_id:
        #     user_id = "Hej"
        user_id = "hej"
        store_connection(connection_id, user_id)
        print("Connect successful:", connection_id)
        return {"statusCode": 200}
    except Exception as e:
        print("Connect failed:", e)
        return {"statusCode": 500}
