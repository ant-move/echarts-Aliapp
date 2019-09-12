const _my = require("../__antmove/api/index.js")(my);
module.exports = {
    getDpr() {
        let ratio = 1;

        let info = _my.getSystemInfoSync();

        ratio = info.pixelRatio || 2;
        return ratio;
    }
};
