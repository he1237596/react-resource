/*
 * @Author: Chris
 * @Date: 2023-08-19 18:16:14
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-19 20:16:47
 * @Descripttion: **
 */

const getKeyInfo = (eventName) => {
  let keyName = eventName + '';
  let combineKeys = []
  if (eventName.length > 1 && eventName.indexOf('+') > -1) {
    const keys = eventName.split('+');
    const [key, ...otherKeys] = keys.reverse();
    combineKeys = otherKeys;
    keyName = key;
  }
  keyName = keyName.toLowerCase();
  return { keyName, combineKeys }
}
const canPublish = (event, combineKeys, keyName) => {
  if (!(event.key.toLowerCase() === keyName || String(event.keyCode) === keyName)) {
    return false;
  }
  if (combineKeys.length > 0) {
    for (let i = 0; i < combineKeys.length; i++) {
      if (!event[`${combineKeys[i]}Key`]) {
        return false;
      }
    }
  } else {
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      return false;
    }
  }
  return true;
}

export default {
  getKeyInfo,
  canPublish
}