import jwt
import datetime
from dotenv import load_dotenv
import os

load_dotenv()

secret = os.getenv("SECRET_KEY")


def generate_token(user):
    now = datetime.datetime.now(datetime.timezone.utc)

    payload = {
        "sub": user["sub"],
        "email": user["email"],
        "iat": int(now.timestamp()),
        "exp": int((now + datetime.timedelta(hours=1)).timestamp()),
    }

    token = jwt.encode(payload, secret, algorithm="HS256")
    return token


def verify_token(token):
    try:
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
