#!/usr/bin/env bash
# Sustituye el marcador __SITE_URL__ por el dominio definitivo del portfolio
# en index.html, robots.txt y sitemap.xml.
# Uso:  ./set-site-url.sh https://tu-dominio.com
set -euo pipefail
if [ $# -ne 1 ]; then echo "Uso: $0 https://tu-dominio.com" >&2; exit 1; fi
URL="${1%/}"
case "$URL" in https://*) ;; *) echo "La URL debe empezar por https://" >&2; exit 1;; esac
cd "$(dirname "$0")"
for f in index.html robots.txt sitemap.xml; do
  sed -i.bak "s|__SITE_URL__|$URL|g" "$f" && rm -f "$f.bak"
done
echo "Dominio configurado: $URL"
