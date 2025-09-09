
import pytest
from fastapi.testclient import TestClient
from main import app
from server.database.db import Base, async_engine


@pytest.fixture(scope="function")
def session():
    ...

@pytest.fixture(scope="function")
def client():
    Base.metadata.create_all(bind=async_engine)

    with TestClient(app) as test_client:
        yield test_client

    Base.metadata.drop_all(bind=async_engine)