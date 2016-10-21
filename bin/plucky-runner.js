const {
  Runner
} = require('../');
const {
  typedValueOf
} = require('../lib/utils');
const path = require('path');
const fs = require('fs');

const args = require('../lib/cmdargs').expandArgs({
  'b': 'basedir',
  'p': 'pluginsfolder',
  'c': 'configfile',
  'd': 'debug',
  'P': 'param'
});

const baseDir = path.resolve(process.cwd(), args.basedir || args.baseDir || '');
const pluginsFolder = path.join(baseDir, args.pluginsfolder || args.pluginsFolder || 'plugins');

const possibleNames = [
  '.plucky',
  'plucky.js',
  'plucky.json',
  'plucky.yaml',
  'plucky.config'
].map((name)=>path.join(baseDir, name));

const projectFile = ((possibleNames)=>{
  const cfgFile = args.configfile || args.configFile || false;
  if(cfgFile){
    possibleNames = possibleNames.slice();
    possibleNames.unshift(path.resolve(baseDir, cfgFile));
  }
  const foundNames = possibleNames.filter((name)=>fs.existsSync(name));
  return foundNames.length>0?foundNames.shift():false;
})(possibleNames);

if(!projectFile){
  console.error('No plucky project configuration file found, searched: ', possibleNames);
  process.exit(1);
}

const params = ((src)=>{
  if(!src){
    return {};
  }
  const params = Array.isArray(src)?src:[src];
  return params.reduce((params, param)=>{
    const parts = param.split(/:(.+)?/).map((s)=>s.trim()).filter((s)=>!!s);
    const [
      key,
      value
    ] = parts;
    params[key] = value;
    return params;
  }, {});
})(args.param);

const r = new Runner({pluginsFolder, baseDir});

if(args.debug){
  const util = require('util');
  const wrap = (event)=>{
    return r.on(event, (...raw)=>{
      const args = raw.map((s)=>util.inspect(s, {colors: true}));
      (console[event]||console.log)(event.toUpperCase()+':', ...args);
    });
  };
  wrap('error');
  wrap('step');
  wrap('progress');
  wrap('steperror');
  wrap('done');
}

r.run(projectFile, {params}, (code, result)=>{
  console.log(result);
  process.exit(code);
});
