const Emitter = require('..');

describe('Emitter', () => {
  describe('.on(event, fn)', () => {
    it('should add listeners', () => {
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

      expect(calls).toEqual(['one', 1, 'two', 1, 'one', 2, 'two', 2]);
    });
  });

  describe('.off(event, fn)', () => {
    it('should remove a listener', () => {
      const emitter = new Emitter();
      const calls = [];

      function one() {
        calls.push('one');
      }
      function two() {
        calls.push('two');
      }

      emitter.on('foo', one);
      emitter.on('foo', two);
      emitter.off('foo', two);

      emitter.emit('foo');

      expect(calls).toEqual(['one']);
    });

    it('should work with .once()', () => {
      const emitter = new Emitter();
      const calls = [];

      function one() {
        calls.push('one');
      }

      emitter.once('foo', one);
      emitter.once('fee', one);
      emitter.off('foo', one);

      emitter.emit('foo');

      expect(calls).toEqual([]);
    });
  });

  describe('.off(event)', () => {
    it('should remove all listeners for an event', () => {
      const emitter = new Emitter();
      const calls = [];
      function one() {
        calls.push('one');
      }
      function two() {
        calls.push('two');
      }

      emitter.on('foo', one);
      emitter.on('foo', two);
      emitter.off('foo');

      emitter.emit('foo');
      emitter.emit('foo');
      expect(calls).toEqual([]);
    });
  });

  describe('.off()', () => {
    it('should remove all listeners', () => {
      const emitter = new Emitter();
      const calls = [];

      function one() {
        calls.push('one');
      }

      function two() {
        calls.push('two');
      }

      emitter.on('foo', one);
      emitter.on('bar', two);

      emitter.emit('foo');
      emitter.emit('bar');

      emitter.off();

      emitter.emit('foo');
      emitter.emit('bar');

      expect(calls).toEqual(['one', 'two']);
    });
  });

  describe('.once(event, fn)', () => {
    it('should add a single-shot listener', () => {
      const emitter = new Emitter();
      const calls = [];

      emitter.once('foo', function (val) {
        calls.push('one', val);
      });

      emitter.emit('foo', 1);
      emitter.emit('foo', 2);
      emitter.emit('foo', 3);
      emitter.emit('bar', 1);

      expect(calls).toEqual(['one', 1]);
    });
  });

  describe('.listeners(event)', () => {
    describe('when handlers are present', () => {
      it('should return an array of callbacks', () => {
        const emitter = new Emitter();
        function foo() {}
        emitter.on('foo', foo);
        expect(emitter.listeners('foo')).toEqual([foo]);
      });
    });

    describe('when no handlers are present', () => {
      it('should return an empty array', () => {
        const emitter = new Emitter();
        expect(emitter.listeners('foo')).toEqual([]);
      });
    });
  });

  describe('.hasListeners(event)', () => {
    describe('when handlers are present', () => {
      it('should return true', () => {
        const emitter = new Emitter();
        emitter.on('foo', () => {});
        expect(emitter.hasListeners('foo')).toBe(true);
      });
    });

    describe('when no handlers are present', () => {
      it('should return false', () => {
        const emitter = new Emitter();
        expect(emitter.hasListeners('foo')).toBe(false);
      });
    });
  });
});
