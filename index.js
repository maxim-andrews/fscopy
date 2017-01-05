const path = require('path');

function CopyFileSystem(options) {
  let me = this;

  me.options = options || {};
  me.options.debug = me.options.debug || 0;
  me.options.overwrite = me.options.overwrite || false;
}

CopyFileSystem.prototype.copy = function(pathname, srcFS, dstFS) {
  let me = this;
  let srcStat, dstStat;

  me.debug(pathname);

  srcStat = me.filestat(pathname, srcFS, me.options.debug);
  dstStat = me.filestat(pathname, dstFS, me.options.debug);

  if (!srcStat) {
    return false;
  }

  if (!srcStat.isFile() && !srcStat.isDirectory()) {
    return false;
  }

  if (srcStat.isFile() && dstStat && !me.options.overwrite) {
    return false;
  }

  if (dstStat && dstStat.isFile()) {
    me.remove(pathname, dstFS, dstStat);
  }

  if (!srcStat.isDirectory()) {
    me.makefilefolder(pathname, dstFS);

    return dstFS.writeFileSync(pathname, srcFS.readFileSync(pathname, 'utf8'), {
      mode: srcStat.mode,
      encoding: 'utf8'
    });
  }

  if (!dstStat) {
    dstFS.mkdirpSync(pathname, srcStat.mode);
  }

  me.copydircontent(pathname, srcFS, dstFS);
}

CopyFileSystem.prototype.makefilefolder = function(pathname, fs) {
  let folder = path.dirname(pathname);
  let parentfolder = path.dirname(folder);
  
  if (folder != parentfolder) {
    fs.mkdirpSync(folder);
  }
}

CopyFileSystem.prototype.debug = function(string) {
  let me = this;

  if (me.options.debug) {
    console.log(string);
  }
}

CopyFileSystem.prototype.copydircontent = function(pathname, srcFS, dstFS) {
  let me = this;
  let content = srcFS.readdirSync(pathname);

  if (Array.isArray(content)) {
    content.forEach(elm => {
      me.copy(path.join(pathname, elm), srcFS, dstFS);
    });
  }
}

CopyFileSystem.prototype.remove = function(pathname, fs, stat) {
  if (!stat) {
    stat = this.filestat(pathname, fs);
  }

  if (stat.isDirectory()) {
    fs.rmdirSync(pathname);
  } else if (stat.isFile()) {
    fs.unlinkSync(pathname);
  }
}

CopyFileSystem.prototype.filestat = function(pathname, fs) {
  let stats;

  try {
    stats = fs.statSync(pathname);
  } catch (e) {
    if (this.options.debug > 1) {
      throw e;
    }
  }

  return stats;
}

CopyFileSystem.prototype.printtree = function(pathname, fs) {
  let me = this;
  let content;
  let fileCount = 0;

  const stat = me.filestat(pathname, fs);

  if (!stat && me.options.debug) {
    console.log('File', pathname, 'not found.');
  }

  if (stat.isDirectory()) {
    content = fs.readdirSync(pathname);

    content.forEach(item => {
      fileCount++;
      me.printtree(path.join(pathname, item), fs);
    });
  }

  if (stat.isFile() || fileCount === 0) {
    console.log(pathname, stat.isFile() ? '- file': '- folder');
  }
}

module.exports = exports = CopyFileSystem;
