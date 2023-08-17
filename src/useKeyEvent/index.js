import React, { useEffect, useRef } from 'react';
import emitter from '../keyEventEmitter';

const useKeyboardEvent = (props) => {
  const { type = 'keyup', keyName, callback, toolEventName, delayTime = 300, delayType = 2 } = props;
  const ref = useRef(callback)
  ref.current = callback;
  useEffect(() => {
    let timeoutId = null;
    emitter.unsubscribe(keyName, {
      toolEventName
    });
    let lastTime = 0;
    const handleKeyboardEvent = (event) => {
      // 聚焦输入框时，阻止快捷键
      if (event.target.localName === 'input' && (!event.target.type || ['number', 'text', 'password'].includes(event.target.type))) {
        return;
      }
      if (event.key === keyName || event.keyCode === keyName) {
        // keydown 防抖
        if (delayType === 1) {
          if (timeoutId) {
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
      // 无法拿到最新的state，这是一个正常结论
      // callback: ref.current,
      // 这是一行神器代码，可以拿到最新的state状态
      callback: (...args) => {
        ref.current(...args)
      },
    });
    document.addEventListener(type, handleKeyboardEvent);
    return () => {
      emitter.unsubscribe(keyName, {
        toolEventName
      });
      document.removeEventListener(type, handleKeyboardEvent);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [keyName, toolEventName, delayTime, delayType, type]);
  return { emitter };
};

export default useKeyboardEvent;
