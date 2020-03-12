# supmap

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 地图的的之参数
       -20183889.354184173,
        22645826.766457584,
        3223367.6070640916
       heading: 5.662887035643514
       pitch: -1.4213836938199456
       roll: 9.769962616701378e-14
###添加代理
# git clone http://...
git config --global http.proxy 'socks5://127.0.0.1:10809'
# git clone https://...
git config --global https.proxy 'socks5://127.0.0.1:10809'
# git clone git://...
git config --global core.gitproxy 'socks5://127.0.0.1:10809'
###取消
git config --global --unset http.proxy

git config --global --unset https.proxy

1 测距 侧面 
2 态势分析 箭头绘制  
3 资源部署  (不需要详情) 
4 多种资源显示隐藏 (点击详情) 
5 流程 
