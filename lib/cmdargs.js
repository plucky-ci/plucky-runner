const {
  argIsKey,
  cmdArg,
} = require('./cmdutils');
const {
  toKeyedObject,
  valueFrom,
  extend,
} = require('./utils');

const checkMerge = (args, {key, value})=>{
  const bucket = args[key];
  if(typeof(bucket)!=='undefined'){
    if(Array.isArray(bucket)){
      return extend(args, {[key]: value});
    }
    if(typeof(value)==='boolean' && typeof(bucket)==='boolean'){
      return extend(args, {[key]: value});
    }
    return extend(args, {[key]: [value]});
  }
  return extend(args, {[key]: value});
};

const args = (()=>{
  let i = 0;
  let values = [];
  const l = process.argv.length;
  while(i < l){
    if(argIsKey(i)){
      const arg = cmdArg(i);
      values = values.concat(...(Array.isArray(arg)?arg:[arg]));
      if(arg.consumed){
        i = i+2;
        continue;
      }
    }
    i++;
  }
  const args = values.reduce(checkMerge, {});
  return extend(...Object.keys(args).map((key)=>toKeyedObject(key, args[key])));
})();

const expandArgs = (expansions, argSet = args)=>{
  const argKeys = Object.keys(argSet);
  return argKeys.reduce((res, akey)=>{
    const key = expansions[akey];
    if(!key){
      return res;
    }
    const value = argSet[akey];
    return checkMerge(res, {key, value});
  }, argSet);
};

module.exports = {
  args,
  expandArgs,
};
