const {
  Task,
} = require('plucky-pipeliner');

class FooTask extends Task{
  handler(state, next){
    const {
      params = {},
    } = state;
    return next(0, {status: ((params.status||'')+' Foo').trim()});
  }
}

module.exports = {FooTask};
