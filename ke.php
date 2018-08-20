<?php
function ke_content($content, $suffix = "/statics/images/product_2.jpg") {
    //使用CKplayer自动调用ckplayer.js
    $use_ckplayer_plugin = false;
    if (strpos($content, '<embed name="ke-media" src="/statics/js/ckplayer/ckplayer.swf"></embed>') !== false) {
        $use_ckplayer_plugin = true;
    }

    //todo 图片地址替换成压缩URL,图片使用延迟加载功能
    $pregRule = "/<[img|IMG].*?src=[\'|\"](.*?(?:[\.jpg|\.jpeg|\.png|\.gif|\.bmp]))[\'|\"].*?[\/]?>/";
    $content = preg_replace($pregRule, '<img class="lazy" src="' . $suffix . '" data-original="${1}">', $content, -1, $lazyload);
    if ($lazyload > 0) {
        $content .= '<script type="text/javascript" src="/statics/front/script/jquery.lazyload.js"></script><script type="text/javascript">$("img.lazy").lazyload({effect: "fadeIn"});</script>';
    }
    if ($use_ckplayer_plugin) {
        $content .= '<script type="text/javascript" src="/statics/js/ckplayer/ckplayer.js"></script>';
    }

    return $content;
}
?>