'use strict';

/* Init from HTML */
(function () {
    var init = function () {
        var containers = document.querySelectorAll('player');

        Array.prototype.forEach.call(containers, function (el) {
            var params = Player.util.extend({
                container: el,
                backend: 'MediaElement',
                mediaControls: true
            }, el.dataset);

            el.style.display = 'block';

            var player = Player.create(params);

            if (el.dataset.peaks) {
                var peaks = JSON.parse(el.dataset.peaks);
            }

            player.load(el.dataset.url, peaks);
        });
    };

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
}());
