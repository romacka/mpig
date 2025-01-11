# Marketplace Product Image Generator

## Описание проекта
Marketplace Product Image Generator — это веб-приложение, которое позволяет быстро и просто создавать профессионально обработанные изображения товаров для маркетплейсов. Продукт автоматизирует задачи по удалению фона, добавлению качественного фона, обработке изображений, что делает его незаменимым инструментом для продавцов на маркетплейсах.

## Проблема, которую решает продукт
Создание карточек товаров требует времени, усилий и специальных знаний. Наш инструмент автоматизирует этот процесс, снижая трудозатраты и повышая качество изображений.

## Основные функции
- Регистрация и авторизация пользователей
- Загрузка одного или нескольких изображений
- Выбор пользовательских или готовых текстовых запросов (prompts) для обработки
- Интеграция с Stable Diffusion API для обработки изображений
- Просмотр и скачивание обработанных изображений
- Удобный и интуитивно понятный интерфейс
- Массовая обработка изображений

## Установка

### Системные требования
- Node.js: v16+
- Python: 3.9+
- PostgreSQL: установлен и настроен
- Stable Diffusion API: доступ к API

### Шаги для установки
1. Склонируйте репозиторий:
      git clone https://github.com/romacka/mpig.git   cd mpig


2. Настройка backend:
   - Перейдите в папку backend: cd backend
   - Создайте виртуальное окружение:
bash
     python3 -m venv venv
     source venv/bin/activate
   - Установите зависимости: 
bash
     pip install -r requirements.txt 
   - Настройте файл .env

3. Настройка frontend:
   - Перейдите в папку frontend:   
bash
     cd ../frontend     
   - Установите зависимости:   
bash
     npm install   
   - Запустите фронтенд:   
bash
     npm start
     
4. Доступ к приложению:
   - Backend доступен по адресу: [http://localhost:8000](http://localhost:8000)
   - Frontend доступен по адресу: [http://localhost:3000](http://localhost:3000)

## Технологии

### Backend:
- FastAPI — создание RESTful API
- PostgreSQL — база данных для хранения пользователей
- Stable Diffusion API — обработка изображений
- Uvicorn — сервер для FastAPI

### Frontend:
- React — создание пользовательского интерфейса
- AOS — анимация при прокрутке
- Axios — взаимодействие с API
