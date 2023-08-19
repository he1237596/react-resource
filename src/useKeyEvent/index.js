import React, { useEffect, useRef } from 'react';
import emitter from '../keyEventEmitter';
import utils from '../utils'

const useKeyboardEvent = (props) => {
  const { type = 'keyup', keyName: hotKeyName, callback, toolEventName, delayTime = 0, delayType = 1 } = props;
  const ref = useRef(callback)
  ref.current = callback;
  useEffect(() => {
    const { keyName, combineKeys } = utils.getKeyInfo(hotKeyName)
    let timeoutId = null;
    emitter.unsubscribe(hotKeyName, {
      toolEventName
    });
    let lastTime = 0;
    const handleKeyboardEvent = (event) => {
      // 聚焦输入框时，阻止快捷键
      if (event.target.localName === 'input' && (!event.target.type || ['number', 'text', 'password'].includes(event.target.type))) {
        return;
      }
      if (utils.canPublish(event, combineKeys, keyName)) {
        event.preventDefault();
        // 防抖/节流
        if (delayTime) {
          if (delayType === 2) {
            if (timeoutId) {
              clearTimeout(timeoutId)
            }
            timeoutId = setTimeout(() => {
              emitter.publish(hotKeyName, { toolEventName }, event)
            }, delayTime);
          } else {
            const now = Date.now();
            if (now - lastTime >= delayTime) {
              emitter.publish(hotKeyName, { toolEventName }, event)
              lastTime = now;
            }
          }
        } else {
          console.log('ggggg')
          emitter.publish(hotKeyName, { toolEventName }, event)
        }
      }
    };
    document.removeEventListener(type, handleKeyboardEvent);
    emitter.subscribe(hotKeyName, {
      toolEventName,
      // 无法拿到最新的state，这是一个正常结论
      // callback: ref.current,
      // 这是一行神器代码，可以拿到最新的state状态
      callback: (...args) => {
        ref.current(...args)
      },
    });
    document.addEventListener(type, handleKeyboardEvent);
    return () => {
      emitter.unsubscribe(hotKeyName, {
        toolEventName
      });
      document.removeEventListener(type, handleKeyboardEvent);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hotKeyName, toolEventName, delayTime, delayType, type]);
  return { emitter };
};

export default useKeyboardEvent;
