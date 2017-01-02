const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect

const CopyFileSystem = require('../index');

var fscopy;

describe('filestat method unit tests', () => {
  beforeEach(() => {
    fscopy = new CopyFileSystem();
  });

  it('should return undefined if no parameters passed', () => {
    expect(fscopy.filestat()).to.be.undefined;
  });

  it('should not throw any error if debug is just 1', () => {
    fscopy.options.debug = 1;
    expect(() => fscopy.filestat()).to.not.throw(/.*/);
  });

  it('should throw error if debug is grater than 1', () => {
    fscopy.options.debug = 2;
    expect(() => fscopy.filestat()).to.throw(/.*/);
  });

  it('should throw error message `path must be a string or Buffer`', () => {
    fscopy.options.debug = 2;
    expect(() => fscopy.filestat(null, fs)).to.throw(/path must be a string or Buffer/i);
  });

  it('should throw error message `Cannot read property \'statSync\' of undefined`', () => {
    fscopy.options.debug = 2;
    let filename = path.join('.', 'index.js');
    expect(() => fscopy.filestat(filename)).to.throw('Cannot read property \'statSync\' of undefined');
  });

  it('should return instance of fs.Stats object', () => {
    let filename = path.join('.', 'index.js');
    expect(fscopy.filestat(filename, fs)).to.be.instanceof(fs.Stats);
  });

  it('isFile should be true', () => {
    let filename = path.join('.', 'index.js');
    let stat = fscopy.filestat(filename, fs);
    expect(stat.isFile()).to.be.true;
  });

  it('isDirectory should be false', () => {
    let filename = path.join('.', 'index.js');
    let stat = fscopy.filestat(filename, fs);
    expect(stat.isDirectory()).to.be.false;
  });
});
