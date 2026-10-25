from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlmodel import Session, select

from app.auth import get_current_admin
from app.database import get_session
from app.models import BlogPost, utcnow_naive
from app.schemas import (
    BlogPostCreate,
    BlogPostListItem,
    BlogPostPublic,
    BlogPostUpdate,
    reading_time_minutes,
)

router = APIRouter(prefix="/api", tags=["blog"])


def _to_public(post: BlogPost) -> BlogPostPublic:
    return BlogPostPublic(
        id=post.id,
        slug=post.slug,
        title=post.title,
        dek=post.dek,
        cover_image_url=post.cover_image_url,
        content_md=post.content_md,
        tags=post.tags,
        published=post.published,
        created_at=post.created_at,
        updated_at=post.updated_at,
        reading_time_minutes=reading_time_minutes(post.content_md),
    )


def _to_list_item(post: BlogPost) -> BlogPostListItem:
    return BlogPostListItem(
        id=post.id,
        slug=post.slug,
        title=post.title,
        dek=post.dek,
        cover_image_url=post.cover_image_url,
        tags=post.tags,
        published=post.published,
        created_at=post.created_at,
        reading_time_minutes=reading_time_minutes(post.content_md),
    )


@router.get("/blog", response_model=list[BlogPostListItem])
def list_public_posts(
    tag: str | None = Query(default=None, max_length=40),
    session: Session = Depends(get_session),
) -> list[BlogPostListItem]:
    posts = session.exec(
        select(BlogPost).where(BlogPost.published == True).order_by(BlogPost.created_at.desc())  # noqa: E712
    ).all()
    if tag:
        posts = [p for p in posts if tag in p.tags]
    return [_to_list_item(p) for p in posts]


@router.get("/blog/{slug}", response_model=BlogPostPublic)
def get_public_post(slug: str = Path(max_length=120), session: Session = Depends(get_session)) -> BlogPostPublic:
    post = session.exec(select(BlogPost).where(BlogPost.slug == slug)).first()
    if not post or not post.published:
        raise HTTPException(status_code=404, detail="Post not found")
    return _to_public(post)


@router.get("/admin/blog", response_model=list[BlogPostListItem])
def list_all_posts(
    session: Session = Depends(get_session),
    _admin: str = Depends(get_current_admin),
) -> list[BlogPostListItem]:
    posts = session.exec(select(BlogPost).order_by(BlogPost.created_at.desc())).all()
    return [_to_list_item(p) for p in posts]


@router.get("/admin/blog/{post_id}", response_model=BlogPostPublic)
def get_admin_post(
    post_id: int,
    session: Session = Depends(get_session),
    _admin: str = Depends(get_current_admin),
) -> BlogPostPublic:
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return _to_public(post)


@router.post("/admin/blog", response_model=BlogPostPublic, status_code=201)
def create_post(
    payload: BlogPostCreate,
    session: Session = Depends(get_session),
    _admin: str = Depends(get_current_admin),
) -> BlogPostPublic:
    existing = session.exec(select(BlogPost).where(BlogPost.slug == payload.slug)).first()
    if existing:
        raise HTTPException(status_code=409, detail="A post with this slug already exists")
    post = BlogPost(
        title=payload.title,
        slug=payload.slug,
        dek=payload.dek,
        cover_image_url=payload.cover_image_url,
        content_md=payload.content_md,
        published=payload.published,
    )
    post.tags = payload.tags
    session.add(post)
    session.commit()
    session.refresh(post)
    return _to_public(post)


@router.put("/admin/blog/{post_id}", response_model=BlogPostPublic)
def update_post(
    post_id: int,
    payload: BlogPostUpdate,
    session: Session = Depends(get_session),
    _admin: str = Depends(get_current_admin),
) -> BlogPostPublic:
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    data = payload.model_dump(exclude_unset=True)
    if "slug" in data:
        clash = session.exec(
            select(BlogPost).where(BlogPost.slug == data["slug"], BlogPost.id != post_id)
        ).first()
        if clash:
            raise HTTPException(status_code=409, detail="A post with this slug already exists")
    if "tags" in data:
        post.tags = data.pop("tags")
    for key, value in data.items():
        setattr(post, key, value)
    post.updated_at = utcnow_naive()
    session.add(post)
    session.commit()
    session.refresh(post)
    return _to_public(post)


@router.delete("/admin/blog/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    session: Session = Depends(get_session),
    _admin: str = Depends(get_current_admin),
) -> None:
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    session.delete(post)
    session.commit()
