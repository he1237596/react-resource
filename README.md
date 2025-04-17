# react-khooks

Welcome to the project documentation. You can click the link below to switch to the Chinese version.

> 📖 [中文](./README.zh-CN.md) | English

## Getting Started

## 📦 Install

```bash
npm i react-khooks --save
```

## 🔨 Usage

```jsx
// Import what you need
import { useKeyEvent } from 'react-khooks'; // Keyboard hook
import { emitter } from 'react-khooks'; // Global event queue instance
```

## 🔑 useKeyEvent

A custom React hook for keyboard events, mainly used in internal projects. It supports multiple listeners for the same key combination, but only the most recently added listener will be triggered. You can use this mechanism to implement a queue system for your business logic. Alternatively, you can use emitter to handle event priority.

Note: Written in beginner-level TypeScript. PRs and issues are welcome!

| Parameter | Description |
| --- | --- |
| `keyName` | Keyboard key name or keyCode. Required. For combo keys, use `+`to connect (e.g.,`ctrl+z`). Be mindful of system/browser conflicts. |
| `callback` | Callback function. Receives `KeyboardEvent`as default parameter. Required. |
| `toolEventName` | Custom event name, serves as the unique identifier in the queue. Required. |
| `type` | Trigger on `keyup`or `keydown`. Default:`keyup`. |
| `delayTime` | Throttle/debounce delay in ms.`0`means disabled. Recommended for `keydown`. |
| `delayType` | `1`for throttle,`2`for debounce. Default:`1`. |

Supports combinations like ctrl+alt+shift+key.

You can use the passed-in event object for more logic.

useKeyEvent returns the global emitter, which can also be imported directly for advanced use.

> ✅ Basic Example

```jsx
import React from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const handleClick = () => {
    alert('Pressed Z');
  };

  useKeyEvent({ keyName: 'z', callback: handleClick, toolEventName: 'alert' });

  return <div>Press Z to show alert</div>;
};
```

> 💡 Modifier Keys (ctrl/alt/shift + key)

```jsx
import React, { useState } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const handleClick = () => setNum(num + 1);

  useKeyEvent({ keyName: 'alt+v', callback: handleClick, toolEventName: 'inc_alt' });
  useKeyEvent({ keyName: 'ctrl+v', callback: handleClick, toolEventName: 'inc_ctrl' });
  useKeyEvent({ keyName: 'shift+v', callback: handleClick, toolEventName: 'inc_shift' });

  return (
    <div>
      Press ctrl/alt/shift + v to increase count
      <div>Count: {num}</div>
    </div>
  );
};
```

> 🔁 Dynamic Hotkey Change

```jsx
import React, { useState } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const [hotKey, setHotKey] = useState('m');

  const handleClick = () => setNum(num + 1);

  useKeyEvent({ keyName: hotKey, callback: handleClick, toolEventName: 'dynamic_key' });

  return (
    <div>
      Press {hotKey} to increase count
      <div>Count: {num}</div>
      <button onClick={() => setHotKey('n')}>Switch to "n"</button>
    </div>
  );
};
```

> 🌀 Throttle / Debounce

```jsx
import React, { useState, useCallback } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const handleClick = useCallback(() => setNum(num + 1), [num]);

  useKeyEvent({
    keyName: 'q',
    callback: handleClick,
    toolEventName: 'throttle_q',
    delayTime: 500,
    type: 'keydown',
    delayType: 1,
  });

  useKeyEvent({
    keyName: 'w',
    callback: handleClick,
    toolEventName: 'debounce_w',
    delayTime: 500,
    type: 'keydown',
    delayType: 2,
  });

  return (
    <div>
      <p>Throttle: Hold "q" (fires every 500ms)</p>
      <p>Debounce: Hold "w" (fires after 500ms release)</p>
      <div>Count: {num}</div>
    </div>
  );
};
```

## Recommended Usage of `useCallback` with `useKeyEvent`

> ⚠️ It is **strongly recommended** to wrap your callback functions with `useCallback` to avoid frequent subscription/unsubscription when the component re-renders.

### ✅ Recommended: Use `useCallback` with functional `setState`

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
      Press 'a' to update the `num` state defined via `useState`
      <div>num: {num}</div>
    </div>
  );
};
```

### ✅ Recommended: Use useCallback with dependencies

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
      Press 's' to update the `num` state defined via `useState`
      <div>num: {num}</div>
    </div>
  );
};
```

⚠️ Not Recommended: Using inline or re-created callbacks This approach was previously discouraged due to performance concerns—frequent unsubscribe/subscribe on every render.

✅ Now optimized: Re-renders no longer cause frequent subscribe/unsubscribe. 🔁 However, it's still recommended to use the previous two approaches for maintaining up-to-date state.

```jsx
import React, { useState } from 'react';
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
      <div>Press ctrl+x to increase num</div>
      <div>Press shift+x to decrease num</div>
      <button onClick={() => handleClick(1)}> +1 </button>
      <span>num: {num}</span>
      <button onClick={() => handleClick(-1)}> -1 </button>
    </div>
  );
};
```

> ❄️ Freeze / Unfreeze All Events

```jsx
import React, { useState } from 'react';
import { useKeyEvent } from 'react-khooks';

export default () => {
  const [num, setNum] = useState(0);
  const handleClick = () => setNum((prev) => prev + 1);

  const { emitter } = useKeyEvent({ keyName: 'f', callback: handleClick, toolEventName: 'add' });

  return (
    <div>
      Press "f" to increase count
      <div onClick={() => emitter.freezeAll()}>Freeze</div>
      <div onClick={() => emitter.unfreezeAll()}>Unfreeze</div>
      <div>Count: {num}</div>
    </div>
  );
};
```

<!-- github链接 -->

[![GitHub link](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/he1237596/react-resource/tree/khooks)

<!-- npm链接 -->

[![npm link](https://img.shields.io/badge/NPM-000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/react-khooks)
