# All Stars

## Getting Started 

```
git clone
yarn install
yarn validate 
```

Create a `.env` file in the root of the repo and add this line:

```
NODE_ENV=development
```

## Express API

```
yarn api
```

You can now hit the api locally here:

http://localhost:3001/api

## React App

```
yarn start
```

Your browser should open with the React app here:

http://localhost:3000/


## Husky

We are using [husky](https://github.com/typicode/husky) on this project, so make sure that your repo passes the linter and tests before pushing.

## Lambda

https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/functions/nbaallstars-dev-app?tab=graph

## API Endpoint

https://o3zt8boj60.execute-api.us-west-2.amazonaws.com/dev/api