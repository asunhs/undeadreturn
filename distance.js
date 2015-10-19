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



    function minMap(lhs, rhs) {
        var i, j, line, min = [];

        for (i=0; i<lhs.length; ++i) {
            min.push(line = []);
            for (j=0; j<rhs.length; ++j) {
                line.push(Math.min(lhs[i][j], rhs[i][j]));
            }
        }

        return min;
    }


    function DistanceMap(fields, points) {
        this.fields = fields;
        this.init(points);
    }

    DistanceMap.prototype.init = function (points) {

        this.map = points.map(function (point) {
            return getDistances(this.fields, point[0], point[1]);
        }, this).reduce(minMap);

        points.map(function (point) {
            this.map[point[0]][point[1]] = 1;
        }, this);
    };

    DistanceMap.prototype.getDistance = function (x, y) {
        return (this.map[x] && this.map[x][y]) || -1;
    };

    DistanceMap.prototype.step = function (x, y) {
        try {
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
        } catch (e) {
            return [x, y];
        }
    };



    window.DistanceMap = DistanceMap;

})(window);