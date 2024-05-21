const music = require('../model/Music');
const user = require('../model/User');
const myMusic = require('../model/MyMusic');
const responseBody = require('../model/ResponseBody');
const loginResponse = require('../model/LoginResponse');

module.exports.getAllMusic = (req, res, next) => {
    let allMusic = music.getAll();
    res.status(200).json(new responseBody(allMusic));
}

module.exports.getMyMusic = (req, res, next) => {
    const accessToken = req.headers['access-token'];
    const token = loginResponse.findToken(accessToken);
    let loginUser = user.findByUsername(token.username);

    let allMusic = music.getAll();
    let myMusicChoice = myMusic.findByUserId(loginUser.id);
    console.log(myMusicChoice)

    let myPlaylist = [];
    if (myMusicChoice) {
        console.log(myMusicChoice);
        let myMusicIds = myMusicChoice.musicId;
        console.log(myMusicIds)
        allMusic.forEach(element => {
            if (myMusicIds.indexOf(element.id) != -1) {
                myPlaylist.push(element);
            }
        });
    }
    let playMode = myMusicChoice?.playMode ?? 1;

    res.status(200).json(new responseBody({myPlaylist,playMode}));
}

module.exports.addToMyMusic = (req, res, next) => {
    const accessToken = req.headers['access-token'];
    const token = loginResponse.findToken(accessToken);
    let loginUser = user.findByUsername(token.username);
    const reqBody = req.body;
    const musicId = reqBody.musicId;

    if (myMusic.hasMusicForUser(musicId, loginUser.id)) {
        res.status(409).json(new responseBody(null, "Music Already in the playlist"));
    }
    else {
        myMusic.addToMyMusic(musicId, loginUser.id);
        res.status(200).json(new responseBody(null, "Added to playlist successfully", true));
    }
}

module.exports.removeFromMyMusic = (req, res, next) => {
    const accessToken = req.headers['access-token'];
    const token = loginResponse.findToken(accessToken);
    let loginUser = user.findByUsername(token.username);
    const reqBody = req.body;
    const musicId = reqBody.musicId;

    if (!myMusic.hasMusicForUser(musicId, loginUser.id)) {
        res.status(409).json(new responseBody(null, "Music not in the playlist"));
    }
    else {
        myMusic.removeFromMyMusic(musicId, loginUser.id);
        res.status(200).json(new responseBody(null, "Removed from playlist successfully", true));
    }
}
