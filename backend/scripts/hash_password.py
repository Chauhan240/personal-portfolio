"""Generate a bcrypt hash for ADMIN_PASSWORD_HASH.

Usage:
    python scripts/hash_password.py "your-password-here"
"""

import sys

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python scripts/hash_password.py \"your-password-here\"")
        raise SystemExit(1)
    print(pwd_context.hash(sys.argv[1]))


if __name__ == "__main__":
    main()
