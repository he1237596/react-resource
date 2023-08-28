/*
 * @Author: Chris
 * @Date: 2023-08-19 18:16:14
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-28 10:20:00
 * @Descripttion: **
 */
const dictKeys = ['ctrl', 'alt', 'shift']
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
    const isAllTrue = combineKeys.every(item => event[`${item}Key`] === true)
    const otherKeys = dictKeys.filter(item => !combineKeys.includes(item))
    const isOtherAllfalse = otherKeys.every(item => event[`${item}Key`] === false)
    if(!isAllTrue || !isOtherAllfalse) {
      return false;
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