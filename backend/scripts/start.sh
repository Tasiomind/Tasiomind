#!/bin/bash

LOG="log/mineos.log"

if [[ $EUID -ne 0 ]]; then
   echo "reset_scripts.sh must be run as root" 1>&2 | tee -a $LOG
   exit 1
fi

ECHO_LOG_N () {
    echo -en "$1" | tee -a $LOG
}

ECHO_LOG () {
    echo -e "$1" | tee -a $LOG
}

ECHO_LOG_N "installing npm"
npm install --no-spin --unsafe-perm >> $LOG
if [ $? -eq 0 ]; then ECHO_LOG "OK"; else ECHO_LOG "FAILED" && exit 1; fi

ECHO_LOG_N "installing npm"
npm install --no-spin --unsafe-perm >> $LOG
if [ $? -eq 0 ]; then ECHO_LOG "OK"; else ECHO_LOG "FAILED" && exit 1; fi
