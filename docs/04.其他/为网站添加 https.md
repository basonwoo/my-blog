---
title: 为网站添加 https
date: 2021-05-27 11:18:10
permalink: /pages/a7a643/
categories:
  - 其他
tags:
  - 
---

设定 https 首先需要一个「第三方安全凭证」，然后将该凭证放到网站的服务器里，然后进行一些配置。

### CloudFlare

CloudFlare 是一个免费的线上托管服务，首先注册会员，然后到 dashboard 添加自己的域名。
要想 CloudFlare 托管自己的网站，需要在域名后台将 dns 改为 CloudFlare 的 dns 服务器


![cloudflare](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2021-05-27_11-27-25.jpg)

![修改dns](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2021-05-27_14-08-08.jpg)

等待生效

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2021-05-27_14-10-25.jpg)

生成证书

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2021-05-27_14-03-59.jpg)

在 nginx 目录下新建 cert 文件夹，将 .pem 和 .key 后缀的文件上传到该文件夹

进入 nginx 解压目录，添加 ssl 支持

```bash
cd /usr/local/nginx/nginx-1.18.0
# 启用 ssl
./configure --with-http_ssl_module
# 重新编译
make
# 拷贝编译后的目录
copy objs/nginx /usr/local/nginx/sbin/nginx
```

修改 nginx.conf 文件
```conf
server {
  ...
  listen 80;
  listen 443 ssl;
  ...

  ssl_certificate     /usr/local/nginx/cert/xxx.pem;
  ssl_certificate_key /usr/local/nginx/cert/xxx.key
}
```

搞定

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/img/Snipaste_2021-05-27_14-24-41.jpg)