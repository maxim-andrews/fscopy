const path = require('path');

function CopyFileSystem(options) {
  this.options = options || {};
}

CopyFileSystem.prototype.copy = function(pathname, srcFS, dstFS) {
  let me = this;
  let srcStat, dstStat;

  me.debug(pathname);

  srcStat = filestat(pathname, srcFS, me.options.debug);
  dstStat = filestat(pathname, dstFS, me.options.debug);

  if (!srcStat || !srcStat.isFile() && !srcStat.isDirectory() || dstStat && !me.options.overwrite) {
    return false;
  }

  if (dstStat) {
    remove(pathname, dstStat, dstFS);
  }

  if (!srcStat.isDirectory()) {
    return dstFS.writeFileSync(pathname, srcFS.readFileSync(pathname, 'utf8'), {
      mode: srcStat.mode,
      encoding: 'utf8'
    });
  }

  dstFS.mkdirSync(pathname, srcStat.mode);

  me.copydircontent(pathname, srcFS, dstFS);
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

CopyFileSystem.prototype.remove = function(pathname, stat, fs) {
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

module.exports = exports = CopyFileSystem;
