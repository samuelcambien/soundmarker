'use strict';

Player.MediaSession = {
    init: function (params) {
        this.params = params;

        var player = this.player = params.player;

        if (!this.player) {
            throw new Error('No Player instance provided');
        }

        if ('mediaSession' in navigator) {
            // update metadata
            this.metadata = this.params.metadata;
            this.update();

            // update metadata when playback starts
            var here = this;
            player.on('play', function() {
                here.update();
            });

            // set playback action handlers
            navigator.mediaSession.setActionHandler('play', function() {
                player.play();
            });
            navigator.mediaSession.setActionHandler('pause', function() {
                player.playPause();
            });
            navigator.mediaSession.setActionHandler('seekbackward', function() {
                player.skipBackward();
            });
            navigator.mediaSession.setActionHandler('seekforward', function() {
                player.skipForward();
            });
        }
    },

    update: function()
    {
        if (typeof MediaMetadata === typeof Function) {
            // set metadata
            navigator.mediaSession.metadata = new MediaMetadata(this.metadata);
        }
    }

};

Player.util.extend(Player.MediaSession, Player.Observer);
