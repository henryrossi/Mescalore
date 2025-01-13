#!/bin/bash

source ./backend/.venv/bin/activate
(trap 'kill 0' SIGINT; python3 ./backend/manage.py runserver & cd frontend && npm start & cd .. && wait)
