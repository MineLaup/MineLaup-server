# Installation guide

The Minelaup server is separated in 2 parts: the backend with an API and the frontend only used to have an user interface.

If you want, you can install only the backend and use the API with your own user interface but the official one is recommended.

### Install the Back-End

```sh
# move to backend/ folder
$ cd backend/

# install dependencies
$ npm install

# copy (and edit) the env file
$ cp .env.example .env

# build a first time
$ npm run build

# generate the app key
$ node ace generate:key

# if you are using SQLite
$ mkdir tmp/

# migrate the database
$ node ace migrate:run

# install the admin user
$ node ace install

# run the server
$ npm run prod
```

### Install the Front-End

```sh
# move to frontend/ folder
$ cd frontend/

# install dependencies
$ npm install

# build from sources
$ npm run build

# run the server
$ npm start
```