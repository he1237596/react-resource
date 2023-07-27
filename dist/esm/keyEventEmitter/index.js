function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*
 * @Author: Chris
 * @Date: 2023-07-26 18:00:10
 * @LastEditors: Chris
 * @LastEditTime: 2023-07-27 10:51:53
 * @Descripttion: **
 */
// class MapWithHistory extends Map {
//   history = []
//   set(key, val) {
//       this.history.push(key)
//       return super.set(key, val)
//   }
// }

var debug = true;
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
    this.events = new Map(); // 用于存储事件和对应的回调函数队列
    this.freeze = false;
  }

  // 订阅事件
  _createClass(EventEmitter, [{
    key: "subscribe",
    value: function subscribe(keyName, callbackInfo) {
      if (!this.events.has(keyName)) {
        this.events.set(keyName, []);
      }
      var eventQueue = this.events.get(keyName);
      var index = eventQueue.findIndex(function (item) {
        return item.toolEventName === callbackInfo.toolEventName;
      });
      debug && console.log("\u6309\u952E".concat(keyName, "\u7684\u4E8B\u4EF6\u961F\u5217\u4E3A\uFF1A"), eventQueue);
      if (index < 0) {
        debug && console.log("\u6309\u952E".concat(keyName, "_").concat(callbackInfo.toolEventName, "\u4E8B\u4EF6\u4E0D\u5B58\u5728\uFF0C\u8BA2\u9605\u6309\u952E").concat(keyName, "_").concat(callbackInfo.toolEventName, "\u4E8B\u4EF6"));
        eventQueue.push(callbackInfo);
      } else {
        debug && console.warn("\u6309\u952E".concat(keyName, "_").concat(callbackInfo.toolEventName, "\u4E8B\u4EF6\u5DF2\u5B58\u5728,\u8986\u76D6\u5E76\u8BA2\u9605\u6309\u952E").concat(keyName, "_").concat(callbackInfo.toolEventName, "\u4E8B\u4EF6"));
        eventQueue[index] = callbackInfo;
      }
    }

    // 发布事件
  }, {
    key: "publish",
    value: function publish(keyName, callbackInfo) {
      debug && console.log("\u53D1\u5E03\u6309\u952E".concat(keyName, "_").concat(callbackInfo.toolEventName, "\u4E8B\u4EF6"));
      // console.log(this.events.history.at(-1))
      if (this.freeze) {
        console.log("\u5DF2\u6682\u65F6\u51BB\u7ED3\u6240\u6709\u4E8B\u4EF6\u961F\u5217");
        return;
      }
      if (this.events.has(keyName)) {
        var eventQueue = this.events.get(keyName);
        debug && console.log("\u67E5\u8BE2\u76EE\u6807\u6309\u952E".concat(keyName, "\u7684\u4E8B\u4EF6\u961F\u5217\u4FE1\u606F: "), eventQueue);
        // eventQueue.forEach(callback => callback(...args))
        if (eventQueue.length > 0) {
          var eventQueueItem = eventQueue[eventQueue.length - 1];
          if (eventQueueItem && eventQueueItem.toolEventName === callbackInfo.toolEventName) {
            for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              args[_key - 2] = arguments[_key];
            }
            eventQueueItem.callback.apply(eventQueueItem, args);
            debug && console.log("\u771F\u5B9E\u6267\u884C\u6309\u952E".concat(keyName, "_").concat(eventQueueItem.toolEventName, "\u4E8B\u4EF6"));
          }
        } else {
          debug && console.warn("\u6CA1\u6709\u6309\u952E".concat(keyName, "\u7684\u4E8B\u4EF6\u961F\u5217"));
        }
      }
    }
  }, {
    key: "publishAll",
    value: function publishAll(keyName) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      if (!this.freeze && this.events.has(keyName)) {
        var eventQueue = this.events.get(keyName);
        eventQueue.forEach(function (callbackInfo) {
          if (callbackInfo.callback) {
            debug && console.log("\u6267\u884C".concat(keyName, "\u6309\u952E\u4E8B\u4EF6"));
            callbackInfo.callback.apply(callbackInfo, args);
          }
        });
      }
    }

    // 取消订阅事件
  }, {
    key: "unsubscribe",
    value: function unsubscribe(keyName, callbackInfo) {
      if (this.events.has(keyName)) {
        var eventQueue = this.events.get(keyName);
        if (eventQueue) {
          if (callbackInfo) {
            var index = eventQueue.findIndex(function (item) {
              return callbackInfo.toolEventName === item.toolEventName;
            });
            if (index !== -1) {
              debug && console.log("\u53D6\u6D88\u8BA2\u9605".concat(keyName, "\u5355\u4E2A\u4E8B\u4EF6"));
              eventQueue.splice(index, 1);
            }
            return;
          }
          debug && console.log("\u53D6\u6D88\u8BA2\u9605".concat(keyName, "\u6240\u6709\u4E8B\u4EF6"));
          this.events.set(keyName, []);
        }
      }
    }

    // 暂时冻结所有事件
  }, {
    key: "freezeAll",
    value: function freezeAll() {
      this.freeze = true;
    }
  }, {
    key: "unfreezeAll",
    value: function unfreezeAll() {
      this.freeze = false;
    }
  }]);
  return EventEmitter;
}();
var emitter = new EventEmitter();
export default emitter;