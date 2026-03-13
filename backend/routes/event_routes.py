from flask import Blueprint, request, jsonify, g
from middlewares.require_auth import require_auth
from schemas.event_schema import EventSchema, TeamSchema, UpdateEventSchema
from middlewares.validate_schema import validate_schema
from services.events import (
    get_event_in_db,
    create_new_event_in_db,
    get_all_events_in_db,
    create_new_team_in_db,
    update_event_in_db,
    join_team_in_db,
)

# Skapa blueprint instans
event_bp = Blueprint("event_bp", __name__)


# Hämtar ett event
@event_bp.route("/events/<string:event_id>", methods=["GET"])
@require_auth
def get_event(event_id):

    response = get_event_in_db(event_id)

    if response is None:
        return jsonify({"success": False, "error": "Could not fetch event"}), 500

    return jsonify({"success": True, "event": response}), 200


# Hämtar alla events
@event_bp.route("/events", methods=["GET"])
@require_auth
def get_all_events():

    response = get_all_events_in_db()

    if response is None:
        return jsonify({"success": False, "error": "Could not fetch events"}), 500

    return jsonify({"success": True, "events": response}), 200


# Uppdatera ett event
@event_bp.route("/events/<string:event_id>", methods=["PUT"])
@require_auth
@validate_schema(UpdateEventSchema)
def update_event(event_id):
    data = request.validated_data
    new_event_name = data["newEventName"]

    response = update_event_in_db(event_id, new_event_name)

    if response is None:
        return jsonify({"success": False, "error": "Could not fetch events"}), 500

    return jsonify({"success": True, "updatedEvent": response["updatedEvent"]})


# Skapa nytt event
@event_bp.route("/events/newevent", methods=["POST"])
@require_auth
@validate_schema(EventSchema)
def create_new_event():

    # Validated data after middleware
    data = request.validated_data
    event_name = data["eventName"]
    created_by = data["createdBy"]

    response = create_new_event_in_db(event_name, created_by)
    if response["success"]:
        saved_event = response["event"]
        return jsonify({"success": True, "event": saved_event}), 200
    else:
        return jsonify(response), 409


# Create new team
@event_bp.route("/events/newteam", methods=["POST"])
@require_auth
@validate_schema(TeamSchema)
def create_new_team():

    # Validated data after middleware
    data = request.validated_data

    response = create_new_team_in_db(data)
    if response["success"]:
        team = response["team"]
        return jsonify({"success": True, "team": team}), 200
    else:
        return jsonify(response), 409


# Gå med i ett team
@event_bp.route(
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
