const {
  ConfigLoader
} = require('plucky-loader');
const {
  Task,
  Pipeline
} = require('plucky-pipeliner');
const {
  PluginManager
} = require('plucky-plugin-manager');
const {
  defaults,
  isNumeric
} = require('./utils');
const path = require('path');
const EventEmitter = require('events');

class Runner extends EventEmitter{
  constructor({pluginsFolder, baseDir = ''} = {}){
    super();
    this.plugins = new PluginManager({pluginsFolder});
    this.baseDir = baseDir;
  }

  pluginsToTasks(plugins){
    // This only works for now, it needs to be expanded big time
    return plugins;
  }

  run(configFile, options, callback){
    if(typeof(options)==='function'){
      callback = options;
      options = {};
    }
    const {
      globalConfig,
      params
    } = options;
    const configLocation = path.resolve(process.cwd(), this.baseDir, configFile);
    const loader = new ConfigLoader(configLocation, globalConfig, {});
    const baseConfig = loader.config;
    this.plugins.get(baseConfig.imports || {}, (err, plugins)=>{
      if(err){
        this.emit('error', err);
        return callback(err);
      }
      const tasks = this.pluginsToTasks(plugins);
      const config = defaults(baseConfig, {tasks});
      if(!Array.isArray(config.process)){
        config.process.length = Object.keys(config.process).reduce((c, n)=>isNumeric(n)?c+1:c, 0);
        config.process = Array.prototype.slice.call(config.process);
      }
      const pipeline = new Pipeline(config);
      const {
        wrap,
        unwrap
      } = ((runner, pipeline)=>{
        const wrapped = {};
        return {
          wrap(event){
            wrapped[event] = (...args)=>runner.emit(event, ...args);
            pipeline.on(event, wrapped[event]);
          },
          unwrap(){
            Object.keys(wrapped).forEach((name)=>pipeline.removeListener(name, wrapped[name]));
          }
        };
      })(this, pipeline);
      wrap('error');
      wrap('step');
      wrap('progress');
      wrap('steperror');
      wrap('done');
      pipeline.execute(params, (code, value)=>{
        unwrap();
        return callback(code, value);
      });
    });
  }
};

module.exports = {
  Runner
};
