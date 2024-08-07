#!/bin/sh

set -e

GREEN='\033[0;32m'
ENDC='\e[0m'
CYAN='\033[0;36m'

# check backend is online
printf "\nPerforming health check\n"
until timeout 60s wget -qO /dev/null fastapi:5000/api/health; do
    printf "Pinging fastapi:5000...\n"
    sleep 1
done

printf "\n${GREEN}Fastapi health check Complete${ENDC}\n"

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
printf "\n| Web portal running at ${CYAN}http://localhost:3000${ENDC} |"
printf "\n+=============================================+"
printf "\n\nSee our github repo: "
printf "\nhttps://github.com/phylogeny-lab/phylogeny-lab/tree/main"
printf "\n\nHave fun!\n\n"

celery --quiet --broker=redis://redis:6379/0 flower --port=5555