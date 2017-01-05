const path = require('path');
const chai = require('chai');
const spies = require('chai-spies')
const MemoryFileSystem = require('memory-fs');
const CopyFileSystem = require('../index');

var fscopy, fsmem, filename;

chai.use(spies);

const expect = chai.expect;

describe('printtree method unit tests', () => {
  beforeEach(() => {
    fsmem = new MemoryFileSystem();
    fscopy = new CopyFileSystem();
  });

  it('Should do something', () => {
  });
});