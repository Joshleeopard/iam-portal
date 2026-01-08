#!/bin/bash
# Start the IAM Portal Backend

cd "$(dirname "$0")/backend"
source ../venv/bin/activate
python run.py
