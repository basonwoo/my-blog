---
title: Jenkins 实现基于 Github 的自动化部署
date: 2021-02-04 13:30:00
permalink: /pages/auto-deploy
categories: 
  - 部署
tags: 
  - Jenkins
author: 
  name: basonwoo
---

本文记录博客部署过程

> 服务器配置：
>
> 操作系统： CentOS 8.2 64 位
>
> CPU： 2 核
>
>  内存： 4 GB
>
>  公网带宽： 2 Mbps

### 安装 Java SDK
```bash
# 检索有没有 java 1.8的包
yum list java-1.8*

# 开始安装
yum install java-1.8.0-openjdk* -y

# 查看版本
java -version
```

### 安装nginx
```bash
wget http://nginx.org/download/nginx-1.18.0.tar.gz

tar -zxvf nginx-1.18.0.tar.gz

cd nginx-1.18.0

# 安装nginx必要环境
yum -y install gcc pcre-devel zlib-devel openssl openssl-devel

# 配置
./configure --prefix=/usr/local/nginx

# make
make && make install
```

安装完成之后一些操作
```bash
# 启动nginx
nginx -c nginx.conf

# 重启nginx
nginx -s reload

# 基于nginx的静态部署
server {
  listen 80;
  server_name 域名;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    root /www/myBlog;
    index index.html;
    try_files $uri $uri/ /index.html;
  }

  error_page 404 /404.html;
}
```

之后启动 nginx，访问服务器 ip 地址，如图即安装成功
![安装成功](/img/nginx_installed.png)

### 安装 Jenkins，使用清华源
```bash
wget https://mirrors.tuna.tsinghua.edu.cn/jenkins/redhat/jenkins-2.263-1.1.noarch.rpm

yum -y localinstall jenkins-2.263-1.1.noarch.rpm
```
### 启动并配置 Jenkins
进入配置文件将用户修改为 root
```bash
vim /etc/sysconfig/jenkins

···
JENKINS USER = "root"
···
```
启动 Jenkins
```bash
systemct1 start jenkins
```

浏览器输入 http://ip:8080 进入解锁 Jenkins 界面即成功

### 查看密码
```bash
cat /var/lib/jenkins/secrets/initialAdminPassword
```
将密码粘贴到输入框

之后一路进入 Jenkins 管理界面

### Github 生成 Personal Access Token

https://github.com/settings/tokens --> Personal access tokens

### Github 设置 webhooks

设置 Jenkins 的 github
jenkins 创建新任务，选择构建一个自由风格的软件项目

系统管理 -> 系统配置，找到 Github 选项 -> 添加 Github 服务器 --> GithubServer
勾选“管理Hook”，添加 --> Jenkins

在弹出的窗口输入之前生成的令牌

### 进入该项目的配置

1. 选择 Github 项目，填入URL，在源码管理下选择 git，输入 git clone 地址

2. 接着选择 Credentials，填入对应内容

3. 构建触发器，点击新增并选择 secret text 选项，在新出现的选项中选择添加的权限用户

### 构建配置，添加 shell 命令

```bash
rm -rf ./docs/.vuepress/dist/*
rm -rf /www/myBlog/*
npm install
npm run build
cp -rf ./docs/.vuepress/dist/* /www/myBlog
```
### 提交一个改动到 master 分支，Jenkins 就会自动构建并新增一条构建记录了
