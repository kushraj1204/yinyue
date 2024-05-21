const express = require('express');
const cors=require('cors');
const path=require('path');

const responseBody = require('./model/ResponseBody');
const authRouter = require('./router/AuthRouter');
const musicRouter = require('./router/MusicRouter');
const authFilter = require('./filter/AuthFilter');

const app = express();
app.use(cors());

app.options('*', cors())
app.use(express.json());

app.use("/resources/music/",express.static(path.join(__dirname,'resources')));
app.use('/auth', authRouter);
app.use(authFilter);
app.use('/music', musicRouter);

app.use((req, resp, next) => {
    resp.status(404).json(new responseBody(null, false, "Oops, the resource you've requested was not found"));
});
app.use((error, req, resp, next) => {
    console.log(error)
    resp.status(500).json(new responseBody(null, false, "Oops there was an error in processing your request. Please try again later"));
})


const port = process.env.PORT || 9700;

app.listen(port), () => {
    console.log(`Application served at port ${port}`);
}