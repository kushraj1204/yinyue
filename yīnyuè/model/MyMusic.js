let musicList = [{ "userId": 1, "musicId": [1, 2], "playMode": 2 }, { "userId": 2, "musicId": [3], "playMode": 2 }];
// playMode 1->Shuffle 2->Repeat 1 song 3->PLay same song on repeat

module.exports = class MyMusic {
    constructor(userId, musicId) {
        this.userId = userId;
        this.musicId = musicId;
    }

    static findByUserId = (userId) => {
                return musicList.find(x => x.userId == userId);
    }

    static getAll = () => {
        return musicList;
    }

    static hasMusicForUser = (musicId, userId) => {
        console.log(musicId,userId);
        console.log((musicList.find(x => x.userId == userId && x.musicId.indexOf(musicId) != -1)) !=null)
        return (musicList.find(x => x.userId == userId && x.musicId.indexOf(musicId) != -1) != null);
    }

    static addToMyMusic = (musicId, userId) => {
        const userIndex = musicList.findIndex(item => item.userId == userId);
        if (userIndex !== -1) {
            musicList[userIndex].musicId.push(musicId);
            console.log(musicList);
        } else {
            musicList.push({ userId, musicId: [musicId], playMode: 1 });
        }
    }

    static removeFromMyMusic = (musicId, userId) => {
        const userIndex = musicList.findIndex(item => item.userId == userId);
        if (userIndex !== -1) {
            musicList[userIndex].musicId = musicList[userIndex].musicId.filter(id => id !== musicId);
        }
    }

}