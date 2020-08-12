#!/bin/bash

set -o errexit
set -o pipefail

envsubst < /nginx.conf > /etc/nginx/nginx.conf

exec /usr/sbin/nginx -g 'daemon off;'