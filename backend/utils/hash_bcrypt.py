from passlib.hash import bcrypt

# Max längd som bcrypt använder
BCRYPT_MAX_LENGTH = 72


# Hasha lösenord
def hash_password(password: str) -> str:
    # Truncera lösenord om längre än 72 tecken
    truncated_pw = password[:BCRYPT_MAX_LENGTH]
    hashed = bcrypt.hash(truncated_pw)
    return hashed


# Verifiera lösenord
def verify_password(password: str, hashed: str) -> bool:
    # Truncera lösenordet till samma maxlängd
    truncated_pw = password[:BCRYPT_MAX_LENGTH]
    return bcrypt.verify(truncated_pw, hashed)
