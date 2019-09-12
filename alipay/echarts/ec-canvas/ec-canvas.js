const _Component = require("../__antmove/component/componentClass.js")(
    "Component"
);
const _my = require("../__antmove/api/index.js")(my);
import WxCanvas from "./wx-canvas";
import * as echarts from "./echarts";

const utils = require("./utils.js");

let ctx;

_Component({
    properties: {
        canvasId: {
            type: String,
            value: "ec-canvas"
        },
        ec: {
            type: Object
        }
    },
    data: {},
    ready: function() {
        if (!this.data.ec) {
            console.warn(
                '组件需绑定 ec 变量，例：<ec-canvas id="mychart-dom-bar" ' +
                    'canvas-id="mychart-bar" ec="{{ ec }}"></ec-canvas>'
            );
            return;
        }

        if (!this.data.ec.lazyLoad) {
            this.init();
        }
    },
    methods: {
        init: function(callback) {
            // console.log(wx)
            // const version = wx.version.version.split('.').map(n => parseInt(n, 10));
            // const isValid = version[0] > 1 || (version[0] === 1 && version[1] > 9)
            //   || (version[0] === 1 && version[1] === 9 && version[2] >= 91);
            // if (!isValid) {
            //   console.error('微信基础库版本过低，需大于等于 1.9.91。'
            //     + '参见：https://github.com/ecomfe/echarts-for-weixin'
            //     + '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82');
            //   return;
            // }
            ctx = _my.createCanvasContext(this.data.canvasId, this);
            const canvas = new WxCanvas(ctx, this.data.canvasId);
            echarts.setCanvasCreator(() => {
                return canvas;
            });

            var query = _my.createSelectorQuery().in(this);

            let selector = ".ec-canvas-" + this.data.canvasId;
            let ratio = utils.getDpr();
            query
                .select(selector)
                .boundingClientRect(res => {
                    let _w = ratio * res.width;

                    let _h = ratio * res.height;

                    let w = res.width;
                    let h = res.height;
                    this.setData({
                        width: _w,
                        height: _h
                    });

                    if (typeof callback === "function") {
                        this.chart = callback(canvas, w, h);
                    } else if (
                        this.data.ec &&
                        typeof this.data.ec.onInit === "function"
                    ) {
                        this.chart = this.data.ec.onInit(canvas, w, h);
                    } else {
                        this.triggerEvent("inited", {
                            canvas: canvas,
                            width: w,
                            height: h
                        });
                    }
                })
                .exec();
        },

        canvasToTempFilePath(opt) {
            if (!opt.canvasId) {
                opt.canvasId = this.data.canvasId;
            }

            ctx.draw(true, () => {
                _my.canvasToTempFilePath(opt, this);
            });
        },

        touchStart(e) {
            if (this.chart && e.touches.length > 0) {
                var touch = e.touches[0];
                var handler = this.chart.getZr().handler;
                handler.dispatch("mousedown", {
                    zrX: touch.x,
                    zrY: touch.y
                });
                handler.dispatch("mousemove", {
                    zrX: touch.x,
                    zrY: touch.y
                });
                handler.processGesture(wrapTouch(e), "start");
            }
        },

        touchMove(e) {
            if (this.chart && e.touches.length > 0) {
                var touch = e.touches[0];
                var handler = this.chart.getZr().handler;
                handler.dispatch("mousemove", {
                    zrX: touch.x,
                    zrY: touch.y
                });
                handler.processGesture(wrapTouch(e), "change");
            }
        },

        touchEnd(e) {
            if (this.chart) {
                const touch = e.changedTouches ? e.changedTouches[0] : {};
                var handler = this.chart.getZr().handler;
                handler.dispatch("mouseup", {
                    zrX: touch.x,
                    zrY: touch.y
                });
                handler.dispatch("click", {
                    zrX: touch.x,
                    zrY: touch.y
                });
                handler.processGesture(wrapTouch(e), "end");
            }
        }
    }
});

function wrapTouch(event) {
    for (let i = 0; i < event.touches.length; ++i) {
        const touch = event.touches[i];
        touch.offsetX = touch.x;
        touch.offsetY = touch.y;
    }

    return event;
}
