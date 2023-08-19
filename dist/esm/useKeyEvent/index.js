import React, { useEffect, useRef } from 'react';
import emitter from "../keyEventEmitter";
var useKeyboardEvent = function useKeyboardEvent(props) {
  var _props$type = props.type,
    type = _props$type === void 0 ? 'keyup' : _props$type,
    keyName = props.keyName,
    callback = props.callback,
    toolEventName = props.toolEventName,
    _props$delayTime = props.delayTime,
    delayTime = _props$delayTime === void 0 ? 300 : _props$delayTime,
    _props$delayType = props.delayType,
    delayType = _props$delayType === void 0 ? 2 : _props$delayType;
  var ref = useRef(callback);
  ref.current = callback;
  useEffect(function () {
    var timeoutId = null;
    emitter.unsubscribe(keyName, {
      toolEventName: toolEventName
    });
    var lastTime = 0;
    var handleKeyboardEvent = function handleKeyboardEvent(event) {
      // 聚焦输入框时，阻止快捷键
      if (event.target.localName === 'input' && (!event.target.type || ['number', 'text', 'password'].includes(event.target.type))) {
        return;
      }
      if (event.key === keyName || event.keyCode === keyName) {
        // keydown 防抖
        if (delayType === 1) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(function () {
            emitter.publish(keyName, {
              toolEventName: toolEventName
            }, event);
          }, delayTime);
        } else {
          var now = Date.now();
          if (now - lastTime >= delayTime) {
            emitter.publish(keyName, {
              toolEventName: toolEventName
            }, event);
            lastTime = now;
          }
        }
      }
    };
    document.removeEventListener(type, handleKeyboardEvent);
    emitter.subscribe(keyName, {
      toolEventName: toolEventName,
      // 无法拿到最新的state，这是一个正常结论
      // callback: ref.current,
      // 这是一行神器代码，可以拿到最新的state状态
      callback: function callback() {
        ref.current.apply(ref, arguments);
      }
    });
    document.addEventListener(type, handleKeyboardEvent);
    return function () {
      emitter.unsubscribe(keyName, {
        toolEventName: toolEventName
      });
      document.removeEventListener(type, handleKeyboardEvent);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [keyName, toolEventName, delayTime, delayType, type]);
  return {
    emitter: emitter
  };
};
export default useKeyboardEvent;