from flask import Blueprint, request, jsonify
from services.auth import register_user_to_db
from schemas.register_schema import RegisterSchema
from middlewares.validate_schema import validate_schema
import logging


logging.basicConfig(level=logging.INFO)
logging.info("Server startad")

# Skapar blueprint
auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/register", methods=["POST"])
@validate_schema(RegisterSchema)
def register_user():
    data = request.validated_data  # Färdigvaliderad data

    response = register_user_to_db(data)

    if response["success"]:
        return jsonify({"success": True, "user": response["user"]}), 201
    else:
        return jsonify({"success": False, "error": response["error"]}), 409


@auth_bp.route("/auth/login", methods=["POST"])  # Endpoint
def login_user():
    try:
        data = request.get_json()  # Läser JSON från request

        email = data.get("email")  # Hämtar email
        first_name = data.get("firstName")  # Hämtar förnamn
        last_name = data.get("lastName")  # Hämtar efternamn

        if not email or not first_name or not last_name:  # Enkel validering
            return jsonify({"error": "Missing fields"}), 400

        # user = register_user_to_db(email, first_name, last_name)  # Anropar service

        return jsonify({"status": "success", "email": email}), 201  # Returnerar svar
    except Exception as e:
        return jsonify({"error": str(e)}), 500
