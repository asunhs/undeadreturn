(function (window) {



    function clone(obj) {
        var cloning = {},
            key;

        for (key in obj) {
            cloning[key] = obj[key];
        }

        return cloning;
    }



    function invokeEmitter(target) {
        var handlers = {};

        target.on = function (eventName, handler) {
            handlers[eventName] = handlers[eventName] || [];
            handlers[eventName].push(handler);

            return function () {
                return target.off(eventName, handler);
            };
        };

        target.off = function (eventName, handler) {
            if (!eventName) {
                handlers = {};
                return;
            }

            if (!handlers[eventName]) {
                return;
            }

            if (!handler) {
                delete handlers[eventName];
                return;
            }

            var index = handlers[eventName].indexOf(handler);

            if (index < 0) {
                return;
            }

            return handlers[eventName].splice(index, 1);
        };

        target.emit = function (eventName, data) {
            if (!handlers[eventName]) {
                return true;
            }

            return handlers[eventName].map(function (handler) {
                return handler(eventName, clone(data));
            }).every(function (result) {
                return result !== false;
            });
        };
    }


    window.SimpleEmitter = {
        invoke: invokeEmitter
    };

})(window);