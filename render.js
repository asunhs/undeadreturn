(function (window) {


    var wrap = document.getElementById('wrap'),
        style = document.createElement('style'),
        WRAP_WIDTH = wrap.clientWidth,
        WRAP_HEIGHT = wrap.clientHeight,
        SIZE_INDEX = 0;

    document.body.appendChild(style);

    function insert(rule, index) {
        clear(index);
        style.sheet.insertRule(rule, index);
    }

    function clear(index) {
        while (style.sheet.rules[index]) {
            style.sheet.deleteRule(index);
        }
    }

    function removeChildren(parent) {
        for (var i=parent.children.length; i--;) {
            parent.children[i].remove();
        }
    }

    function makeASizeRule(x, y) {
        var width = WRAP_WIDTH / x,
            height = WRAP_HEIGHT / y;

        return 'div.tile { width: ' + width + 'px; height: ' + height + 'px; }';
    }

    function createFeature(feature) {
        var featureDiv = document.createElement('div');
        featureDiv.classList.add('feature');
        if (feature.name) {
            featureDiv.classList.add(feature.name);
        }

        if (feature.dead) {
            featureDiv.classList.add('dead');
        }

        return featureDiv;
    }

    function createTile(tile) {
        var tileDiv = document.createElement('div');
        tileDiv.classList.add('tile');
        tile.features.forEach(function (feature) {
            tileDiv.appendChild(createFeature(feature));
        });
        return tileDiv;
    }


    function Renderer(fields) {
        //this.init(fields);
        var renderer = this;

        fields.on('render', function () {
            renderer.init(fields);
        });
        fields.emit('render');
    }

    Renderer.prototype.init = function (fields) {
        this.fields = fields;
        removeChildren(wrap);
        insert(makeASizeRule(fields.width, fields.height), SIZE_INDEX);

        this.tiles = fields.iterate(function (tile) {
            var tileDiv = createTile(tile);
            wrap.appendChild(tileDiv);

            function tap() {
                tile.emit('tap');
            }

            tileDiv.addEventListener('click', tap);
            tileDiv.addEventListener('touchend', tap);

            return tileDiv;
        });
    };

    window.UndeadReturnRenderer = Renderer;


})(window);