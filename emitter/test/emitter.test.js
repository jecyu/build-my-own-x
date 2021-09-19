const Emitter = require('..');

describe('Emitter', function () {
  describe('.on(event, fn)', function () {
    it('should add listeners', function () {
      const emitter = new Emitter();
      const calls = [];

      emitter.on('foo', function (val) {
        calls.push('one', val);
      });

      emitter.on('foo', function (val) {
        calls.push('two', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('bar', 1);
      emitter.emit('foo', 2);

      console.log('calls ->', calls)
      expect(calls).toEqual(['one', 1, 'two', 1, 'one', 2, 'two', 2]);
    });
  });
});
