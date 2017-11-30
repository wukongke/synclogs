
export default {
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  isEmptyObject(obj) {
    const isEmpty = false;
    if (Object.keys(obj).length === 0) {
      return true;
    }
    return isEmpty;
  },
  // 对象深拷贝 仅适用json对象
  deepClone(data) {
    return JSON.parse(JSON.stringify(data));
  },
  // 判断maxArr数组是否包含minArr
  isContained(maxArr, minArr) {
    if (!(maxArr instanceof Array) || !(minArr instanceof Array)) return false;
    if (maxArr.length < minArr.length) return false;
    for (const i in minArr) {
      if (!maxArr.includes(minArr[i])) return false;
    }
    return true;
  },
};
