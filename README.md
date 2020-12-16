# A TodoList Web Application

This is a TodoList web app that allow users to be able to create list of tasks to do.The data is then stored and saved on MongoDB database.
## Requirements
* Node 8
* Express
* Git
* MongoDB 

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.
MongoDB available from mongodb.or/ and Node driver from https://npmjs.org/package/mongodb

```sh
git clone git@github.com:AifuwaRoland/TodoList.git
cd TodoList
npm install
npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```


[![Heroku live app](https://www.herokucdn.com/deploy/button.png)](https://devcenter.heroku.com/start/)