// ============================================================
// Small UI flourishes shared by every page.
//  • String lights: any element with [data-garland] gets a strand
//    of fairy lights drawn across it (a nod to the lights strung
//    outside the main building).
// ============================================================
(function () {
    'use strict';

    var NS = 'http://www.w3.org/2000/svg';

    function buildGarland(host) {
        var W = 1600, H = 110, TOP = 4;
        // Uneven sags so it looks hung by hand, not drawn by a ruler.
        var sags = [
            { from: 0,    to: 430,  depth: 62 },
            { from: 430,  to: 980,  depth: 80 },
            { from: 980,  to: 1330, depth: 56 },
            { from: 1330, to: 1600, depth: 70 }
        ];
        var warm = ['#FFE3A3', '#FFC75F', '#FFD98A', '#FFB648'];

        var wire = '', bulbs = '', n = 0;

        sags.forEach(function (s) {
            var c = 2 * s.depth - TOP; // control point so the curve bottoms out at `depth`
            var xm = (s.from + s.to) / 2;
            wire += (wire ? ' ' : 'M ' + s.from + ' ' + TOP) +
                    ' Q ' + xm + ' ' + c + ' ' + s.to + ' ' + TOP;

            var count = Math.max(5, Math.round((s.to - s.from) / 58));
            for (var k = 1; k <= count; k++) {
                var t = k / (count + 1);
                var x = s.from + t * (s.to - s.from);
                var y = (1 - t) * (1 - t) * TOP + 2 * t * (1 - t) * c + t * t * TOP;
                var drop = 5 + ((n * 7) % 4);          // little stubs of different lengths
                var colour = warm[(n * 5) % warm.length];
                var dur = (2.6 + ((n * 13) % 10) / 6).toFixed(2);
                var delay = (-((n * 0.77) % 3.4)).toFixed(2);
                bulbs +=
                    '<line class="stub" x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) +
                    '" x2="' + x.toFixed(1) + '" y2="' + (y + drop).toFixed(1) + '"/>' +
                    '<circle class="bulb" cx="' + x.toFixed(1) + '" cy="' + (y + drop + 3.6).toFixed(1) +
                    '" r="3.6" fill="' + colour + '" filter="url(#bulb-glow)" style="animation-duration:' +
                    dur + 's;animation-delay:' + delay + 's"/>';
                n++;
            }
        });

        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
        svg.setAttribute('preserveAspectRatio', 'xMidYMin slice');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.innerHTML =
            '<defs><filter id="bulb-glow" x="-300%" y="-300%" width="700%" height="700%">' +
            '<feGaussianBlur stdDeviation="3.2" result="b"/>' +
            '<feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
            '</filter></defs>' +
            '<path class="wire" d="' + wire + '"/>' +
            bulbs;
        host.appendChild(svg);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var hosts = document.querySelectorAll('[data-garland]');
        for (var i = 0; i < hosts.length; i++) buildGarland(hosts[i]);
    });
})();
