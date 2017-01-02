const path = require('path');
const chai = require('chai');
const spies = require('chai-spies')
const MemoryFileSystem = require('memory-fs');
const CopyFileSystem = require('../index');

var fscopy, fsmem, filename;

chai.use(spies);

const expect = chai.expect;

describe('remove method unit tests', () => {
  beforeEach(() => {
    fsmem = new MemoryFileSystem();
    fscopy = new CopyFileSystem();

    filename = path.join('/', 'very', 'long', 'path', 'to', 'file', 'mysupertest.file');

    fsmem.mkdirpSync(path.dirname(filename));
    fsmem.writeFileSync(filename, 'this is test content!', 'utf8');
  });

  it('file /very/long/path/to/file/mysupertest.file should exist', () => {
    let stat = fscopy.filestat(filename, fsmem);
    expect(stat.isFile()).to.be.true;
  });

  it('/very/long/path/to/file/mysupertest.file is not a folder', () => {
    let stat = fscopy.filestat(filename, fsmem);
    expect(stat.isDirectory()).to.be.false;
  });

  it('folder /very/long/path/to/file should exist', () => {
    let stat = fscopy.filestat(path.dirname(filename), fsmem);
    expect(stat.isDirectory()).to.be.true;
  });

  it('/very/long/path/to/file is not a file', () => {
    let stat = fscopy.filestat(path.dirname(filename), fsmem);
    expect(stat.isFile()).to.be.false;
  });

  it('should remove /very/long/path/to/file/mysupertest.file without calling filestat', () => {
    let stat = fscopy.filestat(filename, fsmem);
    expect(stat.isFile()).to.be.true;
    chai.spy.on(fscopy, 'filestat');
    fscopy.remove(filename, fsmem, stat);
    expect(fscopy.filestat).not.have.been.called();
    fscopy.filestat.reset();
    stat = fscopy.filestat(filename, fsmem);
    expect(stat).to.be.undefined;
  });

  it('should remove /very/long/path/to/file/mysupertest.file calling filestat once', () => {
    chai.spy.on(fscopy, 'filestat');
    fscopy.remove(filename, fsmem);
    expect(fscopy.filestat).to.have.been.called.once;
    fscopy.filestat.reset();
    let stat = fscopy.filestat(filename, fsmem);
    expect(stat).to.be.undefined;
  });

  it('should remove /very/long/path/to/file folder without calling filestat', () => {
    let stat = fscopy.filestat(filename, fsmem);
    fscopy.remove(filename, fsmem, stat);
    stat = fscopy.filestat(path.dirname(filename), fsmem);
    expect(stat.isFile()).to.be.false;
    expect(stat.isDirectory()).to.be.true;
    chai.spy.on(fscopy, 'filestat');
    fscopy.remove(path.dirname(filename), fsmem, stat);
    expect(fscopy.filestat).not.have.been.called();
    fscopy.filestat.reset();
    stat = fscopy.filestat(path.dirname(filename), fsmem);
    expect(stat).to.be.undefined;
  });

  it('should remove /very/long/path/to/file folder calling filestat once', () => {
    let stat = fscopy.filestat(filename, fsmem);
    fscopy.remove(filename, fsmem, stat);
    stat = fscopy.filestat(path.dirname(filename), fsmem);
    expect(stat.isFile()).to.be.false;
    expect(stat.isDirectory()).to.be.true;
    chai.spy.on(fscopy, 'filestat');
    fscopy.remove(path.dirname(filename), fsmem);
    expect(fscopy.filestat).to.have.been.called.once;
    fscopy.filestat.reset();
    stat = fscopy.filestat(path.dirname(filename), fsmem);
    expect(stat).to.be.undefined;
  });
});