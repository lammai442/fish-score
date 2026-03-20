from flask import Blueprint, request, jsonify, g
from middlewares.require_auth import require_auth
from schemas.event_schema import CatchSchema
from middlewares.validate_schema import validate_schema
from services.catches import add_catch_in_db, edit_catch_in_db, delete_catch_in_db


# Skapa blueprint instans
catch_bp = Blueprint("catch_bp", __name__)


# Lägg till en catch
@catch_bp.route(
    "/events/<string:event_id>/teams/<string:team_id>/add-catch", methods=["POST"]
)
@require_auth
@validate_schema(CatchSchema)
def add_catch(event_id, team_id):

    # Hämtar data från bodyn
    data = request.get_json()
    catch_weight = data.get("catchWeight")
    user_id = g.user["sub"]

    response = add_catch_in_db(event_id, team_id, user_id, catch_weight)

    if response["success"]:
        return jsonify({"success": True, "updatedTeam": response["catch"]}), 200
    else:
        return jsonify(response), 409


# Redigera en catch
@catch_bp.route(
    "/events/<string:event_id>/catch/edit-catch/<string:catch_id>", methods=["POST"]
)
@require_auth
@validate_schema(CatchSchema)
def edit_catch(event_id, catch_id):

    # Hämtar data från bodyn
    data = request.get_json()
    catch_weight = data.get("catchWeight")
    user_id = g.user["sub"]

    response = edit_catch_in_db(event_id, catch_id, user_id, catch_weight)

    if response["success"]:
        return jsonify({"success": True, "updatedCatch": response["updatedCatch"]}), 200
    else:
        return jsonify(response), 409


# Ta bort en catch
@catch_bp.route(
    "/events/<string:event_id>/catch/delete-catch/<string:catch_id>", methods=["DELETE"]
)
@require_auth
def delete_catch(event_id, catch_id):

    user_id = g.user["sub"]

    response = delete_catch_in_db(event_id, catch_id, user_id)

    if response["success"]:
        return jsonify({"success": True, "message": response["message"]}), 200
    else:
        return jsonify(response), 409
