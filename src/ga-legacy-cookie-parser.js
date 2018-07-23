(function (window, undefined) {
    'use strict';

    var GAParser = function () {
        return this;
    };

    if (typeof(exports) !== UNDEF_TYPE) {
        if (typeof module !== UNDEF_TYPE && module.exports) {
            exports = module.exports = GAParser;
        }
        exports.GAParser = GAParser;
    } else {
        if (typeof(define) === FUNC_TYPE && define.amd) {
            define(function () {
                return GAParser;
            });
        } else if (window) {
            window.GAParser = GAParser;
        }
    }

})(typeof window === 'object' ? window : this);