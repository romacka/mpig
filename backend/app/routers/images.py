from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
from dotenv import load_dotenv
import requests
import os
from typing import List

router = APIRouter()

# Загрузка переменных окружения
load_dotenv()
STABLE_DIFFUSION_API_URL = "https://api.stability.ai/v2beta/stable-image/edit"
STABLE_DIFFUSION_API_KEY = os.getenv("STABLE_DIFFUSION_API_KEY")

# Проверка наличия API-ключа
if not STABLE_DIFFUSION_API_KEY:
    raise RuntimeError("STABLE_DIFFUSION_API_KEY is not set in environment variables")


def process_image_in_worker(file_bytes, file_name, prompt):
    """
    Обрабатывает одно изображение: удаляет фон и заменяет фон.
    """
    try:
        # Удаление фона
        remove_bg_response = requests.post(
            f"{STABLE_DIFFUSION_API_URL}/remove-background",
            headers={
                "authorization": f"Bearer {STABLE_DIFFUSION_API_KEY}",
                "accept": "image/*",
            },
            files={"image": file_bytes},
            data={"output_format": "png"},
        )
        remove_bg_response.raise_for_status()

        # Замена фона
        inpaint_response = requests.post(
            f"{STABLE_DIFFUSION_API_URL}/inpaint",
            headers={
                "authorization": f"Bearer {STABLE_DIFFUSION_API_KEY}",
                "accept": "image/*",
            },
            files={"image": remove_bg_response.content},
            data={"prompt": prompt, "output_format": "png"},
        )
        inpaint_response.raise_for_status()

        # Сохраняем сгенерированное изображение
        output_dir = Path("output")
        output_dir.mkdir(exist_ok=True)  # Создаём директорию, если её нет
        output_path = output_dir / f"{file_name}"

        with open(output_path, "wb") as f:
            f.write(inpaint_response.content)

        # Возвращаем путь к сгенерированному изображению
        return f"/static/{file_name}"

    except requests.exceptions.RequestException as e:
        return f"Error processing {file_name}: {str(e)}"


@router.post("/process-multiple-images/")
async def process_multiple_images(prompt: str = Form(...), files: List[UploadFile] = File(...)):
    """
    Асинхронная обработка нескольких изображений с использованием ProcessPoolExecutor.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is missing.")

    image_urls = []  # Список для хранения ссылок на сгенерированные изображения

    # Создаём пул процессов для параллельной обработки
    with ProcessPoolExecutor() as executor:
        tasks = []
        for file in files:
            file_bytes = await file.read()  # Читаем содержимое файла
            tasks.append(executor.submit(process_image_in_worker, file_bytes, file.filename, prompt))

        # Получаем результаты обработки
        for task in tasks:
            image_urls.append(task.result())

    # Возвращаем ссылки на все сгенерированные изображения
    return {"message": "Images processed successfully", "image_urls": image_urls}
