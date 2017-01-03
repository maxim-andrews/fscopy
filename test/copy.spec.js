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
    let folder = path.join('/', 'path', 'do', 'not', 'exists');
    fscopy = new CopyFileSystem();
    expect(fscopy.copy(folder, srcFS, dstFS)).to.be.false;
  });

  /*
  Not possible to test this.
  it('Should return false if passed source path is not a file and not a directory', () => {
    let folder = path.join('/', 'some', 'long', 'folder', 'path', 'which', 'exists');
    let myFile = path.join(folder, 'thisIsFile');
    let myLink = path.join(folder, 'thisIsLink');
    srcFS.mkdirpSync(folder);
    srcFS.writeFileSync(myFile, 'Some data in file!', 'utf8');
    srcFS.linkSync(myFile, myLink)
    fscopy = new CopyFileSystem();
    expect(fscopy.copy(myLink, srcFS, dstFS)).to.be.false;
  });*/

  it('Should return false if passed source path is a file and destination path exists and options isn\'t set to overwrite', () => {
    let folder = path.join('/', 'some', 'long', 'folder', 'path', 'which', 'exists');
    let myFile = path.join(folder, 'thisIsFile');

    srcFS.mkdirpSync(folder);
    srcFS.writeFileSync(myFile, 'Some data in file!', 'utf8');

    dstFS.mkdirpSync(folder);
    dstFS.writeFileSync(myFile, 'Some data in file!', 'utf8');

    fscopy = new CopyFileSystem();
    expect(fscopy.copy(myFile, srcFS, dstFS)).to.be.false;
  });

  it('Should call method remove', () => {
    let folder = path.join('/', 'some', 'long', 'folder', 'path', 'which', 'exists');
    let myFile = path.join(folder, 'thisIsFile');

    srcFS.mkdirpSync(folder);
    srcFS.writeFileSync(myFile, 'Some data in file!', 'utf8');

    dstFS.mkdirpSync(folder);
    dstFS.writeFileSync(myFile, 'Some data in file!', 'utf8');

    fscopy = new CopyFileSystem({ overwrite: true });

    chai.spy.on(fscopy, 'remove');

    expect(fscopy.copy(myFile, srcFS, dstFS)).to.be.undefined;
    expect(fscopy.remove).to.have.been.called.once;
  });

  it('Should call method \'writeFileSync\' on destination file system and create file', () => {
    let folder = path.join('/', 'some', 'long', 'folder', 'path', 'which', 'exists');
    let myFile = path.join(folder, 'thisIsFile');

    srcFS.mkdirpSync(folder);
    srcFS.writeFileSync(myFile, 'Some data in file!', 'utf8');

    fscopy = new CopyFileSystem();

    chai.spy.on(dstFS, 'writeFileSync');

    expect(fscopy.copy(myFile, srcFS, dstFS)).to.be.undefined;
    expect(dstFS.writeFileSync).to.have.been.called.once;
  });

  it('Should create folder in destination file system', () => {
    let pathname = path.join('/', 'some', 'long', 'folder', 'path', 'which', 'exists');
    let folder = path.join(pathname, 'thisIsFolder');

    srcFS.mkdirpSync(folder);

    chai.spy.on(dstFS, 'mkdirpSync');

    fscopy = new CopyFileSystem();
    expect(fscopy.copy(folder, srcFS, dstFS)).to.be.undefined;
    expect(dstFS.mkdirpSync).to.have.been.called.once;
    expect(fscopy.filestat(folder, dstFS).isDirectory()).to.be.true;
  });
});