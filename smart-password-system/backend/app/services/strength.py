import math
import string


def calculate_entropy(password: str):
    pool_size = 0

    if any(c.islower() for c in password):
        pool_size += 26
    if any(c.isupper() for c in password):
        pool_size += 26
    if any(c.isdigit() for c in password):
        pool_size += 10
    if any(c in string.punctuation for c in password):
        pool_size += 32

    entropy = len(password) * math.log2(pool_size) if pool_size else 0
    return entropy


def get_strength(entropy: float):
    if entropy < 40:
        return "Weak"
    elif entropy < 60:
        return "Medium"
    else:
        "Strong"
