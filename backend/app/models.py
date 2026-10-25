import json
from datetime import datetime, timezone
from typing import Optional

from pydantic import NaiveDatetime
from sqlmodel import SQLModel, Field


def utcnow_naive() -> datetime:
    """UTC time without tzinfo, matching how existing rows are already stored in SQLite."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class BlogPost(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    title: str
    dek: str = ""
    cover_image_url: str = ""
    content_md: str = ""
    tags_json: str = "[]"
    published: bool = Field(default=False, index=True)
    created_at: NaiveDatetime = Field(default_factory=utcnow_naive)
    updated_at: NaiveDatetime = Field(default_factory=utcnow_naive)

    @property
    def tags(self) -> list[str]:
        try:
            return json.loads(self.tags_json)
        except (json.JSONDecodeError, TypeError):
            return []

    @tags.setter
    def tags(self, value: list[str]) -> None:
        self.tags_json = json.dumps(value or [])
