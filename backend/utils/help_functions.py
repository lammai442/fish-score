# Funktion som filterar bort alla andra keys förutom de i allowed_fields
def filter_user(user):
    allowed_fields = [
        "email",
        "firstName",
        "lastName",
        "maxCatchWeight",
        "totalCatchWeight",
        "createdAt",
    ]
    return {key: user[key] for key in allowed_fields if key in user}
