from pydantic import BaseModel


class UserProfileRequest(BaseModel):
    username: str
    age: int


class UserProfile(UserProfileRequest):
    userid: str  # from authorization token
