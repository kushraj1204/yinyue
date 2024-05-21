let users = [{ "id": "1", "username": "kush", "password": "1234", "email": "kushraj1204@gmail.com" },
{ "id": "2", "username": "tina", "password": "abcd", "email": "tinaxing@miu.edu" }
]
module.exports = class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static findByUsername = (username) => {
        return users.find(x => x.username === username);
    }

}