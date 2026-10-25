import re
from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
Tag = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=40)]


def reading_time_minutes(content_md: str) -> int:
    words = len(content_md.split())
    return max(1, round(words / 200))


def _normalize_slug(v: str) -> str:
    slug = v.strip().lower().replace(" ", "-")
    if len(slug) > 120 or not SLUG_RE.match(slug):
        raise ValueError("Slug may only contain lowercase letters, numbers and single hyphens (max 120).")
    return slug


def _check_image_url(v: str) -> str:
    """Cover images may only be empty, a same-site path, or https. Blocks javascript:/data: URLs."""
    if v == "":
        return v
    if len(v) > 500:
        raise ValueError("Image URL is too long.")
    if v.startswith("https://") or (v.startswith("/") and not v.startswith("//")):
        return v
    raise ValueError("Image URL must start with https:// or be a site-relative path.")


class _Strict(BaseModel):
    # Reject unknown fields instead of silently ignoring them.
    model_config = ConfigDict(extra="forbid")


class BlogPostCreate(_Strict):
    title: Title
    slug: str
    dek: str = Field(default="", max_length=400)
    cover_image_url: str = ""
    content_md: str = Field(default="", max_length=100_000)
    tags: list[Tag] = Field(default_factory=list, max_length=10)
    published: bool = False

    @field_validator("slug")
    @classmethod
    def _slug(cls, v: str) -> str:
        return _normalize_slug(v)

    @field_validator("cover_image_url")
    @classmethod
    def _img(cls, v: str) -> str:
        return _check_image_url(v)


class BlogPostUpdate(_Strict):
    title: Title | None = None
    slug: str | None = None
    dek: str | None = Field(default=None, max_length=400)
    cover_image_url: str | None = None
    content_md: str | None = Field(default=None, max_length=100_000)
    tags: list[Tag] | None = Field(default=None, max_length=10)
    published: bool | None = None

    @field_validator("slug")
    @classmethod
    def _slug(cls, v: str | None) -> str | None:
        return None if v is None else _normalize_slug(v)

    @field_validator("cover_image_url")
    @classmethod
    def _img(cls, v: str | None) -> str | None:
        return None if v is None else _check_image_url(v)


class BlogPostPublic(BaseModel):
    id: int
    slug: str
    title: str
    dek: str
    cover_image_url: str
    content_md: str
    tags: list[str]
    published: bool
    created_at: datetime
    updated_at: datetime
    reading_time_minutes: int


class BlogPostListItem(BaseModel):
    id: int
    slug: str
    title: str
    dek: str
    cover_image_url: str
    tags: list[str]
    published: bool
    created_at: datetime
    reading_time_minutes: int


class SessionResponse(BaseModel):
    username: str


class LoginRequest(_Strict):
    username: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=1, max_length=256)
