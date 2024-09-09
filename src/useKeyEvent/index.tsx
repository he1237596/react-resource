import React, { useEffect, useRef } from 'react';
import emitter, { CallbackInfo } from '../keyEventEmitter';
import utils from '../utils'; // 假设 utils 是已经定义好的辅助方法

export interface UseKeyboardEventProps {
  type?: 'keyup' | 'keydown';
  keyName: string;
  callback: (e: KeyboardEvent) => void;
  toolEventName: string;
  delayTime?: number;
  delayType?: 1 | 2;
}

const useKeyboardEvent = (props: UseKeyboardEventProps) => {
  const {
    type = 'keyup',
    keyName: hotKeyName,
    callback,
    toolEventName,
    delayTime = 0,
    delayType = 1,
  } = props;
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => {
    const { keyName, combineKeys } = utils.getKeyInfo(hotKeyName); // 假设 getKeyInfo 返回 keyName 和组合键
    let timeoutId: NodeJS.Timeout | null = null;
    let lastTime = 0;

    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement &&
        (!event.target.type || ['number', 'text', 'password'].includes(event.target.type))
      ) {
        return;
      }

      if (utils.canPublish(event, combineKeys, keyName)) {
        event.preventDefault();

        if (delayTime) {
          if (delayType === 2) {
            // 防抖
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
              emitter.publish(hotKeyName, { toolEventName, callback: ref.current }, event);
            }, delayTime);
          } else {
            // 节流
            const now = Date.now();
            if (now - lastTime >= delayTime) {
              emitter.publish(hotKeyName, { toolEventName, callback: ref.current }, event);
              lastTime = now;
            }
          }
        } else {
          emitter.publish(hotKeyName, { toolEventName, callback: ref.current }, event);
        }
      }
    };

    document.removeEventListener(type, handleKeyboardEvent);
    emitter.subscribe(hotKeyName, {
      toolEventName,
      // 无法拿到最新的state，这是一个正常结论
      // callback: ref.current,

      // 传递ref实例，在队列读取即时的ref.current执行，可以拿到最新的状态
      // callback: ref,

      // 这是一行神器代码，可以拿到最新的state状态,
      // 我理解的是每次执行回调的时读取最新的ref.current上下文
      callback: (e) => ref.current(e),
    });
    document.addEventListener(type, handleKeyboardEvent);
    return () => {
      emitter.unsubscribe(hotKeyName, { toolEventName });
      document.removeEventListener(type, handleKeyboardEvent);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hotKeyName, toolEventName, delayTime, delayType, type]);

  return { emitter };
};

export default useKeyboardEvent;
