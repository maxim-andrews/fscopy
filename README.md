# fscopy [![Build Status](https://travis-ci.org/maximandrewz/fscopy.svg?branch=master)](https://travis-ci.org/maximandrewz/fscopy)
In-Memory File System Copy Utility

fscopy copies specified file or folder with all of its content from one in-memory file system to another.

## Installation
```npm install fscopy --save```

or

```npm install fscopy --save-dev```

## Usage
```
const path = require('path');
const CopyFileSystem = require('fscopy');
const MemoryFileSystem = require('memory-fs');

const fscopy = new CopyFileSystem();
var srcFS = new MemoryFileSystem();
var dstFS = new MemoryFileSystem();

const folder = path.join('/', 'folder', 'to', 'copy');
const file = path.join(folder, 'with', 'long', 'path', 'to', 'copy', 'text.file');
const anotherFile = path.join(folder, 'with', 'short', 'path', 'to', 'copy', 'text.file');

const notToCopy = path.join('/', 'this', 'file', 'will', 'not', 'be', 'copied');

const emptyDir = path.join(folder, 'with', 'another', 'dummy', 'folder');
const emptyDirNotToCopy = path.join('/', 'folder', 'which', 'should', 'not', 'copied');

srcFS.mkdirpSync(path.dirname(file));
srcFS.mkdirpSync(path.dirname(anotherFile));
srcFS.mkdirpSync(path.dirname(notToCopy));

srcFS.mkdirpSync(emptyDir);
srcFS.mkdirpSync(emptyDirNotToCopy);

srcFS.writeFileSync(file, 'file data.', 'utf8');
srcFS.writeFileSync(anotherFile, 'anotherFile file data.', 'utf8');
srcFS.writeFileSync(notToCopy, 'notToCopy file data.', 'utf8');

fscopy.copy(folder, srcFS, dstFS);


console.log('Source file system:');
fscopy.printtree('/', srcFS);

console.log('\nDestination file system:');
fscopy.printtree('/', dstFS);

/*
output:
Source file system:
/folder/to/copy/with/long/path/to/copy/text.file - file
/folder/to/copy/with/short/path/to/copy/text.file - file
/folder/to/copy/with/another/dummy/folder - folder
/folder/which/should/not/copied - folder
/this/file/will/not/be/copied - file

Destination file system:
/folder/to/copy/with/long/path/to/copy/text.file - file
/folder/to/copy/with/short/path/to/copy/text.file - file
/folder/to/copy/with/another/dummy/folder - folder
*/

```

### Constructor options

#### Syntax
```
new CopyFileSystem([options]);
```

Passing `options` to constructor is optional.

`options` is generic object and can have such properties:

Property `debug` - should be integer and can have value of `0`, `1` or `2` which will generate specific level of debug output. Default is `0`.

Property `overwrite` - should be boolean which will indicate whether overwrite files if they are exists on destination filesystem. Default is `false`.

## Versioning
According to [semver.org](http://semver.org)

## Improvements
You are welcome to submit issues and feature requests