require("dotenv").config();
const express    = require('express');
const bodyParser = require('body-parser');
const path       = require('path');
const cors       = require('cors');
const logger     = require('logger').createLogger('development.log')
// @Init App

const app = express();
app.set('deviceKey', 'Prem_Maurya');
const http = require('http').Server(app);
const io   = require('socket.io')(http);
require("./DBConnection");

// @Route Define
var area        = require('./routes/areaManage')(io);
var User        = require('./routes/EnvDevice');
var memberRoute = require('./routes/memberRoute');
var teamRoute   = require('./routes/teamRoute');

app.use(bodyParser.json({ limit: '500000mb' }));
app.use(bodyParser.urlencoded({ limit: '500000mb', extended: true, parameterLimit: 10000000000 }));

// @Set Static Folder
// app.get('*', express.static(path.join(__dirname, 'build')));

// app.use(express.static(path.join(__dirname, "build")));
// app.get("*", (req, res, next) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"));
// });
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
    const allowedOrigins = ['https://env.shunyaekai.com','http://192.168.1.41:3030'];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Accept, Authorization, authorization');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET, POST, PUT, DELETE');
    next();
});

app.use(cors());
app.use(cors({
    exposedHeaders: ['Authorization', 'authorization', 'x-api-key', 'x-token', 'x-authorization', 'x-Authorization',],
}));

// @Router Call
app.use('/api', area);
app.use('/api', User);
app.use('/api', memberRoute);
app.use('/api', teamRoute);

const start = async () => {
    try {
        http.listen(process.env.PORT, (err) => {
            if (err) throw err;
            console.log(`Listing To port ${process.env.PORT}`);
        })
    } catch (err) {
        console.log(err);
    }
}
start();
