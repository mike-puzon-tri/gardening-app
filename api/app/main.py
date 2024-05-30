import http
import logging
import sys

import fastapi
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import RedirectResponse

from app import batch_job, userprofile
from app.settings import settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    stream=sys.stdout,
)

# prefix all API routes here so that we can have single forwarding rule in cloudfront
API_PREFIX = "/api"

app = fastapi.FastAPI(
    title="Example Frontend API application",
    debug=settings.debug,
    docs_url=f"{API_PREFIX}_docs",
    openapi_url=API_PREFIX,
)

# support GZIP compression, so we can handle larger payloads
app.add_middleware(GZipMiddleware, minimum_size=1000)
# support CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # local debug
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# catch all exception handler, so we can more easily debug python Exceptions
@app.exception_handler(Exception)
def http_exception_handler(request, exc):  # noqa: ARG001
    logging.exception("Exception: %s", exc)
    return fastapi.responses.JSONResponse(
        content={"message": str(exc)},
        status_code=http.HTTPStatus.INTERNAL_SERVER_ERROR,
    )


# SecuringTech team prefers us to have these no cache headers
@app.middleware("http")
async def add_headers(request: fastapi.Request, call_next):
    # Make the actual call
    response = await call_next(request)

    # SecuringTech team prefers us to have these no cache headers
    response.headers["Cache-Control"] = "no-cache, no-store"
    response.headers["Expires"] = "0"
    response.headers["Pragma"] = "no-cache"
    return response


@app.get("/", response_class=RedirectResponse, include_in_schema=False)
async def docs_redirect():
    return app.docs_url


app.include_router(userprofile.router, prefix=API_PREFIX)
app.include_router(batch_job.router, prefix=API_PREFIX)


def use_route_names_as_operation_ids(app: fastapi.FastAPI) -> None:
    """
    Simplify operation IDs so that generated API clients have simpler function
    names.

    Should be called only after all routes have been added.
    """
    route_names = set()
    for route in app.routes:
        if isinstance(route, fastapi.routing.APIRoute):
            if route.name in route_names:
                msg = f"Route function names should be unique {route.name}"
                raise NameError(msg)
            route.operation_id = route.name
            route_names.add(route.name)


# This must be called last in order to rename the routes for the interface.
use_route_names_as_operation_ids(app)
