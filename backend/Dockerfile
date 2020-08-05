FROM node:14-alpine AS builder

ENV NODE_ENV=production

RUN mkdir /src
COPY . /src
WORKDIR /src
RUN npm run install && npm run build
RUN rm -R node_modules/


FROM node:14-alpine

RUN mkdir /app
COPY --from=builder /src /src/app
WORKDIR /src
RUN npm install --production

CMD [ "npm run prod" ]
