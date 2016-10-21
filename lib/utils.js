const typeOf = (val)=>{
  if(Array.isArray(val)){
    return 'array';
  }
  if(val instanceof RegExp){
    return 'regexp';
  }
  if(val instanceof Date){
    return 'date';
  }
  return typeof(val);
}

const defaults = (...args)=>{
  const type0 = typeOf(args[0]);
  if(type0 === 'array'){
    return args[0].slice();
  }
  if(type0 !== 'object'){
    return args.find((elem)=>{
      return !!elem;
    });
  }
  return args.reduce((res, arg)=>{
    const typeA = typeOf(arg);
    if(typeA !== 'object'){
      return res;
    }
    return Object.keys(arg).reduce((res, key)=>{
      if(typeOf(res[key])!=='undefined'){
        return res;
      }
      const value = arg[key];
      const typeV = typeof(value);
      res[key] = value;
      return res;
    }, res);
  }, {});
};

const isNumeric = (n)=>{
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const toKeyedObject = (path, value)=>{
  const parts = Array.isArray(path)?path:path.split('.');
  const segment = parts[0];
  if(!segment){
    return value;
  }
  return {[segment]: toKeyedObject(parts.slice(1), value)};
};

const valueFrom = (path=[], source, defaultValue)=>{
  const parts = Array.isArray(path)?path:path.split('.');
  const segment = parts[0];
  if(!segment){
    return source;
  }
  if(typeof(source[segment])!=='undefined'){
    return valueFrom(parts.slice(1), source[segment], defaultValue);
  }
  return defaultValue;
};

const extend = (...args)=>{
  if(!args.length){
    return {};
  }
  return args.reduce((res, arg)=>{
    if(!res){
      return arg;
    }
    if(Array.isArray(res)){
      return [...res, ...(Array.isArray(arg)?arg:[arg])];
    }
    if(Array.isArray(arg)){
      return [res, ...arg];
    }
    const rType = typeof(res);
    const aType = typeof(arg);
    if(rType !== 'object'){
      return arg;
    }
    if(aType !== 'object'){
      return [res, arg];
    }
    return Object.keys(arg).reduce((res, key)=>{
      return Object.assign({}, res, {[key]: extend(res[key], arg[key])});
    }, res);
  });
  return Object.assign({}, ...args);
};

const defaultValue = (against, defaultValue)=>typeof(against)!=='undefined'?against:defaultValue;

const typedValueOf = (value)=>{
  const type = typeof(value);
  if(type === 'string'){
    if(isNumeric(value)){
      return +value;
    }
    if(/^(true|t|y|yes)$/i.exec(value)){
      return true;
    }
    if(/^(false|f|n|no)$/i.exec(value)){
      return false;
    }
  }
  return value;
};

module.exports = {
  typeOf,
  defaults,
  isNumeric,
  toKeyedObject,
  valueFrom,
  extend,
  defaultValue,
  typedValueOf
};
