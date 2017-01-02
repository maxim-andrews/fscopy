const chai = require('chai');
const expect = chai.expect;
const CopyFileSystem = require('../index');

var fscopy;

describe('constructor unit tests', () => {

  it('Should check that debug is 0 and overwrite is false when options not passed to the constructor', () => {
    fscopy = new CopyFileSystem();
    expect(fscopy.options.debug).to.equal(0);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 0 and overwrite is false when debug equal to 0 passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 0 });
    expect(fscopy.options.debug).to.equal(0);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 1 and overwrite is false when debug equal to 1 passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 1 });
    expect(fscopy.options.debug).to.equal(1);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 2 and overwrite is false when debug equal to 2 passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 2 });
    expect(fscopy.options.debug).to.equal(2);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 0 and overwrite is false when overwrite equal to false passed to the constructor', () => {
    fscopy = new CopyFileSystem({ overwrite: false });
    expect(fscopy.options.debug).to.equal(0);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 0 and overwrite is true when overwrite equal to true passed to the constructor', () => {
    fscopy = new CopyFileSystem({ overwrite: true });
    expect(fscopy.options.debug).to.equal(0);
    expect(fscopy.options.overwrite).to.be.true;
  });

  it('Should check that debug is 0 and overwrite is false when debug equal to 0 and overwrite equal to false passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 0, overwrite: false });
    expect(fscopy.options.debug).to.equal(0);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 1 and overwrite is false when debug equal to 1 and overwrite equal to false passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 1, overwrite: false });
    expect(fscopy.options.debug).to.equal(1);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 2 and overwrite is false when debug equal to 2 and overwrite equal to false passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 2, overwrite: false });
    expect(fscopy.options.debug).to.equal(2);
    expect(fscopy.options.overwrite).to.be.false;
  });

  it('Should check that debug is 0 and overwrite is true when debug equal to 0 and overwrite equal to true passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 0, overwrite: true });
    expect(fscopy.options.debug).to.equal(0);
    expect(fscopy.options.overwrite).to.be.true;
  });

  it('Should check that debug is 1 and overwrite is true when debug equal to 1 and overwrite equal to true passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 1, overwrite: true });
    expect(fscopy.options.debug).to.equal(1);
    expect(fscopy.options.overwrite).to.be.true;
  });

  it('Should check that debug is 2 and overwrite is true when debug equal to 2 and overwrite equal to true passed to the constructor', () => {
    fscopy = new CopyFileSystem({ debug: 2, overwrite: true });
    expect(fscopy.options.debug).to.equal(2);
    expect(fscopy.options.overwrite).to.be.true;
  });
});