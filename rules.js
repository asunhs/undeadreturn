(function (window) {



    function adjustBasicRules(fields) {

        var heroes = fields.findFeatures(Feature.CHARACTOR_TYPE);



        function moveMonster(monsters) {

            var dm = new DistanceMap(fields, heroes.map(function (hero) {
                return [hero.tile.x, hero.tile.y];
            }));

            monsters.forEach(function (monster) {
                var next = dm.step(monster.tile.x, monster.tile.y);
                monster.tile.move(monster, fields.map[next[0]][next[1]]);
            });

        }



        function findMovingTarget(tile) {

            var target = heroes.find(function (hero) {
                var dx = hero.tile.x - tile.x,
                    dy = hero.tile.y - tile.y;

                return (dx == 0 && (dy == -1 || dy == 1)) || (dy == 0 && (dx == -1 || dx == 1));
            });

            if (!target) {
                return;
            }

            if (!target.physical) {
                return target;
            }

            if (tile.features.some(function (feature) {
                return feature.physical;
            })) {
                return;
            }

            return target;
        }

        fields.iterate(function (tile) {
            tile.on('tap', function (eventName, data) {

                var target = findMovingTarget(tile);

                if (!target) {
                    return;
                }

                target.tile.move(target, tile);
                moveMonster(fields.findFeatures(Feature.MONSTER_TYPE));
                fields.emit('render');
            });
        });

    }


    window.Rules = {
        adjustBasicRules: adjustBasicRules
    };

})(window);