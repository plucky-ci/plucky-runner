Plucky Runner
===

Standalone pipeline runner for Plucky-CI.

install
---

```shell
npm install -g plucky-runner
```

Usage
---

```shell
plucky-runner <options>
```

###Options

 * --basedir [folder], -b [folder] - Base directory to execute from, defaults to process.cwd()
 * --pluginsfolder [folder], -p [folder] - Path where plugins should be stored, defaults to [baseDir]/plugins
 * --configfile [folder], -c [folder] - Configuration file to use, default searches for one of
  * [baseDir]/.plucky
  * [baseDir]/plucky.js
  * [baseDir]/plucky.json
  * [baseDir]/plucky.yaml
  * [baseDir]/plucky.config
 * --param [param], -P [param] - Set a parameter, defined as [key]:[value]

**NOTE:** pluginsfolder is expanded from baseDir unless you specify a full path.

####Example

Example usage to run one of the test scenaiors manually:

```shell
plucky-runner -c configs/multi.js -p plugins/ -b ~/plucky-runner/test/
```

Would output:

```
{ status: 'Foo Bar' }
```

Example usage to run one of the test scenaiors manually with parameters:

```shell
plucky-runner -c configs/multi.js -p plugins/ -b ~/plucky-runner/test/ -P "status: Command Line Param"
```

Would output:

```
{ status: 'Command Line Param Foo Bar' }
```

Programmatic Usage
---

First install it into your project:

```
npm install --save plucky-runner
```

Then use it in your code:

```javascript
const {
  Runner
} = require('plucky-runner');
const path = require('path');

const pluginsFolder = path.resolve(__dirname, 'plugins');

const runner = new Runner({pluginsFolder});
const globalConfig = {};
const params = {};

runner.run('/path/to/plucky.json', {globalConfig, params}, (err, result)=>{
  if(err){
    return console.error(err);
  }
  console.log('Result:');
  console.log(result);
});
```
