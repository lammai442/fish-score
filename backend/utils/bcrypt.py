import bcrypt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_psw = bcrypt.hashpw(password, salt)
    return hashed_psw
