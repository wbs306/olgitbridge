FROM node:18.14.2-slim

ENV RUN_SYNC=0

WORKDIR /var/olgitbridge/
COPY . .
RUN apt-get update && apt-get upgrade -y && apt-get install --no-install-recommends git ca-certificates cron -y && apt-get clean
RUN npm install
RUN git config --global user.email "overleaf-git-bridge@system.changeme.invalid" && git config --global user.name "Overleaf Git Bridge"
RUN chmod +x ./entrypoint.sh

COPY crontab-sync /etc/cron.d/

EXPOSE 5000
ENTRYPOINT ["./entrypoint.sh"]

