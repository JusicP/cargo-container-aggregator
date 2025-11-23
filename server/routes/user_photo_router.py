import os
from fastapi import APIRouter, UploadFile, Depends, HTTPException, Response
from server.database.connection import generate_async_session
from server.routes.dependencies import get_current_user
from server.services.user_photo_service import create_user_photo_and_write, read_photo

router = APIRouter(prefix="/user", tags=["User Photos"])

MAX_SIZE = 4 * 1024 * 1024  # 4 МБ


# --- POST /user/uploadphoto ---
@router.post("/uploadphoto")
async def upload_photo(
    file: UploadFile,
    session = Depends(generate_async_session),
    user = Depends(get_current_user("user")),
):
    if file.content_type != "image/jpeg":
        raise HTTPException(status_code=415, detail="Only image/jpeg allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Payload too large")

    photo = await create_user_photo_and_write(session, user.id, contents)
    if not photo:
        raise HTTPException(status_code=422, detail="Bad params")

    return {"photo_id": photo.id}


# --- GET /user/photo/{photo_id} ---
@router.get("/photo/{photo_id}")
async def get_photo(
    photo_id: int,
    session = Depends(generate_async_session),
):
    image_bytes = await read_photo(session, photo_id)
    return Response(content=image_bytes, media_type="image/jpeg")
