let accessTokens = [{ "username": "kush", "accessToken": "sampleAccessToken" }];
module.exports = class LoginResponse {
    constructor(username, email, accessToken) {
        this.username = username;
        this.email = email;
        this.accessToken = accessToken;
    }

    static findToken = (accessToken) => {
        console.log(accessTokens)
        console.log(accessToken)
        return accessTokens.find(x => x.accessToken === accessToken);
    }

    addToken = () => {
        console.log(this);
        accessTokens = accessTokens.filter(x => x.accessToken != this.username);
        accessTokens.push({ "username": this.username, "accessToken": this.accessToken });
        console.log("tokens now")
        console.log(accessTokens)
    }
}