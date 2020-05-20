#!/usr/bin/env node
import path from 'path';
import fs from 'fs';

const normalizesOutputInStr = (coll) => {
  const iter = (items, acc) => {
    const [item] = items;
    if (items.length === 0) {
      return `${acc}\n${'}'}`;
    }
    return iter(items.splice(1, items.length - 1), `${acc}\n ${item}`);
  };
  return iter(coll, '{');
};

const getDiffObj = (firstObj, secondObj) => {
  const result = [];
  for (const key in firstObj) {
    for (const sKey in secondObj) {
      if (key === sKey && firstObj[key] === secondObj[key]) {
        result.push(`${key}: ${firstObj[key]}`);
      }
      if (key === sKey && firstObj[key] !== secondObj[key]) {
        result.push(`+ ${sKey}: ${secondObj[sKey]}`);
        result.push(`- ${key}: ${firstObj[key]}`);
      }
      if (!Object.prototype.hasOwnProperty.call(secondObj, key) && !result.includes(`- ${key}: ${firstObj[key]}`)) {
        result.push(`- ${key}: ${firstObj[key]}`);
      }
      if (!Object.prototype.hasOwnProperty.call(firstObj, sKey) && !result.includes(`+ ${sKey}: ${secondObj[sKey]}`)) {
        result.push(`+ ${sKey}: ${secondObj[sKey]}`);
      }
    }
  }
  return normalizesOutputInStr(result);
};


const genDiff = (firstPathToFile, secondPathToFile) => {
  const fp = path.resolve(firstPathToFile);
  const sp = path.resolve(secondPathToFile);
  const data = fs.readFileSync(fp);
  const data2 = fs.readFileSync(sp);
  const parseDataInStr = String.fromCharCode.apply(String, data);
  const parseData2InStr = String.fromCharCode.apply(String, data2);
  const dataAsObj = JSON.parse(parseDataInStr);
  const data2AsObj = JSON.parse(parseData2InStr);
  return getDiffObj(dataAsObj, data2AsObj);
};

export default genDiff;
