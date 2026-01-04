import jwt
import datetime
from dotenv import load_dotenv
import os

load_dotenv()

secret = os.getenv("SECRET_KEY")


def generate_token(user: dict) -> str:
    payload = {
        "sub": user["sub"],
        "email": user["email"],
        "iat": datetime.datetime.now(datetime.timezone.utc),
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    }

    token = jwt.encode(payload, secret, algorithm="HS256")
    return token


def verify_token(token: str) -> dict:
    try:
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}
