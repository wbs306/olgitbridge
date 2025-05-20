#!/bin/bash

set -e

if [ $RUN_SYNC = "1" ]; then
    service cron start
fi

exec node /var/olgitbridge/src/server.js
