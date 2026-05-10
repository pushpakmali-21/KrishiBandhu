/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

function normalizeReadlinkError(error, targetPath) {
  if (!error || error.code !== 'EISDIR') {
    return error;
  }

  try {
    const stats = fs.lstatSync(targetPath);
    if (stats.isSymbolicLink()) {
      return error;
    }
  } catch {
    return error;
  }

  error.code = 'EINVAL';
  error.message = error.message.replace('EISDIR', 'EINVAL');
  return error;
}

const readlinkSync = fs.readlinkSync;
fs.readlinkSync = function patchedReadlinkSync(targetPath, options) {
  try {
    return readlinkSync.call(fs, targetPath, options);
  } catch (error) {
    throw normalizeReadlinkError(error, targetPath);
  }
};

const readlink = fs.readlink;
fs.readlink = function patchedReadlink(targetPath, options, callback) {
  const cb = typeof options === 'function' ? options : callback;
  const opts = typeof options === 'function' ? undefined : options;

  return readlink.call(fs, targetPath, opts, (error, linkString) => {
    cb(normalizeReadlinkError(error, targetPath), linkString);
  });
};

if (fs.promises && fs.promises.readlink) {
  const readlinkPromise = fs.promises.readlink;
  fs.promises.readlink = async function patchedReadlinkPromise(targetPath, options) {
    try {
      return await readlinkPromise.call(fs.promises, targetPath, options);
    } catch (error) {
      throw normalizeReadlinkError(error, targetPath);
    }
  };
}
