from utils.connection import store_connection


def connect(connection_id, event):
    try:
        # Om du vill ignorera user_id:
        store_connection(connection_id, None)
        print("Connect successful:", connection_id)
        return {"statusCode": 200}
    except Exception as e:
        print("Connect failed:", e)
        return {"statusCode": 500}
