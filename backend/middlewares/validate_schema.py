from functools import wraps
from flask import request, jsonify
from marshmallow import ValidationError


# Decorator that validates request.get_json() to a Marshmallow-schema.
# If validation fails, return 400 Bad Request
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

            # Validate body input format
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
                # Store validated data in request context
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
