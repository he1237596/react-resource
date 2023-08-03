<!--
 * @Author: Chris
 * @Date: 2023-07-31 11:35:57
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-02 15:35:17
 * @Descripttion: **
-->

## useCtrlPlusKeyEvent

用法:

设置快捷键 ctrl+n 修改 useState 定义的 num 数据:

```jsx
import React, { useState, useCallback } from 'react';
import { useCtrlPlusKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);

  const handleClick = useCallback(() => {
    setNum(num - 1);
  }, [num]);

  useCtrlPlusKeyEvent({ keyName: 'n', callback: handleClick, toolEventName: 'reduce_n' });

  return (
    <div>
      按下键盘n键修改num
      <div>num: {num}</div>
    </div>
  );
};
```
