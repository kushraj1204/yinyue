const user = require('../model/User');
const responseBody = require('../model/ResponseBody');
const loginResponse = require('../model/LoginResponse');

module.exports.login = (req, res, next) => {
    let reqBody = req.body;
    let loginUser = user.findByUsername(reqBody.username);
    if (loginUser) {
        if (loginUser.password == reqBody.password) {
            const accessToken = crypto.randomUUID() + "-" + Date.now() + "-" + loginUser.username;
            console.log(accessToken);
            const resp = new loginResponse(loginUser.username, loginUser.email, accessToken);
            resp.addToken();
            res.status(200).json(new responseBody(resp, "Login Successful"));
            console.log(resp)
        }
        else {
            res.status(401).json(new responseBody(null, "Invalid Credentials"));
        }
    }
    else {
        res.status(401).json(new responseBody(null, "User does not exist"));
    }
}

module.exports.logout = (req, res, next) => {
    let reqBody = req.body;
    let loginUser = user.findByUsername(reqBody.username);
    if (loginUser) {
        if (loginUser.password == reqBody.password) {
            const accessToken = crypto.randomUUID() + "-" + Date.now() + "-" + loginUser.username;
            console.log(accessToken);
            const resp = new loginResponse(loginUser.username, loginUser.email, accessToken);
            resp.addToken();
            console.log(resp)
            res.status(200).json(new responseBody(resp, "Login Successful"));
            console.log(resp)
        }
        else {
            res.status(401).json(new responseBody(null, "Invalid Credentials"));
        }
    }
    else {
        res.status(401).json(new responseBody(null, "User does not exist"));
    }
}