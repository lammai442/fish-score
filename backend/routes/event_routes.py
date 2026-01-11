from flask import Blueprint, request, jsonify
from middlewares.require_auth import require_auth
from schemas.event_schema import EventSchema
from middlewares.validate_schema import validate_schema
from services.events import create_new_event_in_db, get_all_events_in_db

# Skapar blueprint
event_bp = Blueprint("event_bp", __name__)


# Hämtar alla events
@event_bp.route("/events", methods=["GET"])
@require_auth
def get_events():

    response = get_all_events_in_db()

    if response is None:
        return jsonify({"success": False, "error": "Could not fetch events"}), 500

    return jsonify({"success": True, "events": response}), 200


# Skapar ett nytt event
@event_bp.route("/events/newevent", methods=["POST"])
@require_auth
@validate_schema(EventSchema)
def create_new_event():

    # Färdigvaliderad data efter middleware
    data = request.validated_data
    event_name = data["eventName"]
    created_by = data["createdBy"]

    response = create_new_event_in_db(event_name, created_by)
    if response["success"]:
        saved_event = response["event"]
        return jsonify({"success": True, "event": saved_event}), 200
    else:
        return jsonify(response), 409
