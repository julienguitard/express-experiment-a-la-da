#!/usr/bin/zsh
extension=$1
echo "extension:$extension"
git ls-files | grep "\.$extension" | xargs wc -l