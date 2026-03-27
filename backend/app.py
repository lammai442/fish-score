from flask import Flask, jsonify, make_response
from flask_cors import CORS

# Importerar auth routes
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.event_routes import event_bp
from routes.team_routes import team_bp
from routes.catch_routes import catch_bp
from routes.message_routes import message_bp

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://fischscore.s3-website.eu-north-1.amazonaws.com",
                "http://localhost:5173",
            ]
        }
    },
    supports_credentials=True,
)

# Kopplar in auth routes
app.register_blueprint(auth_bp)
app.register_blueprint(user_bp)
app.register_blueprint(event_bp)
app.register_blueprint(team_bp)
app.register_blueprint(catch_bp)
app.register_blueprint(message_bp)


CSP = (
    "default-src 'self'; "
    "img-src 'self' https: data:; "
    "script-src 'self'; "
    "style-src 'self' 'unsafe-inline'; "
    "connect-src 'self' https: wss:; "
    "font-src 'self' https: data:; "
)


@app.after_request
def add_security_headers(response):
    response.headers["Content-Security-Policy"] = CSP
    return response


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error="Route not found!"), 404)


if __name__ == "__main__":
    app.run(debug=True)
