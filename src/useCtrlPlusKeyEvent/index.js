/*
 * @Author: Chris
 * @Date: 2023-07-26 17:59:50
 * @LastEditors: Chris
 * @LastEditTime: 2023-07-31 15:25:31
 * @Descripttion: **
 */
import React from 'react';
import useKeyEvent from '../useKeyEvent';

const useCtrlCKeyListener = (props) => {
  const { type = 'keyup', keyName, callback, toolEventName, delayTime = 300, delayType = 2 } = props;
  const cb = (e) => {
    if (e.ctrlKey) {
      callback(e)
    }
  }
  const emitter = useKeyEvent({ type, keyName, callback: cb, toolEventName, delayTime, delayType } )
  return { emitter }
};

export default useCtrlCKeyListener;
