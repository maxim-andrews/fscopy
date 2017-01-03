const path = require('path');
const chai = require('chai');
const spies = require('chai-spies')
const MemoryFileSystem = require('memory-fs');
const CopyFileSystem = require('../index');

var fscopy, srcFS, dstFS;

chai.use(spies);

const expect = chai.expect;

describe('copy unit tests', () => {
  beforeEach(() => {
    fscopy = null;
    srcFS = new MemoryFileSystem();
    dstFS = new MemoryFileSystem();
  });

  it('Should return false if passed source path do not exists or not passed', () => {
  });
});