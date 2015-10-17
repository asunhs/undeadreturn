(function (window) {






    function init(fields) {
        var i, j, line, map = [];

        for (i=0; i<fields.width; ++i) {
            map.push(line = []);
            for (j=0; j<fields.height; ++j) {
                if (fields.getFeatures(i, j).some(function (feature) {
                        return feature.physical;
                    })) {
                    line.push(-1);
                } else {
                    line.push(0);
                }
            }
        }

        return map;
    }

    function getDistances(fields, x, y) {
        var map = init(fields);

        if (!fields.checkPosition(x, y)) {
            return map;
        }

        return trace(map, x, y);
    }



    function trace(map, x, y) {

        var queue = [[x, y]], pointer = 0, node, i, j, score;

        function visit(k, l) {
            if (map[k] && map[k][l] === 0) {
                map[k][l] = score;
                queue.push([k, l]);
            }
        }

        map[x][y] = 1;
        while(true) {

            node = queue[pointer++];
            i = node[0];
            j = node[1];
            score = map[i][j]+1;

            visit(i-1, j);
            visit(i+1, j);
            visit(i, j-1);
            visit(i, j+1);

            if (queue.length <= pointer) {
                return map;
            }
        }
    }




    function DistanceMap(fields, x, y) {
        this.fields = fields;
        this.init(x, y);
    }

    DistanceMap.prototype.init = function (x, y) {
        this.map = getDistances(this.fields, x, y);
    };

    DistanceMap.prototype.getDistance = function (x, y) {
        return (this.map[x] && this.map[x][y]) || -1;
    };

    DistanceMap.prototype.step = function (x, y) {
        return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]].map(function (around) {
            around.push(this.getDistance(around[0], around[1]));
            return around;
        }, this).filter(function (around) {
            return around[2] > 0;
        }).reduce(function (choose, around) {
            if (choose[2] > around[2]) {
                return around;
            } else {
                return choose;
            }
        });
    };



    window.DistanceMap = DistanceMap;

})(window);