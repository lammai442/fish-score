from flask import Blueprint, g, jsonify
from middlewares.require_auth import require_auth
from services.users import get_user_by_user_id
from utils.help_functions import filter_user

# Skapar blueprint
user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/users/me", methods=["GET"])
@require_auth
def get_current_user():
    # Hämtar userId direkt från token
    user_id = g.user["sub"]

    user = get_user_by_user_id(user_id)

    if not user:
        return (
            jsonify({"success": False, "error": "Could not find user by user id"}),
            404,
        )

    filtered_user = filter_user(user)

    return jsonify({"success": True, "user": filtered_user}), 200
