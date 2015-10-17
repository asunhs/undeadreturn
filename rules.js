(function (window) {



    function adjustBasicRules(fields) {

        var heroes = fields.findFeatures(Feature.CHARACTOR_TYPE),
            dm = new DistanceMap(fields, heroes.map(function (tile) {
                return [tile.x, tile.y];
            }));

        fields.iterate(function (tile) {
            tile.on('addedFeature', function (eventName, data) {

            });
        });

        console.table(dm.map);

    }


    window.Rules = {
        adjustBasicRules: adjustBasicRules
    };

})(window);