function Map() {}

Map.prototype.init = function () {
    var i, j, x = this.x, y = this.y, pixels = [];

    for (i=0; i<x; i++) {
        pixels[i] = [];
        for (j=0; j<y; j++) {
            pixels[i][j] = 0;
        }
    }

    this.pixels = pixels;
};

Map.prototype.setPixel = function (x, y, point) {
    if (x >= this.x || x < 0) {
        return;
    }

    if (y >= this.y || y < 0) {
        return;
    }

    this.pixels[x][y] = point;
};

Map.prototype.setBlank = function (x, y) {
    this.setPixel(x, y, 0);
};

Map.prototype.isBlank = function (x, y) {
    return this.pixels[x][y] === 0;
};

function ObjectMap (x, y) {
    this.x = x;
    this.y = y;
    this.init();
}

ObjectMap.prototype = new Map();


ObjectMap.prototype.setObject = function (x, y, type) {
    this.canMoveIn(x, y);
    this.setPixel(x, y, type);
};

ObjectMap.prototype.canMoveIn = function (x, y) {
    if (!this.isBlank(x, y)) {
        throw 'can not allowed move in';
    }
};

ObjectMap.prototype.setCharacter = function (x, y, type) {
    if (type < 1 || type > 63) {
        return;
    }
    this.setObject(x, y, type);
};

ObjectMap.prototype.setMonster = function (x, y, type) {
    if (type < 64 || type > 127) {
        return;
    }
    this.setObject(x, y, type);
};

ObjectMap.prototype.setFeature = function (x, y, type) {
    if (type < 128 || type > 255) {
        return;
    }
    this.setObject(x, y, type);
};

ObjectMap.prototype.isCharacter = function (x, y) {
    return this.pixels[x][y] > 0 && this.pixels[x][y] < 64;
};

ObjectMap.prototype.isMonster = function (x, y) {
    return this.pixels[x][y] > 63 && this.pixels[x][y] < 128;
};

ObjectMap.prototype.isFeature = function (x, y) {
    return this.pixels[x][y] > 127 && this.pixels[x][y] < 256;
};


function DistanceMap(map) {
    this.objectMap = map;
    this.x = map.x;
    this.y = map.y;
    this.init();
}

DistanceMap.prototype = new Map();

DistanceMap.prototype.setBlock = function (x, y) {
    this.setPixel(x, y, -1);
};

DistanceMap.prototype.isVisited = function (x, y) {
    if (x >= this.x || x < 0) {
        return true;
    }

    if (y >= this.y || y < 0) {
        return true;
    }

    if (!this.objectMap.isBlank(x, y)) {
        this.setBlock(x, y);
    }
    return this.pixels[x][y] !== 0;
};

DistanceMap.prototype.isBlock = function (x, y) {
    return this.pixels[x][y] === -1;
};

DistanceMap.prototype.calculate = function (x, y) {

    if (x >= this.x || x < 0) {
        return;
    }

    if (y >= this.y || y < 0) {
        return;
    }

    var map = this, queue = [[x, y]], pointer = 0, node, i, j, score;

    function visit(k, l) {
        if (!map.isVisited(k, l)) {
            map.setPixel(k, l, score);
            queue.push([k, l]);
        }
    }

    map.init();
    map.setPixel(x, y, 1);
    while(true) {
        node = queue[pointer++];
        i = node[0];
        j = node[1];
        score = map.pixels[i][j]+1;

        visit(i-1, j);
        visit(i+1, j);
        visit(i, j-1);
        visit(i, j+1);

        if (queue.length <= pointer) {
            break;
        }
    }

    return score-1;
};