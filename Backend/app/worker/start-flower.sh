#!/bin/sh

until timeout 2m celery -A worker inspect ping; do
    >&2 echo "Celery workers not available"
done

echo 'Starting flower'
celery --broker=redis://redis:6379/0 flower --port=5555