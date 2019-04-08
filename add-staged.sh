#!/bin/sh
set -e

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

for FILE in $STAGED_FILES
do
  git add "$FILE"
done
