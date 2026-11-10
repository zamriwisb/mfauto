#!/bin/sh
# Copy the two shortlisted mockups (v3b, v24b) from ../website into this folder for GitHub Pages.
set -e
cd "$(dirname "$0")"
SRC=../website
rm -rf v3b v24b assets
mkdir -p assets/img assets/shortlist
cp -R "$SRC/v3b" "$SRC/v24b" .
cp "$SRC"/assets/img/* assets/img/
cp "$SRC/assets/shortlist/v3b.jpg" "$SRC/assets/shortlist/v24b.jpg" assets/shortlist/
# Landing page = shortlist, without the link to the full 35-version list
sed -e 's#<a class="link-all" href="versions.html">Semua 35 versi</a>##' \
    -e 's#href="shortlist.html"#href="./"#' "$SRC/shortlist.html" > index.html
touch .nojekyll
