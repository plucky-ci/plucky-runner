const {
  Runner
} = require('../');
const path = require('path');
const fs = require('fs');

const args = require('../lib/cmdargs').expandArgs({
  'b': 'basedir',
  'p': 'pluginsfolder',
  'c': 'configfile'
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

const r = new Runner({pluginsFolder, baseDir});

r.run(projectFile, (code, result)=>{
  console.log(result);
  process.exit(code);
});
