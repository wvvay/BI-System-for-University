# Локальное развертывание

## Требования
- Должен быть установлен Docker, docker compose
- В папке создать файл ```/bi-system-do-2/Docker/.env``` и перенести данные из ```secrets.txt``` в ```.env```

## Развертывание
1. Переходим по пути ```bi-system-do-2/Docker/```
2. Вводим команду запуска
```
docker-compose -f docker-compose_local.yml up --build   
```
- Если новый dokcer compose то
```
docker compose -f docker-compose_local.yml up --build   
```
- Запуск в режиме демона -d 
```
docker compose -f docker-compose_local.yml up -d --build
```

## Полезные команды
- Остановка docker compose
```
docker compose down 
```
- Удалить контейнеры
```
docker rm <container name>
```
- Удалить образ
```
docker rmi <container name>
```

## Примечание
- После запуска создается папка ```volume``` которая сохраняет данные контейнера на хосте 
- Если что-то не работает при обновлении кода удаляем папку ```volume```
  - Так же можно попробовать удалить контейнер, образы и билды через Docker Dekstop


# Локальное развертывание backend в VisualStudio
## Требования
- В папке создать файл ```/bi-system-do-2/backend/Bi-system/Bi-system.API/.env``` и перенести данные из ```secrets.txt``` в ```.env```
- Поменять строчку ```POSTGRES_SERVER=bi-system_db_postgres``` на ```POSTGRES_SERVER=localhost```

## Развертывание
1. Запускаем через кнопку ```Play```
2. Для добавления миграций используем 
```
add-migration <Название Миграции>
```

## Примечание
- Миграция попадает в базу данных автоматически после запуска с помощью кода! Не нужно писать update и т.п.