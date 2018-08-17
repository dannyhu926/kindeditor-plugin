KindEditor/添加自定义插件

在下载的　KindEditor/lang/zh_CN.js里边自定义你插件所提示的文字
audio : '音频',
'audio.url' : 'MP3',
'audio.autostart' : '自动播放',
'audio.upload' : '上传',
'audio.viewServer' : '文件空间',

2定义按钮、页面里添加图标定义CSS。（themes\default\default.css）
.ke-icon-audio{
    background-position: 0px -1216px;
    width: 16px;
    height: 16px;
}

3./plugins/audio/audio.js

4、最后调用编辑器时,在kineditor.js中items数组里添加audio,标签防止过滤
htmlTags['audio'] = ['src','controls','autoplay'];
items['audio']