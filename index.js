module.exports = exports = function copyFileSystem(pathname, srcFS, dstFS, options) {
  options = options || {};
  
  let srcStat, dstStat, content;

  if (options.debug) {
    console.log(pathname);
  }

  try {
    srcStat = srcFS.statSync(pathname);
  } catch (e) {
    if (options.debug > 1) {
      throw e;
    }
  }

  try {
    dstStat = dstFS.statSync(pathname);
  } catch (e) {
    if (options.debug > 1) {
      throw e;
    }
  }

  if (!srcStat || !srcStat.isFile() && !srcStat.isDirectory() || dstStat && !options.overwrite) {
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

  copydircontent(pathname, srcFS, dstFS);
}

function copydircontent(pathname, srcFS, dstFS) {
  content = srcFS.readdirSync(pathname);

  if (Array.isArray(content)) {
    content.forEach(elm => {
      copyFileSystem(path.join(pathname, elm), srcFS, dstFS);
    });
  }
}

function remove(pathname, stat, fs) {
  if (stat.isDirectory()) {
    fs.rmdirSync(pathname);
  } else if (stat.isFile()) {
    fs.unlinkSync(pathname);
  }
}
