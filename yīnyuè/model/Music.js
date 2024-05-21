let musicList = [{ "title": "Hero-One-Punch-Man.mp3", "id": 1,releaseDate:"2020/01/01" }, { "title": "goforbaroque.mp3", "id": 2,releaseDate:"2020/01/01" }, { "title": "Twilight of the Gods.mp3", "id": 3,releaseDate:"2020/01/01" }];

module.exports = class Music {
    constructor(id, title, artists, genre, releaseDate) {
        this.id = id;
        this.title = title;
        this.artists = artists;
        this.genre = genre;
        this.releaseDate = releaseDate;
    }

    static findById = (id) => {
        return musicList.find(x => x.id === id);
    }
    static findByTitle = (title) => {
        return musicList.find(x => x.title === title);
    }

    static getAll = () => {
        return musicList;
    }

    static getAllByIds = (ids) => {
        return musicList.filter(x => ids.indexOf(x.id) != -1);
    }

}