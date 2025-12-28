import os
import boto3
from flask import Flask, jsonify, make_response, request
from functions.auth.PostRegisterUser.core import create_user_logic

app = Flask(__name__)


dynamodb_client = boto3.client("dynamodb")

if os.environ.get("IS_OFFLINE"):
    dynamodb_client = boto3.client(
        "dynamodb", region_name="localhost", endpoint_url="http://localhost:8000"
    )

USERS_TABLE = os.environ.get("USERS_TABLE", "fishScore")


@app.route("/auth/register", methods=["POST"])
def register_user():
    data = request.get_json()
    user_id = data.get("userId")
    email = data.get("email")
    if not user_id or not email:
        return jsonify({"error": "Missing userId or email"}), 400

    result = create_user_logic(user_id, email)
    return jsonify(result), 201


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/users/<string:user_id>")
def get_user(user_id):
    # Hämtar ett item från DynamoDB med både PK och SK
    result = dynamodb_client.get_item(
        TableName=USERS_TABLE,
        Key={
            "PK": {"S": user_id},  # Partition key
            "SK": {"S": "USER#PROFILE"},  # Sort key
        },
    )

    # Plockar ut Item från svaret om det finns
    item = result.get("Item")

    # Om inget item hittades, returnera 404
    if not item:
        return jsonify({"error": "User not found"}), 404

    # Returnerar data som vanlig JSON
    return jsonify({"pk": item["PK"]["S"], "sk": item["SK"]["S"]})


@app.route("/users", methods=["POST"])
def create_user():
    user_id = request.json.get("userId")
    name = request.json.get("name")
    if not user_id or not name:
        return jsonify({"error": 'Please provide both "userId" and "name"'}), 400

    dynamodb_client.put_item(
        TableName=USERS_TABLE, Item={"userId": {"S": user_id}, "name": {"S": name}}
    )

    return jsonify({"userId": user_id, "name": name})


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error="Not found!"), 404)


if __name__ == "__main__":
    app.run(debug=True)
