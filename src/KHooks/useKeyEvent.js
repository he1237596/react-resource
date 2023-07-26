/*
 * @Author: Chris
 * @Date: 2023-07-21 15:37:31
 * @LastEditors: Chris
 * @LastEditTime: 2023-07-24 16:49:21
 * @Descripttion: **
 */

import React, { useEffect } from 'react';
import emitter from './keyEventEmitter'

const useKeyboardEvent = (props) => {
  const {  type = 'keydown', keyName, callback, toolEventName, delayTime = 300, delayType = 2 } = props;
  useEffect(() => {
    let timeoutId = null;
    emitter.unsubscribe(keyName, {
      toolEventName
    });
    let lastTime = 0;
    const handleKeyboardEvent = (event) => {
      console.log(event)
      if (event.key === keyName || event.keyCode === keyName) {
        // keydown 防抖
        if (delayType === 1) {
          if(timeoutId) {
            clearTimeout(timeoutId)
          }
          timeoutId = setTimeout(() => {
            emitter.publish(keyName, { toolEventName }, event)
          }, delayTime);
        } else {
          const now = Date.now();
          if (now - lastTime >= delayTime) {
            emitter.publish(keyName, { toolEventName }, event)
            lastTime = now;
          }
        }
      }
    };
    document.removeEventListener(type, handleKeyboardEvent);
    emitter.subscribe(keyName, {
      toolEventName,
      callback,
    });
    document.addEventListener(type, handleKeyboardEvent);
    return () => {
      emitter.unsubscribe(keyName, {
        toolEventName
      });
      document.removeEventListener(type, handleKeyboardEvent);
      clearTimeout(timeoutId);
    };
  }, [keyName, callback, toolEventName, delayTime, delayType, type]);
};

export default useKeyboardEvent;
