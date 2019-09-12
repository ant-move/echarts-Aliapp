const _Page = require("../../__antmove/component/componentClass.js")("Page");
const _my = require("../../__antmove/api/index.js")(my);
const app = getApp();

_Page({
    data: {
        value: null
    },

    onReady() {
        var ctx = _my.createCanvasContext("measure");

        var value = ctx.measureText("国国国国", "12px san-serif");
        this.setData({
            value: value.width
        });
    }
});
