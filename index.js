const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();

// App setup

app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
app.use(bodyParser.urlencoded({ extended: true }));

// Db Setup

mongoose.connect(
    "mongodb://localhost:27017/authDB", 
    {
        useUnifiedTopology: true, 
        useNewUrlParser: true
    }
);

console.log("MongoDb Connected");

router(app);

// server setup

const port = process.env.PORT || 3090;
app.listen(port, () => {
    console.log("Server Started Successfully on " + port);
});
