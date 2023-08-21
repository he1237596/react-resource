<!--
 * @Author: Chris
 * @Date: 2023-07-26 10:44:03
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-19 22:03:02
 * @Descripttion: **
-->

# react-khooks

## Getting Started

<!-- ## useKeyEvent -->

这是一个基于 React 的键盘事件的自定义 hooks，是基于公司的业务封装的，支持一个按键绑定多个事件（事件队列管理），只触发最新绑定的事件，队列顺序根据业务去维护，毕竟正常来说一个按键在某一时刻只会触发单一功能事件。（其实可以通过事件权重去托管给 emitter 本身去管理） 
| 参数 | 说明 | | ---- | ---- | | keyName | 键盘按键名 key 或 keyCode，建议统一，必传（组合键使用+连接，如：ctrl+按键名，请注意和浏览器以及系统按键的冲突问题）| | callback | 回调函数，默认参数 e 为 KeyboardEvent 事件对象，必传 | | toolEventName | 自定义事件名称，作为该键盘事件队列中的唯一标识，必传 | | type | 键盘弹起或按下（keyup/keydown），默认 keyup | | delayTime | 防抖/节流延迟时间，默认 0 为不使用节流/防抖 （如果使用 keydown，建议设置）| | delayType | 1 节流/2 防抖，默认 1 |

- 一般来说，你只需要传入三个属性：keyName（键盘按键名），callback（回调函数），toolEventName（自定义事件名）
- 你可以基于 callback 的默认参数 KeyboardEvent 根据该事件对象进行更多逻辑控制或完成更多复合按键
- useKeyEvent 默认返回事件队列实例，这是一个单例，意味着你在任何地方返回的都是同一个 emitter 实例或者直接导入，以手动控制事件队列

## 📦 Install

```bash
$ npm i react-khooks --save
```

## 🔨 Usage

```jsx
// 根据需要结构以下对应模块使用
import { useKeyEvent } from 'react-khooks'; //键盘hooks
import { emitter } from 'react-khooks'; //事件队列中心（单例）
```

## Demo

基本用法：

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const handleClick = () => {
    alert('按键z触发');
  };

  useKeyEvent({ keyName: 'z', callback: handleClick, toolEventName: 'alert' });

  return (
    <div>
      <div>按键z键弹出提示</div>
    </div>
  );
};
```

组合键（ctrl/alt/shift+按键）:

- 回调接收默认参数（KeyboardEvent 事件对象）

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const handleClick = (e) => {
    setNum(num + 1);
  };
  useKeyEvent({ keyName: `alt+v`, callback: handleClick, toolEventName: '增加num' });
  useKeyEvent({ keyName: `ctrl+v`, callback: handleClick, toolEventName: '增加num' });
  useKeyEvent({ keyName: `shift+v`, callback: handleClick, toolEventName: '增加num' });

  return (
    <div>
      <div>按键ctrl/alt/shift+v增加num</div>
      <span>num: {num}</span>
    </div>
  );
};
```

动态切换绑定热键：

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const [hotKey, setHotKey] = useState('m');
  const handleClick = () => {
    setNum(num + 1);
  };

  useKeyEvent({ keyName: hotKey, callback: handleClick, toolEventName: '修改num' });

  return (
    <div>
      <div>按键{hotKey}键修改num</div>
      <div>num: {num}</div>
      <div>
        <button onClick={() => setHotKey('n')}>切换为使用n键修改num</button>
      </div>
    </div>
  );
};
```

节流/防抖

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const handleClick = useCallback(() => {
    setNum(num + 1);
  }, [num]);
  useKeyEvent({
    keyName: 'q',
    callback: handleClick,
    toolEventName: '长按q键修改num',
    delayTime: 500,
    type: 'keydown',
    delayType: 1,
  });
  useKeyEvent({
    keyName: 'w',
    callback: handleClick,
    toolEventName: '长按q键修改num',
    delayTime: 500,
    type: 'keydown',
    delayType: 2,
  });

  return (
    <div>
      <div>节流：长按q键修改num(每500ms触发一次)</div>
      <div>num: {num}</div>
      <div>防抖：长按w键修改num(直到抬起触发一次)</div>
    </div>
  );
};
```

关于回调函数 callback 的处理强烈建议使用 useCallback，避免组件重新渲染时频繁订阅取消

- 使用 useCalback 内 setState 获取当前状态

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);

  const handleClick = useCallback(() => {
    setNum((num) => num + 1);
  }, []);

  useKeyEvent({ keyName: 'a', callback: handleClick, toolEventName: 'add' });

  return (
    <div>
      设置快捷键 a 修改 useState 定义的 num 数据
      <div>num: {num}</div>
    </div>
  );
};
```

- useCallback 依赖获取当前状态

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);

  const handleClick = useCallback(() => {
    setNum(num - 1);
  }, [num]);

  useKeyEvent({ keyName: 's', callback: handleClick, toolEventName: 'reduce' });

  return (
    <div>
      设置快捷键 s 修改 useState 定义的 num 数据
      <div>num: {num}</div>
    </div>
  );
};
```

- 不推荐（会导致组件重新渲染时频繁取消/订阅，性能差，虽然内部做了处理，避免这个问题，但是还是不推荐）

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const handleClick = (param) => {
    setNum(num + param);
  };

  useKeyEvent({ keyName: 'ctrl+x', callback: () => handleClick(1), toolEventName: 'add_2' });
  useKeyEvent({ keyName: 'shift+x', callback: () => handleClick(-1), toolEventName: 'reduce_2' });

  return (
    <div>
      <div>按键ctrl+x增加num</div>
      <div>按键shift+x减小num</div>
      <button onClick={() => handleClick(1)}> 加 1 </button>
      <span>num: {num}</span>
      <button onClick={() => handleClick(-1)}> 减 1 </button>
    </div>
  );
};
```

freezeAll/unfreezeAll：冻结/解冻所有键盘事件队列

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);

  const handleClick = () => {
    setNum((num) => num + 1);
  };

  const { emitter } = useKeyEvent({ keyName: 'f', callback: handleClick, toolEventName: 'add' });
  // 你也可以直接 import { emitter } from 'react-khooks'，因为这里的emitter始终是同一个实例

  return (
    <div>
      <p>按下键盘f键修改num</p>
      <span style={{ border: '1px solid #ccc' }} onClick={() => emitter.freezeAll()}>
        冻 结
      </span>
      <div>num: {num}</div>
      <span style={{ border: '1px solid #ccc' }} onClick={() => emitter.unfreezeAll()}>
        解 冻
      </span>
    </div>
  );
};
```
