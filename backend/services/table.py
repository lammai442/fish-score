import boto3
import os


def get_dynamodb_table():
    if os.environ.get("IS_OFFLINE"):
        dynamodb = boto3.resource(
            "dynamodb",
            region_name="localhost",
            endpoint_url="http://localhost:8000",
        )
    else:
        dynamodb = boto3.resource("dynamodb")

    return dynamodb.Table(os.environ.get("USERS_TABLE", "fishScore"))
