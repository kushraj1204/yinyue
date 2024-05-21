var playMode = 1;
var myPlaylist = [];
var currentSongIndex = 0;
window.onload = function () {
    redirectToLogin();
    fetchMusic();
    fetchMyPlayList();
    onAudioEnd();
    prevBtnListener();
    nextBtnListener();
    modeToggleListener();
}
function redirectToLogin() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.loggedIn) {
        window.location.replace('/login.html');
    }
}

async function fetchMusic() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert('User is not authenticated');
        window.location.replace('/login.html');
    }
    (async () => {
        try {
            const response = await fetch(serverUrl + "/music", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Access-Token': user.accessToken
                }
            });
            const data = await response.json();
            if (data.status)
                if (!response.ok) {
                    throw data;
                }
            if (data.status) {
                renderSongs(data.data);
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert(err.message);
        }
    })();

}


async function fetchMyPlayList() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert('User is not authenticated');
        window.location.replace('/login.html');
    }
    (async () => {
        try {
            const response = await fetch(serverUrl + "/music/playlist", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    'Access-Token': user.accessToken
                }
            });
            const data = await response.json();
            if (data.status)
                if (!response.ok) {
                    throw data;
                }
            if (data.status) {
                playMode = data.data.playMode;
                myPlaylist = data.data.myPlaylist;
                renderPlaylist(data.data);
                playNext();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert(err.message);
        }
    })();

}

async function addToPlayList() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert('User is not authenticated');
        window.location.replace('/login.html');
    }
    (async () => {
        try {
            const response = await fetch(serverUrl + "/music/playlist/add", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Access-Token': user.accessToken
                }
            });
            const data = await response.json();
            if (data.status)
                if (!response.ok) {
                    throw data;
                }
            if (data.status) {
                renderSongs(data.data);
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert(err.message);
        }
    })();

}



function renderSongs(data) {
    console.log("Inside render songs", data);
    html = "";
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        html += `<tr>
        <th scope="row">${element.id}</th>
        <td>${element.title}</td>
        <td>${element.id}</td>
        <td>+</td>
        </tr>`;
    }
    document.getElementById('musicBody').innerHTML = html;
}

function renderPlaylist(data) {
    console.log("Inside render playlist", data);
    html = "";
    for (let index = 0; index < data.myPlaylist.length; index++) {
        const element = data.myPlaylist[index];
        html += `<tr data-index=${index}>
        <th scope="row">${element.id}</th>
        <td>${element.title}</td>
        <td>${element.id}</td>
        <td><span class='removeFromPlayList' id="song${element.id}">-</span> <span class='playBtn' id="song${element.id}">Play</span></td>
        </tr>`;
    }
    document.getElementById('playlistBody').innerHTML = html;

    addPlayEventListeners();

}


function addPlayEventListeners() {
    document.querySelectorAll('.playBtn').forEach(span => {
        span.addEventListener('click', function () {
            let row = this.closest('tr');

            let title = row.children[1].textContent;
            currentSongIndex = parseInt(row.dataset.index, 10);
            loadSongForPlay(title);
        });
    });
}

function onAudioEnd() {
    let aud = document.getElementById("audioPlayer");
    aud.onended = function () {
        playNext();
    };
}

function playNext(direction) {
    if (direction == undefined) {
        direction = 1;
    }
    if (myPlaylist.length == 0) {
        return;
    }
    else {
        console.log(playMode)
        if (playMode == 1) {
            currentSongIndex = currentSongIndex;
            console.log("Playing song:", myPlaylist[currentSongIndex]);
        } else if (playMode == 2) {
            if (direction == 1) {
                currentSongIndex = (currentSongIndex + 1) % myPlaylist.length;
            }
            else {
                currentSongIndex = (currentSongIndex - 1 + myPlaylist.length) % myPlaylist.length;
            }
            console.log("Playing song:", myPlaylist[currentSongIndex]);
        } else if (playMode == 3) {
            currentSongIndex = Math.floor(Math.random() * myPlaylist.length);
            console.log("Playing song:", myPlaylist[currentSongIndex]);
        } else {
            console.log(playMode)
            console.error("Invalid playMode.Playing next in line");
            currentSongIndex = (currentSongIndex + 1) % myPlaylist.length;
        }
        loadSongForPlay(myPlaylist[currentSongIndex].title);
    }
}


function loadSongForPlay(title) {
    let sourceElement = document.getElementById('playingMusic');
    sourceElement.src = serverResourceUrl + title;
    let audioElement = sourceElement.parentElement;
    audioElement.load();
    audioElement.play();
}


function prevBtnListener() {
    const prevBtn = document.getElementById('prevBtn');
    prevBtn.addEventListener('click', () => {
        playNext(0);
    });
}

function nextBtnListener() {
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.addEventListener('click', () => {
        playNext();
    });
}

function modeToggleListener() { }




