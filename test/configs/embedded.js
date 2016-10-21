const {
  Task
} = require('plucky-pipeliner');

class MyTask extends Task{
  handler(state, next){
    next(0, {success: true})
  }
}

module.exports = {
  name: "test",
  description: "This is a test process for plucky-runner",
  tasks: {
    'test': MyTask
  },
  process: [
    {
      task: 'test'
    }
  ]
};
