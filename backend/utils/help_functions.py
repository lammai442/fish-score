# Funktion som filterar bort alla andra keys förutom de i allowed_fields
def filter_user(user):
    allowed_fields = [
        "email",
        "firstName",
        "lastName",
        "totalCatchWeight",
        "createdAt",
    ]
    # Skapar en ny dictionary med endast allowed_fields
    filtered = {key: user[key] for key in allowed_fields if key in user}

    # Lägger till PK utan de första 5 tecknen, om PK finns
    if "PK" in user:
        filtered["userId"] = user["PK"][5:]  # tar bort första 5 tecknen

    return filtered


# Filter keys from db-item list
def filter_item_keys(item):
    cleaned_item = item.copy()

    for key in ["PK", "SK", "lookupType", "lookupValue"]:
        cleaned_item.pop(key, None)

    return cleaned_item


# Filter keys from db-item dict
def filter_items_keys(items):
    return [filter_item_keys(item) for item in items]
