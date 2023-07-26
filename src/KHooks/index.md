<!--
 * @Author: Chris
 * @Date: 2023-07-26 10:56:25
 * @LastEditors: Chris
 * @LastEditTime: 2023-07-26 11:05:27
 * @Descripttion: **
-->

## KHooks

Demo:

```jsx
import React, { useCallback, useState } from 'react';
import { KHooks } from 'chris-components';
const { useKeyEvent } = KHooks;

export default () => {
  const [num, setNum] = useState(0);
  const callback = useCallback(() => {
    setNum(num=>num + 1);
  }, [])
  useKeyEvent({keyName: 'c', callback, toolEventName: 'add'})
  return <div>
    <div>使用快捷键c改变num的值</div>
    <p>num：{num}</p>
  </div>
};
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
