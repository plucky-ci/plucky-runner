const {
  typedValueOf,
  defaultValue,
} = require('./utils');

const reIsArgKey = /^-/;
const argIsKey = (index)=>{
  const value = process.argv[index];
  return !!reIsArgKey.exec(value);
};

const reExtractKey = /^(-+)([^=]+)/;
const cmdArg = (index)=>{
  const item = process.argv[index];
  const match = reExtractKey.exec(item);
  const short = match[1].length===1;
  const key = match[2];
  const raw = item.split('=').slice(1).join('=');
  const isKey = argIsKey(index+1);
  const consumed = !(raw || isKey);
  const value = raw || (isKey?true:typedValueOf(defaultValue(process.argv[index+1], true)));
  if(short && key.length > 1){
    return key.split('').map((key)=>{
      return {
        short,
        item,
        index,
        value,
        consumed,
        key,
      };
    });
  }
  return {
    short,
    item,
    index,
    value,
    consumed,
    key,
  };
};

const getCmdValue = (options, defValue)=>{
  if(typeof(options)==='string'){
    options = {long: options};
  }
  const {
    short = false,
    long,
  } = options;
  const reMatch = short?new RegExp(`(^-(${short})|^--(${long}))`, 'i'):new RegExp(`(^--(${long}))`, 'i');
  const checkMatch = (item, index)=>{
    const match = reMatch.exec(item);
    if(match){
      return cmdArg(index);
    }
    return false;
  };
  const matches = process.argv.map(checkMatch).filter((item)=>!!item);
  if(!matches.length){
    return typeof(defValue)==='function'?defValue():defValue;
  }
  const values = matches.map(({value})=>value);
  return values.length===1?values[0]:values;
};

module.exports = {
  argIsKey,
  getCmdValue,
  cmdArg,
};
