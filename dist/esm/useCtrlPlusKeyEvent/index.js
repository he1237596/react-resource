/*
 * @Author: Chris
 * @Date: 2023-07-26 17:59:50
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-17 18:23:15
 * @Descripttion: **
 */
import React from 'react';
import useKeyEvent from "../useKeyEvent";
var useCtrlCKeyListener = function useCtrlCKeyListener(props) {
  var _props$type = props.type,
    type = _props$type === void 0 ? 'keyup' : _props$type,
    keyName = props.keyName,
    callback = props.callback,
    toolEventName = props.toolEventName,
    _props$delayTime = props.delayTime,
    delayTime = _props$delayTime === void 0 ? 300 : _props$delayTime,
    _props$delayType = props.delayType,
    delayType = _props$delayType === void 0 ? 2 : _props$delayType;
  var cb = function cb(e) {
    if (e.ctrlKey) {
      callback(e);
    }
  };
  return useKeyEvent({
    type: type,
    keyName: keyName,
    callback: cb,
    toolEventName: toolEventName,
    delayTime: delayTime,
    delayType: delayType
  });
};
export default useCtrlCKeyListener;