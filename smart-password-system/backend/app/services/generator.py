import random
import string


def generate_password(length: int, include_symbols: bool, include_numbers: bool):
    characters = string.ascii_letters

    if include_numbers:
        characters += string.digits

    if include_symbols:
        characters += string.punctuation

    password = "".join(random.choice(characters) for _ in range(length))
    return password


print(generate_password(13, True, True))
