var fields = new Fields(9, 9),
    hero = new Feature(Feature.CHARACTOR_TYPE),
    hero2 = new Feature(Feature.CHARACTOR_TYPE),
    mob = new Feature(Feature.MONSTER_TYPE),
    mob2 = new Feature(Feature.MONSTER_TYPE);

hero.physical = true;
hero.name = 'hero';
hero2.physical = true;
hero2.name = 'hero';
mob.physical = true;
mob.name = 'mob';
mob2.physical = true;
mob2.name = 'mob';

/*fields.iterate(function (tile) {
    tile.on('addedFeature', function (eventName, data) {
        if (data.feature.type !== Feature.OBJECT_TYPE) {
            console.log(data);
        }
    });
});*/

function setObjects(arr) {
    arr.forEach(function (pos) {
        var object = new Feature(Feature.OBJECT_TYPE);
        object.physical = true;
        object.name = 'wall';
        fields.setFeature(object, pos[0], pos[1]);
    });
}

setObjects([[2,1],[1,1],[1,2],[1,3],[0,3]]);
setObjects([[4,2],[4,3],[4,4],[5,4],[6,4]]);
setObjects([[0,6],[1,6],[2,6],[3,6],[4,6],[4,7]]);

fields.setFeature(hero, 5, 7);
//fields.setFeature(hero2, 6, 8);
fields.setFeature(mob, 4, 1);
fields.setFeature(mob2, 7, 2);



//var dm = new DistanceMap(fields, [[5, 7], [6, 8]]);
Rules.adjustBasicRules(fields);
new UndeadReturnRenderer(fields);