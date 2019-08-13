require('dotenv').config() 

const express = require('express');
const morgan = require('morgan')
const marker = require('@ajar/marker')

const db = require('./db/mongoose.connection')
const user_router = require('./modules/user/user.router');
const auth_router = require('./modules/auth/auth.router');
const {error_handler,not_found} = require('./middleware/errors.handler');

const {API_PORT,API_HOST} = process.env;

const app = express();
app.use(morgan('dev'))

// test routing
app.get('/api', (req, res) => {
  res.status(200).json({ express: 'Hello From Express' });
});

// actual routing
app.use('/api/users', user_router);
app.use('/api/auth', auth_router);

// central error handling
app.use(error_handler);

//when no routes were matched...
app.use('*', not_found);


//start the express api server
(async ()=> {
  //connect to mongo db
  await db.connect();  
  await app.listen(API_PORT,API_HOST);
  marker.magenta(`api is live on`,`  ✨ ⚡  http://${API_HOST}:${API_PORT} ✨ ⚡`);  
})().catch(error=> marker.error(error))
