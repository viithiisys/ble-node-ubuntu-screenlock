#!/bin/bash

#export XAUTHORITY=/home/$USER/.Xauthority
export DISPLAY=:0.0

case "$1" in
    unlock)
        echo "Unlocking"
        loginctl unlock-sessions
        xset dpms force on
        xset s reset
        ;;
    lock)
        echo "Locking"
        loginctl lock-sessions
        xset dpms force off
        ;;
esac
