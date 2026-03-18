from flask import Blueprint, g, jsonify
from middlewares.require_auth import require_auth
from services.users import get_user_by_user_id, get_user_stats_in_db
from utils.help_functions import filter_user

# Skapar blueprint
user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/users/me", methods=["GET"])
@require_auth
def get_current_user():
    # Get userId from token
    user_id = g.user["sub"]

    user = get_user_by_user_id(user_id)

    if not user:
        return (
            jsonify({"success": False, "error": "Could not find user by user id"}),
            404,
        )

    filtered_user = filter_user(user)

    return jsonify({"success": True, "user": filtered_user}), 200


@user_bp.route("/users/stats", methods=["GET"])
@require_auth
def get_user_stats():
    # Get userId from token
    user_id = g.user["sub"]

    user_stats = get_user_stats_in_db(user_id)

    if not user_stats:
        return (
            jsonify({"success": False, "error": "Could not find user by user id"}),
            404,
        )

    return jsonify({"success": True, "userStats": user_stats["userStats"]}), 200
