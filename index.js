const { join } = require("path");
const fs = require("fs-extra");
const glob = require("globby");
const merge = require("lodash.merge");

/**
 * 复制原生小程序，以及合并app.json
 */
class CopyWechatOriginalPlugin {
  options = {};

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const cwd = this.options.cwd || process.cwd();
    const originalPath = this.options.originalPath || "/src/__original__/";
    const dist = this.options.dist || "/dist";
    compiler.hooks.assetEmitted.tap(
      "CopyWechatOriginalPlugin",
      (file, { content }) => {
        if (/(app\.json)$/.test(file)) {
          const originalAppJson = glob.sync("app.json", {
            cwd: join(cwd, originalPath),
          })[0];

          const jsonData = fs.readJsonSync(
            join(cwd, `${originalPath}${originalAppJson}`),
          );
          fs.writeJsonSync(
            targetPath,
            merge(JSON.parse(content.toString(), 2), jsonData),
          );
        }
      },
    );

    compiler.hooks.afterDone.tap("CopyWechatOriginalPlugin", () => {
      fs.copySync(join(cwd, originalPath), dist, {
        overwrite: true,
        filter(from) {
          if (
            /(app\.json)$/.test(from) ||
            /(sitemap\.json)$/.test(from) ||
            /(package\.json)$/.test(from) ||
            /(tsconfig\.json)$/.test(from) ||
            /(package-lock\.json)$/.test(from) ||
            /node_modules/.test(from) ||
            /.project/.test(from)
          ) {
            return false;
          }
          return true;
        },
      });
    });
  }
}

module.exports = CopyWechatOriginalPlugin;
