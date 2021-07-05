# copy-wechat-original-webpack-plugin

用于复制原生小程序和使用模板小程序的混合开发

## Usage

```js
new CopyWechatOriginalPlugin({
  cwd: process.cwd(),
  originalPath: "/src/__original__/", // 相对于cwd的路径
  dist: "/dist", // 相对于cwd的路径
});
```
