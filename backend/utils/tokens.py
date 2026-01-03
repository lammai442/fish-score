import jwt
import datetime
from dotenv import load_dotenv
import os

load_dotenv()

secret = os.getenv("SECRET_KEY")


def generate_token(payload: dict, expire_minutes: int = 60) -> str:
    payload_copy = payload.copy()
    payload_copy["exp"] = datetime.datetime.now(
        datetime.timezone.utc
    ) + datetime.timedelta(minutes=expire_minutes)

    token = jwt.encode(payload_copy, secret, algorithm="HS256")
    return token


def verify_token(token: str) -> dict:
    try:
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
