# import bcrypt


# # Skapa hashat lösenord
# def hash_password(password: str) -> str:
#     pw_bytes = password.encode("utf-8")
#     salt = bcrypt.gensalt()

#     hashed = bcrypt.hashpw(pw_bytes, salt)
#     hashed_str = hashed.decode("utf-8")
#     return hashed_str


# # Verifiera lösenord
# def verify_password(password: str, hashed: str) -> bool:
#     pw_bytes = password.encode("utf-8")
#     hashed_bytes = hashed.encode("utf-8")
#     return bcrypt.checkpw(pw_bytes, hashed_bytes)


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
