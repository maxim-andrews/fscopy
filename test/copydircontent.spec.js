const fs = require('fs');
const path = require('path');
const chai = require('chai');
const spies = require('chai-spies')
const MemoryFileSystem = require('memory-fs');
const CopyFileSystem = require('../index');

chai.use(spies);

const expect = chai.expect;

var fscopy, srcFS, dstFS, cpOrig;

describe('copydircontent unit tests', () => {
  beforeEach(() => {
    srcFS = new MemoryFileSystem();
    dstFS = new MemoryFileSystem();
    fscopy = new CopyFileSystem();

    chai.spy.on(srcFS, 'readdirSync');
    
    cpOrig = fscopy.copy;
    fscopy.copy = () => {};

    chai.spy.on(fscopy, 'copy');
  });
  
  it('Should throw error because is nothing passed', () => {
    expect(() => fscopy.copydircontent()).to.throw(/Cannot read property \'readdirSync\' of undefined/i);
    expect(srcFS.readdirSync).not.have.been.called();
    expect(fscopy.copy).not.have.been.called();
  });

  it('SHould throw error because nor source file system passed nor destination', () => {
    filename = path.join('/', 'very', 'long', 'path', 'to', 'file', 'mysupertest.file');
    expect(() => fscopy.copydircontent(path.dirname(filename))).to.throw(/Cannot read property \'readdirSync\' of undefined/i);
    expect(srcFS.readdirSync).not.have.been.called();
    expect(fscopy.copy).not.have.been.called();
  });

  it('Should throw error because passed file or directory shouldn\'t exists', () => {
    expect(() => fscopy.copydircontent('/this/file/should/not/exist', srcFS, dstFS)).to.throw(/no such file or directory/i);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).not.have.been.called();
  });
  
  it('Should throw error about file being passed', () => {
    filename = path.join('/', 'very', 'long', 'path', 'to', 'file', 'mysupertest.file');
    srcFS.mkdirpSync(path.dirname(filename));
    srcFS.writeFileSync(filename, 'This is test data!', 'utf8');
    expect(() => fscopy.copydircontent(filename, srcFS, dstFS)).to.throw(/not a directory/i);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).not.have.been.called();
  });
  
  it('Should browse empty directory and never call \'copy\'', () => {
    filename = path.join('/', 'very', 'long', 'path', 'to', 'file');
    srcFS.mkdirpSync(filename);
    fscopy.copydircontent(filename, srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).not.have.been.called();
  });

  it('Should browse folder with one file and call \'copy\' just one time', () => {
    filename = path.join('/', 'very', 'long', 'path', 'to', 'file', 'mysupertest.file');
    srcFS.mkdirpSync(path.dirname(filename));
    srcFS.writeFileSync(filename, 'This is test data!', 'utf8');
    fscopy.copydircontent(path.dirname(filename), srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.once;
  });

  it('Should browse folder with three files and call \'copy\' exactly three times', () => {
    let pathname = path.join('/', 'very', 'long', 'path', 'to', 'file');
    let filenames = ['mysupertest.file', 'mysuperanothertest.file', 'myanothertest.file'];

    srcFS.mkdirpSync(pathname);

    filenames.forEach(filename => {
      srcFS.writeFileSync(path.join(pathname, filename), 'This is test data for file ' + filename + ' !', 'utf8');
    });

    fscopy.copydircontent(pathname, srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.exactly(3);
  });

  it('Should browse folder with one sub folder and call \'copy\' once', () => {
    foldername = path.join('/', 'very', 'long', 'path', 'to', 'folder', 'with', 'subfolder');
    srcFS.mkdirpSync(foldername);
    fscopy.copydircontent(path.dirname(foldername), srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.once;
  });

  it('Should browse folder with three sub folders and call \'copy\' exactly three times', () => {
    let pathname = path.join('/', 'very', 'long', 'path', 'to', 'file');
    let foldernames = ['mysupertest', 'mysuperanothertest', 'myanothertest'];

    foldernames.forEach(foldername => {
      srcFS.mkdirpSync(path.join(pathname, foldername));
    });

    fscopy.copydircontent(pathname, srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.exactly(3);
  });

  it('Should browse folder with one file and one sub folder and call \'copy\' twice', () => {
    let pathname = path.join('/', 'very', 'long', 'path', 'to', 'file');
    let foldername = 'mysupertest';
    let filename = 'mysupertest.file';

    srcFS.mkdirpSync(path.join(pathname, foldername));
    srcFS.writeFileSync(path.join(pathname, filename), 'This is test data for file ' + filename + ' !', 'utf8');

    fscopy.copydircontent(pathname, srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.twice;
  });

  it('Should browse folder with two files and one sub folder and call \'copy\' three times', () => {
    let pathname = path.join('/', 'very', 'long', 'path', 'to', 'file');
    let foldername = 'mysupertest';
    let filenames = ['mysupertest.file', 'anothertest.file'];

    srcFS.mkdirpSync(path.join(pathname, foldername));

    filenames.forEach(filename => {
      srcFS.writeFileSync(path.join(pathname, filename), 'This is test data for file ' + filename + ' !', 'utf8');
    });

    fscopy.copydircontent(pathname, srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.exactly(3);
  });

  it('Should browse folder with one file and two sub folders and call \'copy\' three times', () => {
    let pathname = path.join('/', 'very', 'long', 'path', 'to', 'file');
    let foldernames = ['mysupertest', 'anothertest'];
    let filename = 'mysupertest.file';

    foldernames.forEach(foldername => {
      srcFS.mkdirpSync(path.join(pathname, foldername));
    });

    srcFS.writeFileSync(path.join(pathname, filename), 'This is test data for file ' + filename + ' !', 'utf8');

    fscopy.copydircontent(pathname, srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.exactly(3);
  });

  it('Should browse folder with three files and three sub folders and call \'copy\' six times', () => {
    let pathname = path.join('/', 'very', 'long', 'path', 'to', 'file');
    let foldernames = ['mysupertest', 'anothertest', 'onemoretest'];
    let filenames = ['mysupertest.file', 'anothertest.file', 'onemoretest.file'];

    foldernames.forEach(foldername => {
      srcFS.mkdirpSync(path.join(pathname, foldername));
    });

    filenames.forEach(filename => {
      srcFS.writeFileSync(path.join(pathname, filename), 'This is test data for file ' + filename + ' !', 'utf8');
    });

    fscopy.copydircontent(pathname, srcFS, dstFS);
    expect(srcFS.readdirSync).to.have.been.called.once;
    expect(fscopy.copy).to.have.been.called.exactly(6);
  });
});