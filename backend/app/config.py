import logging
import secrets
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("portfolio.config")

_WEAK_SECRETS = {"", "dev-secret-change-me", "changeme", "secret", "change-me"}


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # "production" fails closed: the app refuses to start with weak or missing secrets.
    # Set ENVIRONMENT=development in a local .env only.
    environment: str = "production"

    admin_username: str = ""
    admin_password_hash: str = ""

    jwt_secret: str = ""
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 120
    jwt_issuer: str = "manish-chauhan-portfolio"
    jwt_audience: str = "portfolio-admin"

    cors_origins: str = "http://localhost:5173"
    allowed_hosts: str = "localhost,127.0.0.1"
    database_path: str = "./data/blog.db"

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def allowed_host_list(self) -> list[str]:
        return [h.strip() for h in self.allowed_hosts.split(",") if h.strip()]

    def validate_runtime(self) -> None:
        """Fail closed on insecure configuration; in development, generate an ephemeral secret."""
        problems: list[str] = []
        if self.jwt_secret in _WEAK_SECRETS or len(self.jwt_secret) < 32:
            problems.append("JWT_SECRET must be set to a random value of at least 32 characters")
        if not self.admin_username:
            problems.append("ADMIN_USERNAME must be set")
        if not self.admin_password_hash.startswith("$2"):
            problems.append("ADMIN_PASSWORD_HASH must be a bcrypt hash (see scripts/hash_password.py)")
        if not problems:
            return
        if self.is_production:
            raise RuntimeError("Refusing to start with insecure configuration: " + "; ".join(problems))
        logger.warning("Insecure configuration tolerated in development: %s", "; ".join(problems))
        if self.jwt_secret in _WEAK_SECRETS or len(self.jwt_secret) < 32:
            # Ephemeral per-process secret: sessions die on restart, which is fine for local work.
            object.__setattr__(self, "jwt_secret", secrets.token_urlsafe(48))


@lru_cache
def get_settings() -> Settings:
    return Settings()
