#!/bin/bash

cd /wikiRepository

set -e

git fetch origin

DIFF=$(git rev-list HEAD...origin/$GOLLUM_APP_USE_BRANCH --count)
if [ "$DIFF" != "0" ]; then
  git pull origin $GOLLUM_APP_USE_BRANCH
fi

DIFF_PUSH=$(git rev-list HEAD...origin/$GOLLUM_APP_USE_BRANCH --count)
if [ "$DIFF_PUSH" != "0" ]; then
  git push origin $GOLLUM_APP_USE_BRANCH
fi
