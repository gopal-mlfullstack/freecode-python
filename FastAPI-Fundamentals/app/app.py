import os
import shutil
import tempfile
import uuid
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db import Post, User, create_db_and_tables, get_async_session
from app.images import imagekit
from app.schemas import UserCreate, UserRead, UserUpdate
from app.users import auth_backend, current_active_user, fastapi_users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

# ================= AUTH ROUTES =================

app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

app.include_router(
    fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"]
)

app.include_router(
    fastapi_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"]
)


# ================= UPLOAD =================


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    caption: str = Form(""),
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    temp_file_path = None

    try:
        # Save file temporarily
        with tempfile.NamedTemporaryFile(
            delete=False, suffix=os.path.splitext(file.filename)[1]
        ) as temp_file:
            temp_file_path = temp_file.name
            shutil.copyfileobj(file.file, temp_file)

        # Upload to ImageKit
        with open(temp_file_path, "rb") as f:
            upload_result = imagekit.files.upload(
                file=f,
                file_name=file.filename,
            )

        if not upload_result:
            raise HTTPException(status_code=500, detail="Upload failed")

        # Save to DB
        post = Post(
            user_id=user.id,
            caption=caption,
            url=upload_result.url,
            file_type="video" if file.content_type.startswith("video/") else "image",
            file_name=upload_result.name,
            file_id=upload_result.file_id,
        )

        session.add(post)
        await session.commit()
        await session.refresh(post)

        return post

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        file.file.close()


# ================= FEED =================


@app.get("/feed")
async def def_feed(
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    result = await session.execute(
        select(Post)
        .options(selectinload(Post.user))  # ✅ Fix relationship loading
        .order_by(Post.created_at.desc())
    )

    posts = result.scalars().all()

    return {
        "posts": [
            {
                "id": str(post.id),
                "user_id": str(post.user_id),
                "caption": post.caption,
                "url": post.url,
                "file_name": post.file_name,
                "file_type": post.file_type,
                "created_at": post.created_at.isoformat(),
                "is_owner": post.user_id == user.id,
                "email": post.user.email if post.user else None,
            }
            for post in posts
        ]
    }


# ================= DELETE =================


@app.delete("/posts/{post_id}")
async def delete_post(
    post_id: str,
    session: AsyncSession = Depends(get_async_session),
    user: User = Depends(current_active_user),
):
    try:
        post_uuid = uuid.UUID(post_id)

        result = await session.execute(select(Post).where(Post.id == post_uuid))
        post = result.scalars().first()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # 🔒 Ownership check
        if post.user_id != user.id:
            raise HTTPException(
                status_code=403,
                detail="You don't have permission to delete this post",
            )

        # Delete from ImageKit
        try:
            if post.file_id:
                imagekit.files.delete(file_id=post.file_id)
        except Exception:
            pass  # Don't block DB delete

        # Delete from DB
        await session.delete(post)
        await session.commit()

        return {"success": True, "message": "Post deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
