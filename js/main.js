        var binge_anime_player = null;

        // Function to change the server
        function server_change(server){
            if (document.player){
                document.player.server = server;
                document.player.reloadAnimeFile();
            }
        }

        

        class PlayerManager {
            constructor(elem) {
                this.elem = elem;
                this.hls = new Hls();
                this.server = 'gogocdn';
                this.state = 'IDLE';
                this.streams = { "default": "", "backup": "" };
                this.current_format = 'default';
                this.current_url = '';
            }

            getAnimeFile(ep_id) {
                const url = `https://api.consumet.org/anime/gogoanime/watch/${ep_id}?server=${this.server}`;
                this.current_url = url;
                // Use fetch instead of XMLHttpRequest for simplicity
                fetch(url)
                    .then(response => response.json())
                    .then(responseData => {
                        // console.log(responseData.sources[responseData.sources.length - 1].url);
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
                // Use fetch instead of XMLHttpRequest for simplicity
                fetch(url)
                    .then(response => response.json())
                    .then(responseData => {
                        // console.log(responseData.sources[responseData.sources.length - 1].url);
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
                this.hls.loadSource(this.streams[this.current_format]);
                this.hls.attachMedia(this.elem);
            }
        }
        function main(){
          const video = document.getElementById('video');
          const binge_anime_player = new PlayerManager(video);
          document.player = binge_anime_player;
        }
        main()
