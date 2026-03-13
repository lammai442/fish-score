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


class CatchSchema(Schema):
    catchWeight = fields.Float(required=True, validate=validate.Range(min=0.1))


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
    members = fields.List(
        fields.Nested(
            {
                "userId": fields.String(
                    required=True,
                    validate=[
                        validate.Length(equal=10),
                        validate.Regexp(
                            r"^user-[a-zA-Z0-9]{5}$",
                            error="userId must match format user-xxxxx",
                        ),
                    ],
                ),
                "name": fields.String(
                    required=True,
                    validate=validate.Length(min=1, max=50),
                ),
            }
        ),
        required=True,
        validate=validate.Length(min=1),
    )
