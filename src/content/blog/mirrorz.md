---
title: "MirrorZ添加镜像站流程"
description: "最近在把华科镜像站添加到MirrorZ的时候发现几乎没有教程，所以写一个记录一下。"
date: 2026-01-29
tags: ["mirrorz", "hust", "mirrors"]
---

## 前言

最近在把华科镜像站添加到MirrorZ的时候发现几乎没有教程和指引，所以写一个记录一下。

## 正文

你需要 Fork 以下几个仓库：

[mirrorz-org/mirrorz-config](https://github.com/mirrorz-org/mirrorz-config)
[mirrorz-org/mirrorz-parser](https://github.com/mirrorz-org/mirrorz-parser)
[mirrorz-org/mirrorz-json-site](https://github.com/mirrorz-org/mirrorz-json-site)

1.在`mirrorz-json-site`仓库中添加镜像站的配置。
创建一个文件，名为`镜像站名称.json`，例如`hust.json`。
添加你的镜像站的配置，格式如下：

```json
{
    "url": "镜像站地址",
    "logo": "镜像站logo地址",
    "abbr": "镜像站简称",
    "name": "镜像站名称",
    "homepage": "镜像站首页",
    "issue": "镜像站问题反馈地址",
    "request": "添加镜像请求地址",
    "email": "反馈邮箱",
    "group": "镜像站QQ群",
    "disk": "磁盘大小"
}
```

2.在`mirrorz-parser`仓库中添加镜像站的解析脚本，如果你的镜像站是使用tunasync的，可以根据以下示范添加。

```javascript
const tunasync = require("./tunasync");

module.exports = async function (siteUrl) {
  const site = await (await fetch(siteUrl)).json();
  const mirrors = await tunasync("tunasync的地址/job");

  return {
    site,
    info: [],
    mirrors,
  }
};

```

3.在`mirrorz-config`仓库中添加镜像站的信息。

在 [mirrorz-config/config/mirrorz.org.json：upstream_parser](https://github.com/mirrorz-org/mirrorz-config) 中添加解析器， 并[启用 CORS](https://github.com/tuna/mirrorz/pull/60#issuecomment-884801035) 为 mirrorz.org 镜像站点提供数据。
在 [mirrorz-config/config/mirrorz.org.json：monitor_mirrors](https://github.com/mirrorz-org/mirrorz-config) 添加镜像站的地址。

## 参考资料

1. [MirrorZ 社区指引](https://github.com/mirrorz-org/org/wiki)
