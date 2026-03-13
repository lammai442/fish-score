from functools import wraps
from flask import request, jsonify
from marshmallow import ValidationError


# Decorater som validerar request.get_json() (inskickade bodyn) till ett Marshmallow-schema.
# Om valideringen failar, returna 400 Bad Request
def validate_schema(schema_class):

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if not request.data:
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "Request body is required",
                        }
                    ),
                    400,
                )

            # Validera body input formatet
            if not request.is_json:
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "Request body must be valid JSON",
                        }
                    ),
                    400,
                )

            try:
                data = schema_class().load(request.get_json())
                # Lägger in validerad data i request context
                setattr(request, "validated_data", data)
            except ValidationError as err:
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "Validation error",
                            "fields": err.messages,
                        }
                    ),
                    400,
                )
            return func(*args, **kwargs)

        return wrapper

    return decorator
