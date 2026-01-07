from marshmallow import Schema, fields, validate


class EventSchema(Schema):
    eventName = fields.String(required=True, validate=validate.Length(min=1, max=64))
    createdBy = fields.String(
        required=True,
        validate=[
            validate.Length(equal=10),
            validate.Regexp(
                r"^user-[a-zA-Z0-9]{5}$",
                error="createdBy must match format user-xxxxx",
            ),
        ],
    )
