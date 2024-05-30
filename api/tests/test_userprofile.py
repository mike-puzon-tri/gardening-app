import http

import pytest


def test_get_user(mocked_fastapi_app):
    # When I get user profile
    response = mocked_fastapi_app.get(
        "/api/user_profile",
        headers={"Authorization": pytest.bearer_token},
    )

    # Then I should see the data
    assert response.status_code == http.HTTPStatus.OK, response.content
    assert response.json() == {
        "age": 1234567,
        "userid": pytest.userid,
        "username": "TEST_USER",
    }


def test_create_user(mocked_fastapi_app):
    # When I update user profile
    response = mocked_fastapi_app.post(
        "/api/user_profile",
        headers={"Authorization": pytest.bearer_token},
        json={"username": "somename", "age": 123},
    )

    # Then I should see the data
    assert response.status_code == http.HTTPStatus.OK, response.content
    assert response.json() == {
        "age": 123,
        "userid": pytest.userid,
        "username": "somename",
    }
