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
