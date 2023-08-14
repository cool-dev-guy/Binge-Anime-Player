var binge_anime_player = null;
var hlsInstance = null;

function server_change(server) {
    if (document.player) {
        document.player.server = server;
        document.player.reloadAnimeFile();
    }
}

const video = document.getElementById('video');

class PlayerManager {
    constructor(elem) {
        this.elem = elem;
        this.server = 'gogocdn';
        this.state = 'IDLE';
        this.streams = { "default": "", "backup": "" };
        this.current_format = 'default';
        this.current_url = '';
    }

    getAnimeFile(ep_id) {
        const url = `https://api.consumet.org/anime/gogoanime/watch/${ep_id}?server=${this.server}`;
        this.current_url = url;
        
        fetch(url)
            .then(response => response.json())
            .then(responseData => {
                this.state = 'SOURCE RECEIVED';
                this.streams['default'] = responseData.sources[responseData.sources.length - 2].url;
                this.streams['backup'] = responseData.sources[responseData.sources.length - 1].url;

                this.playAnimeFile();
            })
            .catch(error => {
                this.state = 'ERROR';
                console.error("Fetch error:", error);
            });
    }

    reloadAnimeFile() {
        const url = this.current_url;

        fetch(url)
            .then(response => response.json())
            .then(responseData => {
                this.state = 'SOURCE RECEIVED';
                this.streams['default'] = responseData.sources[responseData.sources.length - 2].url;
                this.streams['backup'] = responseData.sources[responseData.sources.length - 1].url;

                this.playAnimeFile();
            })
            .catch(error => {
                this.state = 'ERROR';
                console.error("Fetch error:", error);
            });
    }

    playAnimeFile() {
        this.state = 'FILE LOADED';

        if ('webkitMediaSource' in HTMLMediaElement.prototype) {
            this.elem.src = this.streams[this.current_format];
        } else {
            if (!hlsInstance) {
                hlsInstance = new Hls();
            }
            
            hlsInstance.loadSource(this.streams[this.current_format]);
            hlsInstance.attachMedia(this.elem);
        }
    }
}

binge_anime_player = new PlayerManager(video);
document.player = binge_anime_player;
