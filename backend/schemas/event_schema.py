from marshmallow import Schema, fields, validate


class EventSchema(Schema):
    eventName = fields.String(required=True, validate=validate.Length(min=1, max=18))
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


class UpdateEventSchema(Schema):
    newEventName = fields.String(required=True, validate=validate.Length(min=1, max=18))


class UpdateEventStatusSchema(Schema):
    eventStatus = fields.String(
        required=True,
        validate=validate.OneOf(
            ["ongoing", "completed"],
            error="Status must be either 'ongoing' or 'completed'",
        ),
    )


ALLOWED_FISH_TYPES = [
    "pike",
    "perch",
    "salmon",
    "zander",
    "trout",
    "char",
    "rainbow",
]


class CatchSchema(Schema):
    catchWeight = fields.Float(required=True, validate=validate.Range(min=0.1))
    fishType = fields.String(required=True, validate=validate.OneOf(ALLOWED_FISH_TYPES))


class TeamSchema(Schema):
    eventId = fields.String(
        required=True,
        validate=[
            validate.Length(equal=11),
            validate.Regexp(
                r"^event-[a-zA-Z0-9]{5}$",
                error="Each member must match format event-xxxxx",
            ),
        ],
    )
    teamName = fields.String(required=True, validate=validate.Length(min=1, max=18))
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
