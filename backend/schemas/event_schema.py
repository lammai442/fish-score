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


class TeamSchema(Schema):
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
        fields.String(
            required=True,
            validate=[
                validate.Length(equal=10),
                validate.Regexp(
                    r"^user-[a-zA-Z0-9]{5}$",
                    error="Each member must match format user-xxxxx",
                ),
            ],
        ),
        required=True,
        validate=validate.Length(min=1),
    )
