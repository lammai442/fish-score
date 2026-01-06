from flask import Blueprint, request, jsonify, make_response, g
from services.auth import register_user_to_db
from schemas.register_schema import RegisterSchema
from schemas.login_schema import LoginSchema
from middlewares.validate_schema import validate_schema
from services.users import get_user_by_email, get_user_by_user_id
from utils.hash_bcrypt import verify_password
from utils.tokens import generate_token
from middlewares.require_auth import require_auth
from utils.help_functions import filter_user

# Skapar blueprint
auth_bp = Blueprint("auth", __name__)


# Registrera ny användare
@auth_bp.route("/auth/register", methods=["POST"])
@validate_schema(RegisterSchema)
def register_user():
    # Färdigvaliderad data efter middleware
    data = request.validated_data

    response = register_user_to_db(data)

    if response["success"]:
        return (
            jsonify({"success": True, "message": "Successfully register new user"}),
            201,
        )
    else:
        return jsonify({"success": False, "error": response["error"]}), 409


# Logga in användare
@auth_bp.route("/auth/login", methods=["POST"])
@validate_schema(LoginSchema)
def login_user():

    data = request.validated_data
    user_exist = get_user_by_email(data["email"])

    # Kontroll om användaren finns
    if not user_exist["success"]:
        return (
            jsonify({"success": False, "error": user_exist["error"]}),
            400,
        )

    user = user_exist["user"]

    user_pw = user["password"]
    verify_pws = verify_password(data["password"], user_pw)

    if not verify_pws:
        return jsonify({"success": False, "error": "Password does not match"}), 400

    token = generate_token({"sub": user["PK"][5:], "email": user["email"]})

    response = make_response(
        jsonify({"success": True, "message": "Login successfully", "token": token}), 200
    )

    # Sätter cookien
    response.set_cookie(
        "access_token",
        token,
        httponly=True,
        secure=True,
        samesite="None",
        path="/",
        max_age=60 * 60,
    )

    return response


# Logga ut
@auth_bp.route("/auth/logout", methods=["POST"])
def logout_user():
    response = make_response(jsonify({"success": True, "message": "Logged out"}))

    response.set_cookie(
        "access_token",
        "",
        httponly=True,
        secure=True,
        samesite="None",
        path="/",
        max_age=0,
        expires=0,
    )

    return response


# Kontrollerar för me
@auth_bp.route("/auth/me", methods=["GET"])
@require_auth
def get_current_user():

    user = get_user_by_user_id(g.user["sub"])

    if user is None:
        return jsonify({"success": False, "error": "Could not find user"})

    filtered_user = filter_user(user)

    return jsonify(
        {
            "success": True,
            "user": filtered_user,
        }
    )
