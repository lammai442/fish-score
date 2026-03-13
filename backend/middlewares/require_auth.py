from functools import wraps
from flask import request, jsonify, g
from utils.tokens import verify_token


# Authentisera token
def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("access_token")

        if not token:
            return jsonify({"success": False, "error": "No token"}), 401

        payload = verify_token(token)

        if not payload:
            return jsonify({"success": False, "error": "Token invalid"}), 401

        # Spara payload i den globala user
        g.user = payload

        return f(*args, **kwargs)

    return decorated
