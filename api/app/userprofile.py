import logging

from fastapi import APIRouter, Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt

from app.data_structures import UserProfile, UserProfileRequest
from app.settings import settings

# Add the route_class to ensure this router uses additional context.
router = APIRouter()
security = HTTPBearer()
default_credentials = Security(security)


def get_authorized_userid(
    credentials: HTTPAuthorizationCredentials = default_credentials,
) -> str:
    """Return userid from the JWT token.
    JWT token is present in the "Authorization: Bearer <token>" request header.
    No need to validate here because API Gateway will do that.

    :param credentials: claims dictionary parsed from JWT token
    :return: userid
    """
    jwt_token = credentials.credentials
    claims = jwt.get_unverified_claims(jwt_token)
    return claims.get("sub", "unknown_userid")


@router.post("/user_profile")
def submit_user_profile(
    user: UserProfileRequest,
    userid: str = Depends(get_authorized_userid),
) -> UserProfile:
    """Requires "Authorization: Bearer <token>" request header"""
    logging.info(
        "userid=%s submitted user profile with user.age=%s and user.username=%s.",
        userid,
        user.age,
        user.username,
    )
    return UserProfile(**user.model_dump(), userid=userid)


@router.get("/user_profile")
def get_user_profile(userid: str = Depends(get_authorized_userid)) -> UserProfile:
    logging.info("userid=%s requested user profile.", userid)
    return UserProfile(
        userid=userid,
        username=settings.default_username,
        age=settings.default_age,
    )
