module.exports = {
  name: "test",
  description: "This is a test process for plucky-runner",
  imports: {
    'foo': 'foo'
  },
  process: [
    {
      task: 'foo.FooTask'
    },
    {
      task: 'foo.BarTask'
    }
  ]
};
