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
plucky-runner <options> /path/to/plucky.config
```

###Options

 * --pluginsfolder <folder>, -p <folder> - Path where plugins should be stored

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

runner.run('/path/to/plucky.json', (err, result)=>{
  if(err){
    return console.error(err);
  }
  console.log('Result:');
  console.log(result);
});
```
