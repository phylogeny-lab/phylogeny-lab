#!/bin/sh

set -e

GREEN='\033[0;32m'
ENDC='\e[0m'
CYAN='\033[0;36m'

# check backend is online
printf "\nPerforming health check\n"
until timeout 60s wget -qO /dev/null ${FASTAPI_HEALTH}; do
    printf "Pinging ${FASTAPI_HEALTH}...\n"
    sleep 1
done

printf "\n${GREEN}Fastapi health check Complete${ENDC}\n"

# start celery
celery --quiet -A worker.celery worker --loglevel=${LOG_LEVEL} --logfile=${LOG_FILE} --detach

printf "\nWaiting for celery workers...\n"
until timeout 120s celery -A worker inspect ping; do
    >&2 echo "Celery workers not available\n"
done

# Welcome message

printf "\n+=============================================+"
printf "\n|${GREEN}    All containers running successfully!${ENDC}     |\n"
echo "|     3'-. .-.   .-. .-.   .-. .-.   .5'      |"
echo "|         \   \ /   \   \ /   \   \ /         |"
echo "|        / \   \   / \   \   / \   \\          |"
printf "|     5'~   \`-~ \`-\`   \`-~ \`-\`   \`-~ \`-3'      |"
printf "\n| Web portal running at ${CYAN}${WEB_PORTAL}${ENDC} |"
printf "\n+=============================================+"
printf "\n\nFor contributing see our github repo:"
printf "\n${GITHUB_REPO}"
printf "\n\nand join the discord!"
printf "\n${DISCORD}"
printf "\n\nHave fun!\n\n"

# start flower dashboard
celery --quiet --broker=${CELERY_BROKER_URL} flower --port=${FLOWER_PORT}