<!--
 * @Author: Chris
 * @Date: 2023-07-26 10:44:03
 * @LastEditors: Chris
 * @LastEditTime: 2023-07-31 15:57:40
 * @Descripttion: **
-->
# react-keyshooks

## Getting Started

这是一个基于React的键盘事件的自定义hooks，是基于公司的业务封装的，支持一个按键绑定多个事件（事件队列管理），只触发最新绑定的事件
|  参数   | 说明  |
|  ----  | ----  |
| keyName  | 键盘按键名key或keyCode，建议统一，必传 |
| callback  | 回调函数，默认参数e为KeyboardEvent事件对象，必传 |
| toolEventName  | 自定义事件名称，作为该键盘事件队列中的唯一标识，必传 |
| type  | 键盘弹起或按下（keyup/keydown），默认keyup |
| delayTime  | 防抖/节流延迟时间，默认300ms |
| delayType  | 2：防抖（默认）/1：节流，默认2 |

- 一般来说，你只需要传入三个参数：keyName（键盘按键名），callback（回调函数），toolEventName（自定义事件名）
- 你可以基于callback的默认参数KeyboardEvent根据该事件对象进行更多逻辑控制或完成更多复合按键
- useKeyEvent默认返回事件队列实例，这是一个单例，意味着你在任何地方返回的都是同一个emitter实例或者直接导入，以手动控制事件队列
- 内置了基于useKeyEvent实现的ctrl+其他键的复合键自定义hooks（useCtrlPlusKeyEvent），你可以直接解构使用


## 📦 Install

```bash
$ npm i react-keyshooks --save
```
## 🔨 Usage
```jsx
// 根据需要结构以下对应模块使用
import { useKeyEvent } from 'react-keyshooks'; //键盘hooks
import { useCtrlPlusKeyEvent } from 'react-keyshooks'; //ctrl+key复合键hooks
import { emitter } from 'react-keyshooks'; //事件队列中心（单例）
```
## Demo

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-keyshooks';

export default () => {
  const handleClick = () => {
    console.log(123);
  };

  useKeyEvent({ keyName: 'z', callback: handleClick, toolEventName: 'log123' });

  return (
    <div>
      <div>按键z键输出123</div>
    </div>
  );
};
```
回调传参:

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-keyshooks';

export default () => {
  const [num, setNum] = useState(0)
  const handleClick = (param) => {
    setNum(num + param)
  };

  useKeyEvent({ keyName: 'x', callback: () => handleClick(1), toolEventName: 'add_2' });

  return (
    <div>
      <div>按键z增加num</div>
      <button onClick={() => handleClick(1)}>加</button>
      <span>num: {num}</span>
      <button onClick={() => handleClick(-1)}>减</button>
    </div>
  );
};
```

组合键（ctrl+b）:
- 回调接收默认参数（KeyboardEvent事件对象）
```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-keyshooks';

export default () => {
  const [num, setNum] = useState(0)
  const handleClick = (e) => {
    // console.log(e) // KeyboardEvent
    if(e.ctrlKey) {
      setNum(num + 1)
    }
  };

  useKeyEvent({ keyName: 'b', callback: handleClick, toolEventName: 'add_3' });

  return (
    <div>
      <div>按键z增加num</div>
      <span>num: {num}</span>
    </div>
  );
};
```

设置快捷键 a 修改 useState 定义的 num 数据（1）:

- useCalback回调无依赖

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-keyshooks';

export default () => {
  const [num, setNum] = useState(0);

  const handleClick = useCallback(() => {
    setNum((num) => num + 1);
  }, []);

  useKeyEvent({ keyName: 'a', callback: handleClick, toolEventName: 'add' });

  return (
    <div>
      按下键盘a键修改num
      <div>num: {num}</div>
    </div>
  );
};
```

设置快捷键 s 修改 useState 定义的 num 数据（2）:

- useCallback回调有依赖

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-keyshooks';

export default () => {
  const [num, setNum] = useState(0);

  const handleClick = useCallback(() => {
    setNum(num - 1);
  }, [num]);

  useKeyEvent({ keyName: 's', callback: handleClick, toolEventName: 'reduce' });

  return (
    <div>
      按下键盘s键修改num
      <div>num: {num}</div>
    </div>
  );
};
```

freezeAll/unfreezeAll：
冻结/解冻所有键盘事件队列
```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-keyshooks';

export default () => {
  const [num, setNum] = useState(0);

  const handleClick = () => {
    setNum((num) => num + 1);
  };

  const { emitter } = useKeyEvent({ keyName: 'f', callback: handleClick, toolEventName: 'add' });

  return (
    <div>
      <p>按下键盘f键修改num</p>
      <span style={{border: '1px solid #ccc'}} onClick={() => emitter.freezeAll()}>冻结</span>
      <div>num: {num}</div>
      <span style={{border: '1px solid #ccc'}} onClick={() => emitter.unfreezeAll()}>解冻</span>
    </div>
  );
};
```
