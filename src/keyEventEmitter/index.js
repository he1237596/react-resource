// class MapWithHistory extends Map {
//   history = []
//   set(key, val) {
//       this.history.push(key)
//       return super.set(key, val)
//   }
// }

const debug = process.env.NODE_ENV;
class EventEmitter {
  constructor() {
    this.events = new Map(); // 用于存储事件和对应的回调函数队列
    this.freeze = false;
  }

  // 订阅事件
  subscribe(keyName, callbackInfo) {
    if (!this.events.has(keyName)) {
      this.events.set(keyName, []);
    }

    const eventQueue = this.events.get(keyName);
    const index = eventQueue.findIndex(item => item.toolEventName === callbackInfo.toolEventName)
    debug && console.log(`按键${keyName}的事件队列为：`, eventQueue)
    if (index < 0) {
      debug && console.log(`按键${keyName}_${callbackInfo.toolEventName}事件不存在，订阅按键${keyName}_${callbackInfo.toolEventName}事件`)
      eventQueue.push(callbackInfo);
    } else {
      debug && console.warn(`按键${keyName}_${callbackInfo.toolEventName}事件已存在,覆盖并订阅按键${keyName}_${callbackInfo.toolEventName}事件`)
      eventQueue[index] = callbackInfo;
    }
  }

  // 发布事件
  // args目前来说是空的 todo：留待后面看是否需要扩展
  publish(keyName, callbackInfo, e, ...args) {
    debug && console.log(`发布按键${keyName}_${callbackInfo.toolEventName}事件`)
    // console.log(this.events.history.at(-1))
    if (this.freeze) {
      console.log(`已暂时冻结所有事件队列`)
      return;
    }
    if (this.events.has(keyName)) {
      const eventQueue = this.events.get(keyName);
      debug && console.log(`查询目标按键${keyName}的事件队列信息: `, eventQueue);
      // eventQueue.forEach(callback => callback(...args))
      if (eventQueue.length > 0) {
        const eventQueueItem = eventQueue[eventQueue.length - 1];
        if (eventQueueItem && eventQueueItem.toolEventName === callbackInfo.toolEventName) {
          eventQueueItem.callback(e, ...args)
          debug && console.log(`真实执行按键${keyName}_${eventQueueItem.toolEventName}事件`)
        }
      } else {
        debug && console.warn(`没有按键${keyName}的事件队列`)
      }
    }
  }

  publishAll(keyName, ...args) {
    if (!this.freeze && this.events.has(keyName)) {
      const eventQueue = this.events.get(keyName);
      eventQueue.forEach(callbackInfo => {
        if (callbackInfo.callback) {
          debug && console.log(`执行${keyName}按键事件`)
          callbackInfo.callback(...args);
        }
      });
    }
  }

  // 取消订阅事件
  unsubscribe(keyName, callbackInfo) {
    if (this.events.has(keyName)) {
      const eventQueue = this.events.get(keyName);
      if (eventQueue) {
        if (callbackInfo) {
          const index = eventQueue.findIndex(item => callbackInfo.toolEventName === item.toolEventName);
          if (index !== -1) {
            debug && console.log(`取消订阅${keyName}单个事件`)
            eventQueue.splice(index, 1);
          }
          return;
        }
        debug && console.log(`取消订阅${keyName}所有事件`)
        this.events.set(keyName, [])
      }
    }
  }

  // 暂时冻结所有事件
  freezeAll() {
    this.freeze = true;
  }

  unfreezeAll() {
    this.freeze = false;
  }
}
const emitter = new EventEmitter();
export default emitter;