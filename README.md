# Music-player
> 响应式音乐播放页面（一个学习jq的练习项目）；

[预览demo](https://toxicfy.github.io/Music-player/index.html)
（使用的是网上公开的资源接口，非https请求，不稳定，将浏览器默认拦截的请求加载刷新即可）

**预览图**：

![](https://github.com/Toxicfy/Music-player/blob/master/images/preview.png?raw=true)

#### 用到的技术：

- 使用`bootstrap`实现快速布局，`jquery`实现基本的交互功能；
- 使用`ajax`请求数据，播放器主体由H5的`audio`实现；
- 动画效果基于 `Animate.css` ;


#### 实现点：

- **数据的获取** : 通过`ajax`请求音乐信息文件，然后通过对返回的`json`文件切割，排序得到需要的的音乐url，专辑信息和歌词；

	
- **进度条**：
	- **显示**：是设定了进度条的长度，然后通过`currentTime`/`duration`得到百分比,然后长度由百分比确定
	- **拖动**：clientX和offset().left的差值除以长度得到进度条的百分比，然后歌曲总长度和百分比的积设置当前播放时间
- **歌词的同步**
	实际上一直在改变的就是歌曲的播放时间，在歌词列表设定了高度的情况下`（overflow：hidden）`，然后判断给对应的歌词添加样式，并同时设置top值，可以达到歌词的同步； 


