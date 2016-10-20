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

module.exports = {
  typeOf,
  defaults,
  isNumeric
};
