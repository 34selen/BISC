FROM --platform=linux/amd64 node@sha256:a158d3b9b4e3fa813fa6c8c590b8f0a860e015ad4e59bbce5744d2f6fd8461aa

ENV DEBIAN_FRONTEND noninteractive
ENV DOCKERIZE_VERSION v0.2.0

RUN apt-get update -y
RUN apt-get install -y
RUN apt-get install wget -y
RUN rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \  
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN mkdir -p /app/src
RUN mkdir -p /company/resource/data/[*SECRET*]

WORKDIR /app

COPY ./src/package.json /app/src

WORKDIR /app/src

RUN npm cache verify
RUN npm cache clean --force

RUN npm install

WORKDIR /app

COPY . .

COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT /docker-entrypoint.sh

EXPOSE 8000