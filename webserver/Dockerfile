FROM nginx:latest

ENV WHITELISTED_IP=0.0.0.0
ENV SERVICE_ELASTICSEARCH_ID=search
ENV LCP_CPU=2
ENV WORKER_CONNECTIONS=10000
ENV KEEP_ALIVE_TIMEOUT=65
ENV HEALTH_CHECK_CIDR_IP=10.0.0.0/8

RUN apt-get update \
    && apt-get install -y \
      curl \
      zlib1g \
      libpcre3-dev \
      zlib1g-dev \
      gcc \
      make \
      build-essential \
      libpcre3 \
      unzip \
      uuid-dev \
      libssl-dev \
      vim \
      procps \
      krb5-multidev \
      libkrb5-dev \
      git

RUN rm /etc/nginx/conf.d/default.conf

COPY --chown=nginx:nginx ./nginx/nginx.conf /nginx.conf
COPY --chown=nginx:nginx entrypoint.sh /usr/local/bin/

EXPOSE 80

ENTRYPOINT [ "entrypoint.sh" ]
