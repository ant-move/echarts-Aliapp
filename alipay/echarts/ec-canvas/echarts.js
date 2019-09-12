import * as echarts from "./echarts-min.js";
import { getDpr } from "./utils";
let init = echarts.init;

echarts.init = function(p1, p2, opts = {}) {
    opts.devicePixelRatio = opts.devicePixelRatio || getDpr();
    return init.call(this, p1, p2, opts);
};

module.exports = echarts;
