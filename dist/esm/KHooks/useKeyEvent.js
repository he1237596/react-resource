/*
 * @Author: Chris
 * @Date: 2023-07-21 15:37:31
 * @LastEditors: Chris
 * @LastEditTime: 2023-07-24 16:49:21
 * @Descripttion: **
 */

import React, { useEffect } from 'react';
import emitter from "./keyEventEmitter";
var useKeyboardEvent = function useKeyboardEvent(props) {
  var _props$type = props.type,
    type = _props$type === void 0 ? 'keydown' : _props$type,
    keyName = props.keyName,
    callback = props.callback,
    toolEventName = props.toolEventName,
    _props$delayTime = props.delayTime,
    delayTime = _props$delayTime === void 0 ? 300 : _props$delayTime,
    _props$delayType = props.delayType,
    delayType = _props$delayType === void 0 ? 2 : _props$delayType;
  useEffect(function () {
    var timeoutId = null;
    emitter.unsubscribe(keyName, {
      toolEventName: toolEventName
    });
    var lastTime = 0;
    var handleKeyboardEvent = function handleKeyboardEvent(event) {
      console.log(event);
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
      callback: callback
    });
    document.addEventListener(type, handleKeyboardEvent);
    return function () {
      emitter.unsubscribe(keyName, {
        toolEventName: toolEventName
      });
      document.removeEventListener(type, handleKeyboardEvent);
      clearTimeout(timeoutId);
    };
  }, [keyName, callback, toolEventName, delayTime, delayType, type]);
};
export default useKeyboardEvent;