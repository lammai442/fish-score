from flask import Blueprint, request, jsonify  # Flask-verktyg
from services.auth import register_user_to_db  # Service-lager
import logging


logging.basicConfig(level=logging.INFO)
logging.info("Server startad")

auth_bp = Blueprint("auth", __name__)  # Skapar blueprint


@auth_bp.route("/auth/register", methods=["POST"])  # Endpoint
def register_user():
    try:
        data = request.get_json()  # Läser JSON från request

        email = data.get("email")
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        password = data.get("password")

        # Enkel validering
        if not email or not first_name or not last_name:
            return jsonify({"error": "Missing fields"}), 400

        user = register_user_to_db(email, first_name, last_name)  # Anropar service

        return jsonify(user), 201  # Returnerar svar
    except Exception as e:
        return jsonify({"error": str(e)})


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
