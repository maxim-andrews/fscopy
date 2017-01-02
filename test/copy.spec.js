const fs = require('fs');
const path = require('path');
const chai = require('chai');
const spies = require('chai-spies')
const MemoryFileSystem = require('memory-fs');
const CopyFileSystem = require('../index');

var fscopy, fsmem, filename;

chai.use(spies);

const expect = chai.expect;

describe('copy unit tests', () => {
  beforeEach(() => {
  });

  it('description', () => {
  });

  it('description 2', () => {
  });
});