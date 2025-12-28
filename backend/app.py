from flask import Flask, jsonify, make_response

# Importerar auth routes
from routes.auth_routes import auth_bp

app = Flask(__name__)

# Kopplar in auth routes
app.register_blueprint(auth_bp)


@app.errorhandler(404)
def resource_not_found(e):
    return make_response(jsonify(error="Route not found!"), 404)


if __name__ == "__main__":
    app.run(debug=True)
