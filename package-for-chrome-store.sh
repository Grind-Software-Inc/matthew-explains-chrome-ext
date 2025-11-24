#!/bin/bash

VERSION=$(jq -r '.version' manifest.json)
SCRIPT_NAME=$(basename "$0")
PACAKAGE_NAME=matthew-explains-chrome-ext-$VERSION.zip

zip -r $PACAKAGE_NAME . -x $PACAKAGE_NAME -x $SCRIPT_NAME -x ".git/*" -x .gitignore -x "*:Zone.Identifier"
