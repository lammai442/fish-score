from passlib.hash import bcrypt


# Hasha lösenord
def hash_password(password: str) -> str:
    return bcrypt.hash(password)


# Verifiera lösenord
def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.verify(password, hashed)


# Verifiera lösenord
def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.verify(password, hashed)
