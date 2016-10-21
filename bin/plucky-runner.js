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
  'P': 'param',
  '?': 'help',
  'h': 'help'
});

if(args.help){
  console.log('plucky-runner <options>');
  console.log();
  console.log('Options:');
  console.log('  --basedir [folder], -b [folder] - Base directory to execute from, defaults to process.cwd()');
  console.log('  --pluginsfolder [folder], -p [folder] - Path where plugins should be stored, defaults to [baseDir]/plugins');
  console.log('  --configfile [folder], -c [folder] - Configuration file to use, default searches for one of');
  console.log('    * [baseDir]/.plucky');
  console.log('    * [baseDir]/plucky.js');
  console.log('    * [baseDir]/plucky.json');
  console.log('    * [baseDir]/plucky.yaml');
  console.log('    * [baseDir]/plucky.config');
  console.log(' --param [param], -P [param] - Set a parameter, defined as [key]:[value]');
  console.log();
  console.log('Example:');
  console.log('  plucky-runner -c configs/multi.js -p plugins/ -b ~/plucky-runner/test/ -P "status: Command Line Param"');
  process.exit(0);
}

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
