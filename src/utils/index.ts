import _ from 'lodash';
import { Types } from 'mongoose';

export const getInfoData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};
/*
  ['type', 1],
  ['col', 2]
  => {
    type: 1,
    col: 2
  }
*/
export const getSelectData = (select: Array<string> = []) => {
  return Object.fromEntries(select.map((e) => [e, 1]));
};
export const getUnselectData = (select: Array<string> = []) => {
  return Object.fromEntries(select.map((e) => [e, 0]));
};
export const removeUndefinedInObject = (obj: Object) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) delete obj[key];
  });
  return obj;
};
export const removeKeyInObject = (obj: Object, keys: Array<string>) => {
  return Object.keys(obj)
    .filter((keyObj) => !keys.includes(keyObj))
    .reduce((newObj: Object, key: string) => {
      newObj[key] = obj[key];
      return newObj;
    }, {});
};
export const convertToObjectId = (id: string) => new Types.ObjectId(id);
export const changePriceFromStringToNumber = (price: string) => {
  const [number, _] = price.split('₫');
  let res = '';
  for (const i of number) {
    if (i !== '.' && typeof parseInt(i) === 'number') {
      res += i;
    }
  }
  return parseInt(res);
};

export const flattenObject = (obj: Object, parent = '', res = {}) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = parent ? `${parent}.${key}` : key;
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !(obj[key] instanceof RegExp)
      ) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
  }
  return res;
};

export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const daysOfMonth = (month: number, year: number) => {
  const monthsHave31Days = [1, 3, 5, 7, 8, 10, 12];
  const monthsHave30Days = [4, 6, 9, 11];
  if (monthsHave31Days.includes(month)) {
    return 31;
  } else if (monthsHave30Days.includes(month)) {
    return 30;
  } else {
    if (isLeapYear(year)) {
      return 29;
    } else 28;
  }
};
