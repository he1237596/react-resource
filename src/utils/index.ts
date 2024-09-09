/*
 * @Author: Chris
 * @Date: 2023-08-19 18:16:14
 * @LastEditors: Chris
 * @LastEditTime: 2024-09-09 23:37:02
 * @Descripttion: **
 */
const dictKeys: string[] = ['ctrl', 'alt', 'shift'];
type event = {
  key: string;
  keyCode: number;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  [key: string]: any;
};
const getKeyInfo = (eventName: string): { keyName: string; combineKeys: string[] } => {
  let keyName = eventName + '';
  let combineKeys: string[] = [];
  if (eventName.length > 1 && eventName.indexOf('+') > -1) {
    const keys = eventName.split('+');
    const [key, ...otherKeys] = keys.reverse();
    combineKeys = otherKeys;
    keyName = key;
  }
  keyName = keyName.toLowerCase();
  return { keyName, combineKeys };
};
const canPublish = (event: event, combineKeys: string[], keyName: string): boolean => {
  if (!(event.key.toLowerCase() === keyName || String(event.keyCode) === keyName)) {
    return false;
  }
  if (combineKeys.length > 0) {
    const isAllTrue = combineKeys.every((item) => event[`${item}Key`] === true);
    const otherKeys = dictKeys.filter((item) => !combineKeys.includes(item));
    const isOtherAllfalse = otherKeys.every((item) => event[`${item}Key`] === false);
    if (!isAllTrue || !isOtherAllfalse) {
      return false;
    }
  } else {
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      return false;
    }
  }
  return true;
};

export default {
  getKeyInfo,
  canPublish,
};
