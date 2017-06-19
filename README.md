# Install

## 依赖工具
1. node v8.0 (stable)
2. yarn https://yarnpkg.com/
3. supervisor https://github.com/petruisfan/node-supervisor 用于开发
4. mocha https://mochajs.org/ 运行tests用

## 开发
```
cd [project]
yarn install
yarn run start  # 启动前端服务器
# 打开新的tab或窗口
supervisor -w server server/index.js  # 启动后端server

```

访问`http://localhost:3000`





