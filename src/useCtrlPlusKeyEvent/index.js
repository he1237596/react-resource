/*
 * @Author: Chris
 * @Date: 2023-07-26 17:59:50
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-19 19:31:44
 * @Descripttion: **
 */
import React from 'react';
import useKeyEvent from '../useKeyEvent';

const useCtrlCKeyListener = (props) => {
  const { type = 'keyup', keyName, callback, toolEventName, delayTime = 300, delayType = 2 } = props;
  return useKeyEvent({ type, keyName: `ctrl+${keyName}`, callback, toolEventName, delayTime, delayType })
};

export default useCtrlCKeyListener;
