<!--
 * @Author: Chris
 * @Date: 2023-07-26 18:00:46
 * @LastEditors: Chris
 * @LastEditTime: 2023-07-27 17:38:57
 * @Descripttion: **
-->
## useKeyEvent
用法:

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from '@he1237596/khooks';

export default () => {

  const handleClick = useCallback(()=>{
    console.log(123)
  }, []);

  useKeyEvent({keyName: 'z', callback: handleClick, toolEventName: 'add'})

  return <div>

    <div>
      按键z键输出123
    </div>
  </div>
};
```

设置快捷键a修改useState定义的num数据（1）:
- 回调无依赖
```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from '@he1237596/khooks';

export default () => {
  const [num, setNum] = useState(0)

  const handleClick = useCallback(()=>{
    setNum(num => num + 1);
  }, []);

  useKeyEvent({keyName: 'a', callback: handleClick, toolEventName: 'add'})

  return <div>
按下键盘a键修改num
    <div>
      num: {num}
    </div>
  </div>
};
```

设置快捷键s修改useState定义的num数据（2）:
- 回调有依赖(依赖更新重新订阅)
```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from '@he1237596/khooks';

export default () => {
  const [num, setNum] = useState(0)
  const [num2, setNum2] = useState(0)

  const handleClick = useCallback(()=>{
    console.log(num)
    setNum(num - 1);
  }, [num]);

  useKeyEvent({keyName: 's', callback: handleClick, toolEventName: 'reduce'})

  return <div>
按下键盘s键修改num
    <div>
      num: {num}
    </div>
    <div>
      num2: {num2}
    </div>
  </div>
};
```

设置快捷键d修改useState定义的num数据（3）:
- 使用useRef确保回调函数引用地址不变
```jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useKeyEvent } from '@he1237596/khooks';

export default () => {
  const [num, setNum] = useState(0)
  const [num2, setNum2] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    setTimeout(() => {
      setNum(100)
    },500)
  }, [])
  const change = (a, e) => {
    console.log(a, e)
    setNum(a - 1)
  }
  // const change = useCallback(() => {
  //   setNum(num -1)
  // }, [num])
  useKeyEvent({keyName: 'd', callback: (e)=>change(num, e), toolEventName: 'reduce'})

  return <div>
按下键盘d键修改num
    <div>
      num: {num}
    </div>
  </div>
};
```

freezeAll/unfreezeAll：冻结/解冻所有键盘事件队列
```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from '@he1237596/khooks';

export default () => {
  const [num, setNum] = useState(0)

  const handleClick = useCallback(()=>{
    setNum(num => num + 1);
  }, []);

  const { emitter } = useKeyEvent({keyName: 'f', callback: handleClick, toolEventName: 'add'})

  return <div>
      按下键盘f键修改num
    <div>
      num: {num}
    </div>
    <button onClick={() => emitter.freezeAll()}>冻结</button>
    <button onClick={() => emitter.unfreezeAll()}>解冻</button>
  </div>
};

```