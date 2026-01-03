from functools import wraps
from flask import request, jsonify
from marshmallow import ValidationError


# Decorator som validerar request.get_json() mot ett Marshmallow-schema.
# Om valideringen misslyckas returnerar den 400 Bad Request automatiskt.
def validate_schema(schema_class):

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                data = schema_class().load(request.get_json())
                # Lagra den validerade datan i request context
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
