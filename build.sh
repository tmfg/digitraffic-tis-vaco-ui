docker build -t vaco-ui . --no-cache
docker run -p 5173:5173 vaco-ui
