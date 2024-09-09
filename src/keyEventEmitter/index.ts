// 在文件顶部添加
declare global {
  interface Window {
    _emitter?: typeof emitter;
  }
}
const debug = process.env.NODE_ENV === 'development';
type callback = (e: KeyboardEvent, ...args: any[]) => void;

export interface CallbackInfo {
  toolEventName: string;
  callback?: callback;
}

class EventEmitter {
  events: Map<string, CallbackInfo[]>;
  freeze: boolean;

  constructor() {
    this.events = new Map();
    this.freeze = false;
  }

  // 订阅事件
  subscribe(keyName: string, callbackInfo: CallbackInfo): void {
    if (!this.events.has(keyName)) {
      this.events.set(keyName, []);
    }
    console.log(this.events.has(keyName));
    const eventQueue = this.events.get(keyName)!;
    const index = eventQueue.findIndex((item) => item.toolEventName === callbackInfo.toolEventName);

    debug && console.log(`按键${keyName}的事件队列为：`, eventQueue);
    if (index < 0) {
      debug &&
        console.log(
          `按键${keyName}_${callbackInfo.toolEventName}事件不存在，订阅按键${keyName}_${callbackInfo.toolEventName}事件`,
        );
      eventQueue.push(callbackInfo);
    } else {
      debug &&
        console.warn(
          `按键${keyName}_${callbackInfo.toolEventName}事件已存在, 覆盖并订阅按键${keyName}_${callbackInfo.toolEventName}事件`,
        );
      eventQueue[index] = callbackInfo;
    }
  }

  // 发布事件
  publish(keyName: string, callbackInfo: CallbackInfo, e: KeyboardEvent, ...args: any[]): void {
    debug && console.log(`发布按键${keyName}_${callbackInfo.toolEventName}事件`);

    if (this.freeze) {
      console.log(`已暂时冻结所有事件队列`);
      return;
    }

    if (this.events.has(keyName)) {
      const eventQueue = this.events.get(keyName)!;
      debug && console.log(`查询目标按键${keyName}的事件队列信息: `, eventQueue);
      if (eventQueue.length > 0) {
        const eventQueueItem = eventQueue[eventQueue.length - 1];
        if (
          eventQueueItem &&
          eventQueueItem.callback &&
          eventQueueItem.toolEventName === callbackInfo.toolEventName
        ) {
          eventQueueItem.callback(e, ...args);
          debug && console.log(`真实执行按键${keyName}_${eventQueueItem.toolEventName}事件`);
        }
      } else {
        debug && console.warn(`没有按键${keyName}的事件队列`);
      }
    }
  }

  // 发布所有订阅的事件
  publishAll(keyName: string, e: KeyboardEvent): void {
    if (!this.freeze && this.events.has(keyName)) {
      const eventQueue = this.events.get(keyName)!;
      eventQueue.forEach((callbackInfo) => {
        if (callbackInfo.callback) {
          debug && console.log(`执行${keyName}按键事件`);
          callbackInfo.callback(e);
          // callbackInfo.callback.apply(this, args);
        }
      });
    }
  }

  // 取消订阅事件
  unsubscribe(keyName: string, callbackInfo?: CallbackInfo): void {
    if (this.events.has(keyName)) {
      const eventQueue = this.events.get(keyName)!;
      if (callbackInfo) {
        const index = eventQueue.findIndex(
          (item) => callbackInfo.toolEventName === item.toolEventName,
        );
        if (index !== -1) {
          debug && console.log(`取消订阅${keyName}单个事件`);
          eventQueue.splice(index, 1);
        }
        return;
      }
      debug && console.log(`取消订阅${keyName}所有事件`);
      this.events.set(keyName, []);
    }
  }

  // 冻结所有事件
  freezeAll(): void {
    this.freeze = true;
  }

  // 解除冻结
  unfreezeAll(): void {
    this.freeze = false;
  }
}

const emitter = new EventEmitter();
debug ? (window._emitter = emitter) : null;
export default emitter;
