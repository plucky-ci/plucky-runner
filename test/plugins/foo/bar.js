const {
  Task,
} = require('plucky-pipeliner');

class BarTask extends Task{
  handler(state, next){
    const {
      params = {},
    } = state;
    return next(0, {status: ((params.status||'')+' Bar').trim()});
  }
}

module.exports = {BarTask};
