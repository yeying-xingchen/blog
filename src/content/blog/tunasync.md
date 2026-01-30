---
title: "使用TUNASYNC搭建你的镜像站"
description: "手把手教你快速搭建一个属于自己的镜像站"
date: 2026-01-30
tags: ["hust", "mirrors", "tunasync"]
---

## 前言

镜像站为全球用户提供快速、稳定的软件下载服务。由于地理位置和网络条件限制，访问官方源通常速度较慢，特别是对于企业用户而言，搭建专属镜像站显得尤为重要。本文将采用由[清华大学 TUNA 镜像站](https://mirrors.tuna.tsinghua.edu.cn/)运维团队开发的 [TUNASYNC](https://github.com/tuna/tunasync) 工具，助你轻松搭建专属镜像站。

## 环境准备

搭建镜像站需要一台服务器，建议选择你熟悉的 Linux 环境。硬件配置需满足基本要求，特别是硬盘空间必须大于所需同步的数据总量。你可以通过[华中科技大学开源镜像站同步状态](https://mirrors.hust.edu.cn/syncing-status)查看各源占用的空间大小，并根据实际需求评估容量。

注意：必须使用 Linux 系统，本文以 OpenEuler amd64 为例演示。

## 快速上手

### 1. 安装依赖

执行以下命令下载并安装必要软件：

```bash
yum install rsync wget
wget https://github.com/tuna/tunasync/releases/download/v0.9.3/tunasync-v0.9.3-linux-amd64-bin.tar.gz # 请前往 GitHub 查看最新版本并替换链接
tar -xvzf tunasync-v0.9.3-linux-amd64-bin.tar.gz
```

### 2. 配置文件设置

创建以下两个配置文件，并根据实际情况修改参数。

**manager.toml**

```toml
debug = false

[server]
addr = "0.0.0.0"
port = 12345 # Tunasync 服务端口
ssl_cert = ""
ssl_key = ""

[files]
db_type = "bolt"
db_file = "/db/manager.db"
ca_cert = ""
```

**worker.toml**

```toml
[global]
name = "cse_mirror"
log_dir = "/log/{{.Name}}"
mirror_dir = "/data"
concurrent = 10
retry = 1
interval = 120
exec_on_failure = [ "/worker-scripts/report-error.sh" ]

[manager]
api_base = "http://manager:12345" # 管理器 API 地址，如修改端口请同步更新
token = ""
ca_cert = ""

[cgroup]
enable = false

[server]
hostname = "worker"
listen_addr = "0.0.0.0"
listen_port = 6000 # Worker 服务端口
ssl_cert = ""
ssl_key = ""

[[mirrors]]
name = "ohmyzsh.git" # 镜像名称
provider = "command" # 同步方式：rsync（rsync 同步）或 command（自定义脚本）
command = "/tunasync-scripts/git.sh" # 自定义脚本路径
upstream = "https://gitee.com/mirrors/oh-my-zsh.git" # 镜像源地址
size_pattern = "Total size is ([0-9\\.]+[KMGTP]?)" # 提取镜像大小的正则表达式
exec_on_success = [ "/worker-scripts/post-ohmyzsh.sh" ] # 同步成功后执行的脚本

[[mirrors]]
name = "elvish"
provider = "rsync"
upstream = "rsync://rsync.elv.sh/elvish/" # rsync 镜像源地址
use_ipv6 = false
```

### 3. 下载自定义脚本

下载 [tunasync-scripts](https://github.com/tuna/tunasync-scripts) 中的脚本到 `/worker-scripts` 目录。根据需要选择相应脚本，如 `git.sh`、`post-ohmyzsh.sh` 等。

### 4. 启动服务

运行以下命令启动 Tunasync 管理器：

```bash
tunasync manager --config ~/manager.toml
```

运行以下命令启动 Worker 服务：

```bash
tunasync worker --config ~/worker.toml
```

至此，您已成功搭建专属镜像站。

## 进阶操作

### 添加镜像

添加镜像需要修改`worker.toml`，添加一个`mirrors`项，有两种方法可以添加：

<details>
<summary>我需要的镜像已经被<a href="https://mirrors.hust.edu.cn/">华中科技大学开源镜像站</a>同步</summary>
    如果您需要的镜像已经被华中科技大学开源镜像站同步，您可以直接从<a href="https://github.com/hust-open-atom-club/mirrorrequest/tree/master/tunasync-config/worker.toml">这里</a>复制对应的配置项。
</details>

<details>
<summary>我需要的镜像没有被<a href="https://mirrors.hust.edu.cn/">华中科技大学开源镜像站</a>同步</summary>
    如果您需要的镜像没有被华中科技大学开源镜像站同步，您可以参考正文中的 worker.toml 的注释添加镜像。
</details>

### 删除镜像

删除镜像只需修改 `worker.toml` 文件，移除对应的 `mirrors` 配置项即可。

## 参考资料

1. [TUNASYNC 官方文档](https://github.com/tuna/tunasync/blob/master/docs/zh_CN/get_started.md)
2. [华中科技大学开放原子俱乐部 IMA 知识库](https://ima.qq.com/wiki/?shareId=9e6303ffa7585e861c7f8ba13d86693241de35be35dd7692aebfe2da567f9d8b)
