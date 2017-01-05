const path = require('path');
const chai = require('chai');
const spies = require('chai-spies')
const MemoryFileSystem = require('memory-fs');
const CopyFileSystem = require('../index');

var fscopy, dstFS;

chai.use(spies);

const expect = chai.expect;

describe('makefilefolder unit tests', () => {
  beforeEach(() => {
    fscopy = new CopyFileSystem();
    dstFS = new MemoryFileSystem();
  });

  it('Should not call mkdirpSync if file is in the root directory', () => {
    let filename = path.join('/', 'text.file');

    chai.spy.on(dstFS, 'mkdirpSync');
    fscopy.makefilefolder(filename, dstFS);
    expect(dstFS.mkdirpSync).not.have.been.called();
  });

  it('Should create folder if file is not in the root directory', () => {
    let filename = path.join('/', 'some', 'where', 'deep', 'on', 'hard', 'drive', 'text.file');
    let folder = path.dirname(filename);

    chai.spy.on(dstFS, 'mkdirpSync');

    fscopy.makefilefolder(filename, dstFS);
    expect(dstFS.mkdirpSync).to.have.been.called.once;

    let dir = dstFS.statSync(folder);
    expect(dir.isDirectory()).to.be.true;
  });
});