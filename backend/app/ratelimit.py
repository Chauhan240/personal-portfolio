"""Small in-process sliding-window limiter for the admin login.

State lives in memory, which is correct for this deployment (one backend container, one admin).
If the API is ever scaled horizontally, move this to Redis or enforce it at the proxy.
"""

import threading
import time
from collections import defaultdict, deque


class SlidingWindowLimiter:
    def __init__(self, max_attempts: int, window_seconds: int) -> None:
        self.max_attempts = max_attempts
        self.window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def _prune(self, key: str, now: float) -> deque[float]:
        hits = self._hits[key]
        while hits and now - hits[0] > self.window:
            hits.popleft()
        if not hits:
            self._hits.pop(key, None)
            return self._hits[key]
        return hits

    def retry_after(self, key: str) -> int:
        """Seconds until `key` may try again, or 0 if it is not currently blocked."""
        now = time.monotonic()
        with self._lock:
            hits = self._prune(key, now)
            if len(hits) < self.max_attempts:
                return 0
            return max(1, int(self.window - (now - hits[0])))

    def record_failure(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            self._prune(key, now).append(now)

    def reset(self, key: str) -> None:
        with self._lock:
            self._hits.pop(key, None)


# 5 failures per 15 minutes per client IP, and 30 per 15 minutes across all clients so a
# distributed guesser cannot just rotate addresses.
login_by_ip = SlidingWindowLimiter(max_attempts=5, window_seconds=15 * 60)
login_global = SlidingWindowLimiter(max_attempts=30, window_seconds=15 * 60)
