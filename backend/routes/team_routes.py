from flask import Blueprint, request, jsonify, g
from middlewares.require_auth import require_auth
from schemas.event_schema import TeamSchema
from middlewares.validate_schema import validate_schema
from services.teams import create_new_team_in_db, join_team_in_db, get_team_in_db

# Skapa blueprint instans
team_bp = Blueprint("team_bp", __name__)


# Skapa ett nytt team
@team_bp.route("/teams/newteam", methods=["POST"])
@require_auth
@validate_schema(TeamSchema)
def create_new_team():

    # Validated data after middleware
    data = request.validated_data
    event_id = data["eventId"]
    team_name = data["teamName"]
    created_by = data["createdBy"]

    response = create_new_team_in_db(event_id, team_name, created_by)
    if response["success"]:
        team = response["team"]
        return jsonify({"success": True, "team": team}), 200
    else:
        return jsonify(response), 409


# Gå med i ett team
@team_bp.route(
    "/events/<string:event_id>/teams/<string:team_id>/join", methods=["POST"]
)
@require_auth
def join_team(event_id, team_id):

    # Hämtar data från bodyn
    data = request.get_json()
    user_id = data["userId"]

    if not user_id:
        return jsonify({"success": False, "error": "userId required"}), 400

    response = join_team_in_db(event_id, team_id, user_id)

    if response["success"]:
        return jsonify({"success": True, "message": response["message"]}), 200
    else:
        return jsonify(response), 409


# Hämta ett team
@team_bp.route("/events/<string:event_id>/teams/<string:team_id>", methods=["GET"])
@require_auth
def get_team(event_id, team_id):

    response = get_team_in_db(event_id, team_id)

    if response["success"]:
        return jsonify({"success": True, "message": response["team"]}), 200
    else:
        return jsonify(response), 409
