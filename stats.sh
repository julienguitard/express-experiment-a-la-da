#!/usr/bin/zsh
git ls-files | grep '\.sql' | xargs wc -l