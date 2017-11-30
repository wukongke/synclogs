FROM node:9

COPY package.tgz /tmp
RUN mkdir /tmp/app && \
	tar -xvf /tmp/package.tgz -C /tmp/app && \
	mkdir /app
WORKDIR /app
RUN cp /tmp/app/package.json /app/package.json && \
  npm i -g cnpm --registry=https://registry.npm.taobao.org && \
  cnpm i --production && \
	cp -r /tmp/app/* /app/

ENV PORT=3000
ENV LOG_LEVEL=
ENV NODE_ENV=
ENV MONGO_DB=

CMD ["node", "/app/dist/app.js"]
EXPOSE 3000