let musicList = [
    {
        "title": "Time in a Bottle.mp3",
        "id": 1,
        "releaseDate": "1972"
    },
    {
        "title": "What A Wonderful World.mp3",
        "id": 2,
        "releaseDate": "1967"
    },
    {
        "title": "A Man Without Love.mp3",
        "id": 3,
        "releaseDate": "1968"
    },
    {
        "title": "Blinding Lights.mp3",
        "id": 4,
        "releaseDate": "2019"
    },
    {
        "title": "Blowin' in the Wind.mp3",
        "id": 5,
        "releaseDate": "1963"
    },
    {
        "title": "Dog Days Are Over.mp3",
        "id": 6,
        "releaseDate": "2008"
    },
    {
        "title": "Familiar.mp3",
        "id": 7,
        "releaseDate": "2018"
    },
    {
        "title": "In the Meantime.mp3",
        "id": 8,
        "releaseDate": "1996"
    },
    {
        "title": "Sunflower - Spider-Man_ Into the Spider-Verse.mp3",
        "id": 9,
        "releaseDate": "2018"
    },
    {
        "title": "Sweet Child O' Mine.mp3",
        "id": 10,
        "releaseDate": "1987"
    },
    {
        "title": "Twilight of the Gods.mp3",
        "id": 13,
        "releaseDate": "2015"
    },
    {
        "title": "Hero-One-Punch-Man.mp3",
        "id": 11,
        "releaseDate": "2015"
    },
    {
        "title": "goforbaroque.mp3",
        "id": 12,
        "releaseDate": "2015"
    }
];


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