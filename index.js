module.exports = exports = function copyFileSystem(pathname, srcFS, dstFS) {
  let srcStat, dstStat, content;

  console.log(pathname);

  try {
    srcStat = srcFS.statSync(pathname);
  } catch (e) {}

  try {
    dstStat = dstFS.statSync(pathname);
  } catch (e) {}

  if (srcStat && srcStat.isFile() && !dstStat) {
    if (!srcStat.isDirectory()) {
      dstFS.writeFileSync(pathname, srcFS.readFileSync(pathname, 'utf8'), {
        mode: srcStat.mode,
        encoding: 'utf8'
      });
    } else {
      dstFS.mkdirSync(pathname, srcStat.mode);

      content = srcFS.readdirSync(pathname);

      if (Array.isArray(content)) {
        content.forEach(elm => {
          copyFileSystem(path.join(pathname, elm), srcFS, dstFS);
        });
      }
    }
  }
}
