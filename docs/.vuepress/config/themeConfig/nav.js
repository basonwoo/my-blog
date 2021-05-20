// 导航栏
module.exports = [
  { text: "首页", link: "/" },
  {
    text: "Vue",
    link: "/vue/",
    items: [
      { text: "Vue 中的 DOM Diff 算法", link: "/pages/8309a5b876fc95e3/" },
      { text: "实现一个简单的图片预览组件", link: "/pages/image-preview/" },
    ],
  },
  {
    text: "JavaScript",
    link: "/javascript/",
    items: [
      {
        text: "JavaScript中的作用域链与闭包",
        link: "/pages/js-closure/",
      },
    ],
  },
  {
    text: "面试",
    link: "/interview/",
    items: [
      {
        text: "事件循环",
        link: "/pages/event-loop/",
      },
    ],
  },
  {
    text: "其他",
    link: "/other/",
    items: [
      {
        text: "Jenkins 实现基于 Github 的自动化部署",
        link: "/pages/auto-deploy/",
      },
    ],
  },
  { text: "关于", link: "/about/" },
];
