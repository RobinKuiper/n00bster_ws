FROM node:latest
WORKDIR /usr/src/app
COPY ../package.json yarn.lock ./
RUN yarn
COPY .. ./
EXPOSE 8081
CMD [ "node", "server.js" ]
