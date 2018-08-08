'use strict';

/* Minimap */
Player.Minimap = Player.util.extend({}, Player.Drawer, Player.Drawer.Canvas, {
    init: function (player, params) {
        this.player = player;
        this.container = this.player.drawer.container;
        this.lastPos = this.player.drawer.lastPos;
        this.params = player.util.extend(
            {}, this.player.drawer.params, {
                showRegions: false,
                showOverview: false,
                overviewBorderColor: 'green',
                overviewBorderSize: 2
            }, params, {
                scrollParent: false,
                fillParent: true
            }
        );

        this.width = 0;
        this.height = this.params.height * this.params.pixelRatio;

        this.createWrapper();
        this.createElements();

        if (Player.Regions && this.params.showRegions) {
            this.regions();
        }

        this.bindPlayerEvents();
        this.bindMinimapEvents();
    },
    regions: function() {
        var my = this;
        this.regions = {};

        this.player.on('region-created', function(region) {
            my.regions[region.id] = region;
            my.renderRegions();
        });

        this.player.on('region-updated', function(region) {
            my.regions[region.id] = region;
            my.renderRegions();
        });

        this.player.on('region-removed', function(region) {
            delete my.regions[region.id];
            my.renderRegions();
        });
    },
    renderRegions: function() {
        var my = this;
        var regionElements = this.wrapper.querySelectorAll('region');
        for (var i = 0; i < regionElements.length; ++i) {
          this.wrapper.removeChild(regionElements[i]);
        }

        Object.keys(this.regions).forEach(function(id){
            var region = my.regions[id];
            var width = (my.width * ((region.end - region.start) / my.player.getDuration()));
            var left = (my.width * (region.start / my.player.getDuration()));
            var regionElement = my.style(document.createElement('region'), {
                height: 'inherit',
                backgroundColor: region.color,
                width: width + 'px',
                left: left + 'px',
                display: 'block',
                position: 'absolute'
            });
            regionElement.classList.add(id);
            my.wrapper.appendChild(regionElement);
        });
    },
    createElements: function() {
        Player.Drawer.Canvas.createElements.call(this);

        if (this.params.showOverview) {
            this.overviewRegion =  this.style(document.createElement('overview'), {
                height: (this.wrapper.offsetHeight - (this.params.overviewBorderSize * 2)) + 'px',
                width: '0px',
                display: 'block',
                position: 'absolute',
                cursor: 'move',
                border: this.params.overviewBorderSize + 'px solid ' + this.params.overviewBorderColor,
                zIndex: 2,
                opacity: this.params.overviewOpacity
            });

            this.wrapper.appendChild(this.overviewRegion);
        }
    },

    bindPlayerEvents: function () {
        var my = this;
        // render on load
        this.render();
        this.player.on('audioprocess', function (currentTime) {
            my.progress(my.player.backend.getPlayedPercents());
        });
        this.player.on('seek', function(progress) {
            my.progress(my.player.backend.getPlayedPercents());
        });

        if (this.params.showOverview) {
            this.player.on('scroll', function(event) {
                if (!my.draggingOverview) {
                    my.moveOverviewRegion(event.target.scrollLeft / my.ratio);
                }
            });

            this.player.drawer.wrapper.addEventListener('mouseover', function(event) {
                if (my.draggingOverview)  {
                    my.draggingOverview = false;
                }
            });
        }

        var prevWidth = 0;
        var onResize = this.player.util.debounce(function () {
            if (prevWidth != my.wrapper.clientWidth) {
                prevWidth = my.wrapper.clientWidth;
                my.render();
                my.progress(my.player.backend.getPlayedPercents());
            }
        }, 100);
        window.addEventListener('resize', onResize, true);
        window.addEventListener('orientationchange', onResize, true);

        this.player.on('destroy', function () {
            my.destroy.bind(this);
            window.removeEventListener('resize', onResize, true);
        });
    },

    bindMinimapEvents: function () {
        var my = this;
        var relativePositionX = 0;
        var seek = true;
        var positionMouseDown = {
            clientX: 0,
            clientY: 0
        };

        this.on('click', (function (e, position) {
            if (seek)  {
                this.progress(position);
                this.player.seekAndCenter(position);
            } else {
                seek = true;
            }
        }).bind(this));

        if (this.params.showOverview) {
            this.overviewRegion.addEventListener('mousedown', function(event) {
                my.draggingOverview = true;
                relativePositionX = event.layerX;
                positionMouseDown.clientX = event.clientX;
                positionMouseDown.clientY = event.clientY;
            });

            this.wrapper.addEventListener('mousemove', function(event) {
                if(my.draggingOverview) {
                    my.moveOverviewRegion(event.clientX - my.container.getBoundingClientRect().left - relativePositionX);
                }
            });

            this.wrapper.addEventListener('mouseup', function(event) {
                if (positionMouseDown.clientX - event.clientX === 0 && positionMouseDown.clientX - event.clientX === 0) {
                    seek = true;
                    my.draggingOverview = false;
                } else if (my.draggingOverview)  {
                    seek = false;
                    my.draggingOverview = false;
                }
            });
        }
    },

    render: function () {
        var len = this.getWidth();
        var peaks = this.player.backend.getPeaks(len, 0, len);
        this.drawPeaks(peaks, len, 0, len);

        if (this.params.showOverview) {
            //get proportional width of overview region considering the respective
            //width of the drawers
            this.ratio = this.player.drawer.width / this.width;
            this.waveShowedWidth = this.player.drawer.width / this.ratio;
            this.waveWidth = this.player.drawer.width;
            this.overviewWidth = (this.width / this.ratio);
            this.overviewPosition = 0;
            this.overviewRegion.style.width = (this.overviewWidth - (this.params.overviewBorderSize * 2)) + 'px';
        }
    },
    moveOverviewRegion: function(pixels) {
        if (pixels < 0) {
            this.overviewPosition = 0;
        } else if (pixels + this.overviewWidth < this.width) {
            this.overviewPosition = pixels;
        } else {
            this.overviewPosition = (this.width - this.overviewWidth);
        }
        this.overviewRegion.style.left = this.overviewPosition + 'px';
        this.player.drawer.wrapper.scrollLeft = this.overviewPosition * this.ratio;
    }
});


Player.initMinimap = function (params) {
    var map = Object.create(Player.Minimap);
    map.init(this, params);
    return map;
};
