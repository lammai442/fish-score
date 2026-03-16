from flask import Blueprint, request, jsonify, g
from middlewares.require_auth import require_auth
from schemas.event_schema import EventSchema, TeamSchema, UpdateEventSchema, CatchSchema
from middlewares.validate_schema import validate_schema
from services.events import (
    get_event_view_in_db,
    get_event_in_db,
    create_new_event_in_db,
    get_all_events_in_db,
    update_event_in_db,
)

# Skapa blueprint instans
event_bp = Blueprint("event_bp", __name__)


# Hämtar ett event
@event_bp.route("/events/<string:event_id>", methods=["GET"])
@require_auth
def get_event(event_id):

    response = get_event_view_in_db(event_id)
    # response = get_event_in_db(event_id)

    if response is None:
        return jsonify({"success": False, "error": "Could not fetch event"}), 500

    return jsonify({"success": True, "event": response["event"]}), 200


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
