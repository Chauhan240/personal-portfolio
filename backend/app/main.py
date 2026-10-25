from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import Session

from app.config import get_settings
from app.database import engine, init_db
from app.routers import auth, blog
from app.seed import seed_if_empty

settings = get_settings()
settings.validate_runtime()  # raises in production if secrets are weak or missing

UNSAFE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
# A custom header cannot be sent by a cross-site <form> or simple request, so requiring it (on top of
# SameSite=Strict cookies and the Origin check below) closes the CSRF door three times over.
CSRF_HEADER = "x-requested-with"
CSRF_VALUE = "portfolio-admin"

MAX_BODY_BYTES = 512 * 1024


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    with Session(engine) as session:
        seed_if_empty(session)
    yield


# Interactive docs and the schema are a map of the API for attackers; only expose them in development.
app = FastAPI(
    title="Manish Chauhan Portfolio API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None if settings.is_production else "/api/docs",
    redoc_url=None,
    openapi_url=None if settings.is_production else "/api/openapi.json",
)


def _origin_allowed(origin: str) -> bool:
    return origin in settings.cors_origin_list


@app.middleware("http")
async def guard_and_harden(request: Request, call_next):
    if request.method in UNSAFE_METHODS:
        origin = request.headers.get("origin")
        if origin and not _origin_allowed(origin):
            return JSONResponse({"detail": "Origin not allowed"}, status_code=403)
        if request.headers.get(CSRF_HEADER) != CSRF_VALUE:
            return JSONResponse({"detail": "Missing request header"}, status_code=403)
        declared = request.headers.get("content-length")
        if declared and declared.isdigit() and int(declared) > MAX_BODY_BYTES:
            return JSONResponse({"detail": "Request too large"}, status_code=413)

    response = await call_next(request)

    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    # API responses are JSON: no scripts, no framing, nothing to load.
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    if request.url.path.startswith("/api/admin"):
        response.headers["Cache-Control"] = "no-store"
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "X-Requested-With"],
)
# Added last so it runs first: requests with a spoofed Host header are rejected before anything else.
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_host_list)

app.include_router(auth.router)
app.include_router(blog.router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
