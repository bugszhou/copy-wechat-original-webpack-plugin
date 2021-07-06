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
      (file, { content, targetPath }) => {
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
      const optionIgnoreFiles = this.options.ignoreFiles || [];
      let ignoreFiles = [];
      if (Array.isArray(optionIgnoreFiles)) {
        ignoreFiles = [...optionIgnoreFiles];
      } else {
        ignoreFiles = [optionIgnoreFiles];
      }

      ignoreFiles.push([
        /(app\.json)$/,
        /(sitemap\.json)$/,
        /(package\.json)$/,
        /(tsconfig\.json)$/,
        /(package-lock\.json)$/,
        /node_modules/,
        /.project/,
      ]);

      fs.copySync(join(cwd, originalPath), dist, {
        overwrite: true,
        filter(from) {
          const isIgnore = ignoreFiles.some((item) => item.test(from));
          if (isIgnore) {
            return false;
          }
          return true;
        },
      });
    });
  }
}

module.exports = CopyWechatOriginalPlugin;
