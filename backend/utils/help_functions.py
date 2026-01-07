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
    # Skapar en ny dictionary med endast allowed_fields
    filtered = {key: user[key] for key in allowed_fields if key in user}

    # Lägger till PK utan de första 5 tecknen, om PK finns
    if "PK" in user:
        filtered["userId"] = user["PK"][5:]  # tar bort första 5 tecknen

    return filtered
