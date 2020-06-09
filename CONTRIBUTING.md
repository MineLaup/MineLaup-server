# Contributing

## Front-End side

### Prerequisites

To contribute to this project, you will need theses requirements:
- NodeJS >= 10

### Installing

In the first step you fork the repo. After have cloned the project, you will need to install all dependencies and prepare the development environment:
```sh
# Create local copy of the master branch
$ git branch master origin/master
# Init Git flow with defaults configurations
$ git flow init -d
# Install npm dependencies
$ npm install
```

Now you are ready to start development.

### Start a feature

To start a feature, you need to create a new branch:
```sh
# Init a new branch with Git flow
$ git flow feature start *your-branch*
```

Once you have finish you modification and commit your code, just do:
```sh
$ git push -u origin *your-branch*
```

### Make a pull request

After pushed your commit on Github, you can make a pull request to the main repository and wait for a code reviewing and that your modification are accepted.

## Running tests

To run tests, you just have do do theses commands:

```sh
# Run all tests
$ npm run test
```