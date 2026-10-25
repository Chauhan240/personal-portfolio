from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from app.auth import (
    clear_session_cookie,
    create_access_token,
    get_current_admin,
    set_session_cookie,
    verify_credentials,
)
from app.ratelimit import login_by_ip, login_global
from app.schemas import LoginRequest, SessionResponse

router = APIRouter(prefix="/api/admin", tags=["auth"])


def _client_ip(request: Request) -> str:
    # uvicorn runs with --proxy-headers, so this is the real client address as set by Caddy.
    return request.client.host if request.client else "unknown"


@router.post("/login", response_model=SessionResponse)
def login(payload: LoginRequest, request: Request, response: Response) -> SessionResponse:
    ip = _client_ip(request)
    wait = max(login_by_ip.retry_after(ip), login_global.retry_after("all"))
    if wait:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many sign-in attempts. Try again later.",
            headers={"Retry-After": str(wait)},
        )

    if not verify_credentials(payload.username, payload.password):
        login_by_ip.record_failure(ip)
        login_global.record_failure("all")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    login_by_ip.reset(ip)
    set_session_cookie(response, create_access_token(subject=payload.username))
    return SessionResponse(username=payload.username)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    clear_session_cookie(response)


@router.get("/me", response_model=SessionResponse)
def me(username: str = Depends(get_current_admin)) -> SessionResponse:
    return SessionResponse(username=username)
