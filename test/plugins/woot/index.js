const {
  Task,
} = require('plucky-pipeliner');

class WootTask extends Task{
  handler(state, next){
    const {
      params = {},
    } = state;
    return next(0, {status: ((params.status||'')+' Woot').trim()});
  }
}

module.exports = WootTask;
