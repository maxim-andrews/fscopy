const chai = require('chai');
const spies = require('chai-spies')

const CopyFileSystem = require('../index');

var fscopy;

chai.use(spies);

const expect = chai.expect;

describe('debug method unit tests', () => {
  beforeEach(() => {
    fscopy = null;
  });

  it('debug should be off and console.log should not be called at all', () => {
    fscopy = new CopyFileSystem();
    expect(fscopy.options.debug).to.equal(0);
    chai.spy.on(console, 'log');
    fscopy.debug('This is test output string');
    expect(console.log).not.have.been.called();
    console.log.reset();
  });

  it('debug should be on and console.log should be called once', () => {
    let output = console.log;
    console.log = function() {};
    fscopy = new CopyFileSystem({ debug: 1 });
    expect(fscopy.options.debug).not.equal(0);
    chai.spy.on(console, 'log');
    fscopy.debug('This is test output string');
    expect(console.log).to.have.been.called.once;
    console.log.reset();
    console.log = output;
    output = null;
  });
});