#!/bin/bash

if [ -z "$GITHUB_REPO_URL" ] || [ -z "$GITHUB_ACCESS_TOKEN" ] || [ -z "$GOLLUM_APP_USE_BRANCH" ]; then
  echo "Error: The necessary environment variables are not set"
  exit 1
fi

cd /
git clone $GITHUB_REPO_URL wikiRepository

cd /wikiRepository
git config credential.helper 'store --file=.git/credentials'
echo "https://${GITHUB_ACCESS_TOKEN}:x-oauth-basic@github.com" > .git/credentials

if [ -n "$GIT_USER_NAME" ] && [ -n "$GIT_USER_EMAIL" ]; then
  git config user.name $GIT_USER_NAME
  git config user.email $GIT_USER_EMAIL
fi

crond
echo "* * * * * /shell/git_sync.sh" | crontab -

git checkout $GOLLUM_APP_USE_BRANCH
gollum --config ../config.rb
