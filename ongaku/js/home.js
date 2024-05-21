var playMode = 0;
var myPlaylist = [];
var currentSongIndex = 0;
window.onload = function () {
    redirectToLogin();
    fetchMusic();
    fetchMyPlayList();
    onAudioEnd();
    onAudioPlayPause();
    prevBtnListener();
    nextBtnListener();
    playPauseListener();
    modeToggleListener();
    logoutButtonListener();
}
function redirectToLogin() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.loggedIn) {
        window.location.replace('/login.html');
    }
    else{
        document.getElementById('username').innerText = "Welcome "+user.username;
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
            if (!response.ok) {
                if (response.status == 401) {
                    sessionStorage.removeItem('user');
                    redirectToLogin();
                }
                else {
                    throw data;
                }
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

            if (!response.ok) {
                if (response.status == 401) {
                    sessionStorage.removeItem('user');
                    redirectToLogin();
                }
                else {
                    throw data;
                }
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

async function addToPlayList(id) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert('User is not authenticated');
        window.location.replace('/login.html');
    }
    (async () => {
        try {
            const response = await fetch(serverUrl + "/music/" + id + "/playlist/add", {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Access-Token': user.accessToken
                }
            });
            const data = await response.json();

            if (!response.ok) {
                if (response.status == 401) {
                    sessionStorage.removeItem('user');
                    redirectToLogin();
                }
                else {
                    throw data;
                }
            }
            if (data.status) {
                fetchMyPlayList();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert(err.message);
        }
    })();

}


async function removeFromPlaylist(id) {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert('User is not authenticated');
        window.location.replace('/login.html');
    }
    (async () => {
        try {
            const response = await fetch(serverUrl + "/music/" + id + "/playlist/remove", {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Access-Token': user.accessToken
                }
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status == 401) {
                    sessionStorage.removeItem('user');
                    redirectToLogin();
                }
                else {
                    throw data;
                }
            }
            if (data.status) {
                fetchMyPlayList();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert(err.message);
        }
    })();

}





function renderSongs(data) {
    html = "";
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        html += `<tr data-index="${element.id}">
        <th scope="row">${element.id}</th>
        <td>${element.title}</td>
        <td>${element.releaseDate}</td>
        <td class="addToPlaylist"><i title="Add to Playlist" class="bi bi-plus-circle"></i></td>
        </tr>`;
    }
    document.getElementById('musicBody').innerHTML = html;
    addToPlaylistListeners();
}

function renderPlaylist(data) {
    html = "";
    for (let index = 0; index < data.myPlaylist.length; index++) {
        const element = data.myPlaylist[index];
        html += `<tr data-index=${index} data-id=${element.id}>
        <th scope="row">${element.id}</th>
        <td>${element.title}</td>
        <td>${element.releaseDate}</td>
        <td><span class='removeFromPlaylist' id="song${element.id}">
        <i title="Remove from Playlist" class="bi bi-dash-circle"></i></span> 
        <span class='playBtn' id="song${element.id}">
        <i title="Play" class="bi bi-play-circle"></i></span>
        </td>
        </tr>`;
    }
    document.getElementById('playlistBody').innerHTML = html;

    addPlayEventListeners();
    removeFromPlaylistListeners();

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


function addToPlaylistListeners() {
    document.querySelectorAll('.addToPlaylist').forEach(span => {
        span.addEventListener('click', function () {
            let row = this.closest('tr');
            let musicId = parseInt(row.dataset.index, 10);
            addToPlayList(musicId);
        });
    });
}

function removeFromPlaylistListeners() {
    document.querySelectorAll('.removeFromPlaylist').forEach(span => {
        span.addEventListener('click', function () {
            let row = this.closest('tr');
            let musicId = parseInt(row.dataset.id, 10);
            removeFromPlaylist(musicId);
        });
    });
}

function onAudioEnd() {
    let aud = document.getElementById("audioPlayer");
    aud.onended = function () {
        playNext();
    };
}

function onAudioPlayPause() {
    let aud = document.getElementById("audioPlayer");
    aud.onplay = function () {
        const playBtn = document.getElementById('play-pause');
        playBtn.className = "bi bi-pause-circle";
    };
    aud.onpause = function () {
        const playBtn = document.getElementById('play-pause');
        playBtn.className = "bi bi-play-circle";
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

        if (playMode == 0) {
            currentSongIndex = currentSongIndex;
        } else if (playMode == 1) {
            if (direction == 1) {
                currentSongIndex = (currentSongIndex + 1) % myPlaylist.length;
            }
            else {
                currentSongIndex = (currentSongIndex - 1 + myPlaylist.length) % myPlaylist.length;
            }
        } else if (playMode == 2) {
            currentSongIndex = Math.floor(Math.random() * myPlaylist.length);
        } else {
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
    document.getElementById('musicTitle').innerText=title;
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
function playPauseListener() {
    const playPauseBtn = document.getElementById('play-pause');
    playPauseBtn.addEventListener('click', () => {
        let aud = document.getElementById("audioPlayer");
        if (aud.paused) {
            aud.play();
        }
        else {
            aud.pause();
        }
    });

}

function modeToggleListener() {
    const modeBtn = document.getElementById('modeBtn');
    modeBtn.addEventListener('click', () => {
        playMode = (playMode + 1) % 3;
        if (playMode == 0) {
            modeBtn.title = "Repeat Current";
            modeBtn.className = "bi bi-repeat-1";
        }
        if (playMode == 1) {
            modeBtn.title = "Repeat Playlist";
            modeBtn.className = "bi bi-arrow-repeat";
        }
        if (playMode == 2) {
            modeBtn.title = "Shuffle";
            modeBtn.className = "bi bi-shuffle";
        }
    });

}


function logoutButtonListener() {
    const logoutBtn = document.getElementById('logoutButton');
    logoutBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to logout?") == true) {
            sessionStorage.removeItem('user');
            redirectToLogin();
        }
    });

}

