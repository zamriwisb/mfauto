#!/bin/sh
# Copy the two shortlisted mockups (v3b, v24b) from ../website into this folder for GitHub Pages.
# index.html (the Option 1 / Option 2 chooser) and assets/chooser/ are maintained here, not copied.
set -e
cd "$(dirname "$0")"
SRC=../website
rm -rf v3b v24b assets/img assets/shortlist
mkdir -p assets/img
cp -R "$SRC/v3b" "$SRC/v24b" .
cp "$SRC"/assets/img/* assets/img/
touch .nojekyll
