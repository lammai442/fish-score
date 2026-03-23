from flask import Blueprint, request, jsonify, g
from middlewares.require_auth import require_auth
from schemas.message_schema import MessageSchema
from middlewares.validate_schema import validate_schema
from services.messages import add_message_in_db

# Skapa blueprint instans
message_bp = Blueprint("message_bp", __name__)


# Lägg till en catch
@message_bp.route("/events/<string:event_id>/messages/add-message", methods=["POST"])
@require_auth
@validate_schema(MessageSchema)
def add_message(event_id):

    # Hämtar data från bodyn
    data = request.get_json()
    message = data["message"]
    user_id = g.user["sub"]

    response = add_message_in_db(event_id, message, user_id)

    if response["success"]:
        return jsonify({"success": True, "message": response["message"]}), 200
    else:
        return jsonify(response), 409
