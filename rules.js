(function (window) {



    function adjustBasicRules(fields) {

        var heroes = fields.findFeatures(Feature.CHARACTOR_TYPE);



        function moveMonster(monsters) {

            var dm = new DistanceMap(fields, heroes.map(function (hero) {
                return [hero.tile.x, hero.tile.y];
            }));

            monsters.forEach(function (monster) {
                if (monster.dead) {
                    return;
                }

                var next = dm.step(monster.tile.x, monster.tile.y);
                monster.tile.move(monster, fields.map[next[0]][next[1]]);
            });

        }



        function findMovingTarget(tile) {
            return heroes.find(function (hero) {
                var dx = hero.tile.x - tile.x,
                    dy = hero.tile.y - tile.y;

                return (dx == 0 && (dy == -1 || dy == 1)) || (dy == 0 && (dx == -1 || dx == 1));
            });
        }

        function getNonMonster(tile) {
            tile.features.filter(function (feature) {
                return feature.type != Feature.MONSTER_TYPE;
            });
        }

        function killingMonster(tile) {
            tile.features.filter(function (feature) {
                return feature.type == Feature.MONSTER_TYPE;
            }).forEach(function (monster) {
                monster.dead = true;
            });
        }



        fields.iterate(function (tile) {
            tile.on('tap', function (eventName, data) {

                var target = findMovingTarget(tile);

                if (!target) {
                    return;
                }

                // action 분기
                if (tile.canMoveIn()) {
                    target.tile.move(target, tile);
                } else if (!getNonMonster(tile)) {
                    killingMonster(tile);
                } else {
                    return;
                }

                moveMonster(fields.findFeatures(Feature.MONSTER_TYPE));
                fields.emit('render');
            });
        });

    }


    window.Rules = {
        adjustBasicRules: adjustBasicRules
    };

})(window);