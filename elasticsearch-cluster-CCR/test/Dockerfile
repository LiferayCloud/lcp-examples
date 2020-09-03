FROM node:14.2.0

WORKDIR /elasticsearch_test

COPY --chown=root:root package.json /elasticsearch_test/package.json
COPY --chown=root:root ./src/entrypoint.sh /usr/local/bin/entrypoint
COPY --chown=root:root ./src/index.js /elasticsearch_test/index.js

RUN cd /elasticsearch_test \
   && npm i

ENTRYPOINT [ "/usr/local/bin/entrypoint" ]
