---
title: 使用 Intersection Observer 实现懒加载
date: 2022-02-13 15:48:24
permalink: /pages/799744/
categories:
  - JavaScript
tags:
  - 
---

### 前言
最近利用空余时间研究了一下 `Intersection Observer API`，发现其有很大的应用场景，比如用作图片或者内容的懒加载、视差动画等。

一个很常见的例子就是平时在浏览头条时，当某一个视频滚动到屏幕的一定位置时（一般可以看成是屏幕中心），该视频会自动播放，当移出指定区域后视频会自动关闭并播放移入指定区域的下一个视频，如下：

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/uPic/intersection_1-8vo6Wz.gif)

通常开发者第一思路就是监听滚动位置来判断某个视频元素是否到达指定区域内，但是这种方式需要处理的条件很多，比如边界条件判断，滚动方向判断等，而且频繁触发还会出现性能问题。

经过查阅 [Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API) 的文档之后，我发现可以使用它提供的 API 很方便的监听到元素在指定根元素下的位置变化，并做一些自定义操作：

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/uPic/intersection_2-UKaEpc.png)

### 正文

接下来基于 `Intersection Observer API` 实现一下这个需求，思路大致如下

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/uPic/intersection_3-3wslN9.png)

具体思路就是把 `Intersection Observer` 的根元素的 rootMargin（即根元素的外边距）设置为如上图蓝色所示区域，当视频完全进入该区域内后（也就是`thresholds`阈值为1时），触发当前视频的播放即可。我使用的是 [Dplayer](https://github.com/DIYgod/DPlayer)，只要将其配置属性中的`mutex`属性设置为`true`(为`true`时会阻止多个播放器同时播放，当前视频播放时暂停其他视频播放)。

rootMargin 接收格式如下：`10px 0px 10px 0px`，从左到右数字依次代表`top(上)` `right(右)` `bottom(下)` `left(左)`边距，单位也可以使用百分比(%)，正值时代表扩大更元素的边距范围，负值代表缩小根元素的边距范围，这里应该缩小范围，所以 rootMargin 可以这么设置`-180px 0px -180px 0px`，这样上下的边距就会缩小。

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/uPic/intersection_5-ewFRBY.png)

有了思路之后就可以实现动图所展示的效果了

```javascript
import React, { useEffect, useState } from 'react'
import VideoItem from 'components/VideoItem'
import styles from './videoList.less'

const data = [
    // 视频列表
]

function VideoList(props) {
  useEffect(() => {
    let observerVideo = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                // 当移入指定区域后播放视频
                if(entry.intersectionRatio === 1) {
                    // 一些操作
                    return
                }
                // 停止监听
                // observer.unobserve(entry.target);
              });
            },
            {
              root: document.getElementById('scrollView'),
              rootMargin: '-180px 0px -180px 0px',
              threshold: 1
            }
        );
        document.querySelectorAll('.video-item').forEach(video => { observerVideo.observe(video) });
  }, [])
  return <div className={styles.videoWrap}>
    <div className={styles.list} id="scrollView">
        {
            data.map(item => {
                return <VideoItem src={item} groupName="video-item" key={item} />
            })
        }
    </div>
  </div>
}

export default VideoList
```

现在有个问题是已经监听到了需要自动播放的视频元素，但是如何通知 VideoItem 组件让其播放呢？我的实现思路是给 VideoItem 添加一个自定义属性，该属性的值就是当前 video 的`src`，当监听到某个视频元素需要播放时，可以获取到之前设置的自定义属性，然后作为 prop 传给 VideoItem，当 VideoItem 组件监听到该 prop 变化时，并且等于自身的`src`，此时则触发视频播放。代码如下：

```javascript
// VideoItem.js
import React, { useRef, useEffect } from 'react';
import DPlayer from 'dplayer';

export default (props) => {
    let videoRef = useRef(null)
    let dpRef = useRef(null)
    let { src, groupName, curPlaySrc } = props
    useEffect(() => {
        dpRef.current = new DPlayer({
            container: videoRef.current,
            screenshot: true,
            video: {
                url: src,
                thumbnails: 'logo.png'
            },
            logo: 'logo.png'
        });
    }, [])

    useEffect(() => {
        // 如果当前应该播放的视频 url 等于当前视频组件的 src 时，播放视频
        if(curPlaySrc === src) {
            dpRef.current.play()
        }
    }, [curPlaySrc])
    return <div data-src={src}>
             <div ref={videoRef}></div>
           </div>
}
```

此时视频列表页代码如下

```javascript
function VideoList(props) {
  const [curPlaySrc, setCurPlaySrc] = useState('')
  useEffect(() => {
    let observerVideo = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                // 移入指定区域内后，播放视频
                if(entry.intersectionRatio === 1) {
                    // 设置当前应该播放的视频 url
                    setCurPlaySrc(entry.target.dataset.src)
                    return
                }
              });
            },
            {
              root: document.getElementById('scrollView'),
              rootMargin: '-180px 0px -180px 0px',
              threshold: 1
            }
        );
        document.querySelectorAll('.video-item').forEach(video => { observerVideo.observe(video) });
  }, [])
  return <div className={styles.videoWrap}>
    <div className={styles.list} id="scrollView">
        {
            data.map(item => {
                return <VideoItem src={item} groupName="video-item" key={item} curPlaySrc={curPlaySrc} />
            })
        }
    </div>
  </div>
}
```

以上就简单地完成了基于指定区域自动播放视频的功能，效果如下：

![](https://basonwoo-blog.oss-cn-hangzhou.aliyuncs.com/uPic/intersection_4-GPH0mi.gif)