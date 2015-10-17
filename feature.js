(function (window) {



    function contain(arr, element) {
        return arr.indexOf(element) >= 0;
    }

    function remove(arr, element) {

        var index = arr.indexOf(element);

        if (index < 0) {
            return;
        }

        return arr.splice(index,1);
    }








    function Tile(x, y) {
        this.init(x, y);
        SimpleEmitter.invoke(this);
    }

    Tile.addRules = [];

    Tile.addRules.push(function (tile, newFeature) {
        return !contain(tile.features, newFeature);
    });

    Tile.addRules.push(function (tile, newFeature) {
        if (!newFeature.physical) {
            return true;
        }
        return !tile.features.find(function (feature) {
            return feature.physical;
        });
    });

    Tile.prototype.init = function (x, y) {
        this.x = x;
        this.y = y;
        this.features = [];
    };

    Tile.prototype.add = function(newFeature) {

        var tile = this;

        if (Tile.addRules.find(function (rule) {
            return !rule(tile, newFeature);
        })) {
            return false;
        }

        if (!this.emit('beforeAddFeature', {
            feature: newFeature
        })) {
            return false;
        }

        newFeature.tile = this;
        this.features.push(newFeature);

        this.emit('addedFeature', {
            feature: newFeature
        });

        return true;
    };

    Tile.prototype.remove = function (feature) {
        if (contain(this.features, feature)) {

            if (!this.emit('beforeRemoveFeature', {
                    feature: feature
                })) {
                return;
            }

            delete feature.tile;
            remove(this.features, feature);

            this.emit('removedFeature', {
                feature: feature
            });
        }
    };

    Tile.prototype.move = function (feature, tile) {
        if (contain(this.features, feature)) {
            this.remove(feature);
            tile.add(feature);
        }
    };








    function Feature(type) {
        this.init(type);
        SimpleEmitter.invoke(this);
    }

    Feature.CHARACTOR_TYPE = 0;
    Feature.MONSTER_TYPE = 1;
    Feature.OBJECT_TYPE = 2;

    Feature.prototype.init = function (type) {
        switch (type) {
            case Feature.CHARACTOR_TYPE:
            case Feature.MONSTER_TYPE:
            case Feature.OBJECT_TYPE:
                return this.type = type;
            default:
                return this.type = Feature.OBJECT_TYPE;
        }
    };







    function Fields(width, height) {
        this.init(width, height);
    }

    Fields.prototype.init = function (width, height) {
        this.map = [];
        this.width = width;
        this.height = height;

        var i, j, line;

        for (i=0; i<width; ++i) {
            this.map.push(line = []);
            for (j=0; j<height; ++j) {
                line.push(new Tile(i, j));
            }
        }
    };

    Fields.prototype.checkPosition = function (x, y) {
        return this.map[x] && this.map[x][y];
    };

    Fields.prototype.find = function (iterator) {
        var i, j;

        for (i=0; i<this.width; ++i) {
            for (j=0; j<this.height; ++j) {
                if (iterator(this.map[i][j], i, j, this.map)) {
                    return this.map[i][j];
                }
            }
        }
        return;
    };

    Fields.prototype.filter = function (iterator) {
        var filtered = [];

        this.iterate(function (tile, i, j, map) {
            if (iterator(tile, i, j, map)) {
                filtered.push(tile);
            }
        });

        return filtered;
    };

    Fields.prototype.iterate = function (iterator) {
        var i, j, line, results = [];

        for (i=0; i<this.width; ++i) {
            results.push(line = []);
            for (j=0; j<this.height; ++j) {
                line.push(iterator(this.map[i][j], i, j, this.map));
            }
        }
        return results;
    };

    Fields.prototype.setFeature = function (feature, x, y) {
        if (!this.checkPosition(x, y)) {
            return false;
        }

        return this.map[x][y].add(feature);
    };

    Fields.prototype.getFeatures = function (x, y) {
        if (!this.checkPosition(x, y)) {
            return [];
        }

        return this.map[x][y].features;
    };

    Fields.prototype.findFeatures = function (type) {
        return this.filter(function (tile) {
            return tile.features.some(function (feature) {
                return feature.type == type
            });
        });
    };






    window.Tile = Tile;
    window.Feature = Feature;
    window.Fields = Fields;

})(window);