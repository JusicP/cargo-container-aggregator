import os
from fastapi import APIRouter, UploadFile, Depends, HTTPException, Response
from server.database.connection import generate_async_session
from server.models.user_photo import UserPhoto
from server.routes.dependencies import get_current_user

router = APIRouter(prefix="/user", tags=["User Photos"])

UPLOAD_DIR = "uploaded_photos" # TODO: MOVE TO ENV, ABSOULUTE PATH HERE
MAX_SIZE = 4 * 1024 * 1024  # 4 МБ


# --- POST /user/uploadphoto ---
@router.post("/uploadphoto")
async def upload_photo(
    file: UploadFile,
    db = Depends(generate_async_session),
    user = Depends(get_current_user("user")),
):
    if file.content_type != "image/jpeg":
        raise HTTPException(status_code=415, detail="Only image/jpeg allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="Payload too large")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    photo = UserPhoto(user_id=user.id, filename=None)
    
    db.add(photo)

    await db.flush()  

    filename = f"image_{user.id}_{photo.id}.jpg"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as f:
            f.write(contents)

        photo.filename = filename
        await db.commit()
        await db.refresh(photo)
    except Exception:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise

    return {"photo_id": photo.id}


# --- GET /user/photo/{photo_id} ---
@router.get("/photo/{photo_id}")
async def get_photo(
    photo_id: int,
    db = Depends(generate_async_session),
):
    result = await db.get(UserPhoto, photo_id)
    if not result:
        raise HTTPException(status_code=404, detail="Photo not found")

    file_path = os.path.join(UPLOAD_DIR, result.filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    with open(file_path, "rb") as f:
        image_bytes = f.read()

    return Response(content=image_bytes, media_type="image/jpeg")
