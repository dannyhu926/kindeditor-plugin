//ckplayer插件
KindEditor.plugin('media', function(K) {
    var self = this, name = 'media', lang = self.lang(name + '.'),
        allowMediaUpload = K.undef(self.allowMediaUpload, true),
        allowFileManager = K.undef(self.allowFileManager, false),
        formatUploadUrl = K.undef(self.formatUploadUrl, true),
        extraParams = K.undef(self.extraFileUploadParams, {size: 20}), //文件大小限制 20M
        filePostName = K.undef(self.filePostName, 'imgFile'),
        uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php');
    self.plugin.media = {
        edit: function () {
            var html = [
                '<div style="padding:20px;">',
                //url
                '<div class="ke-dialog-row">',
                '<label for="keUrl" style="width:60px;">' + lang.url + '</label>',
                '<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:160px;" /> &nbsp;',
                '<input type="button" class="ke-upload-button" value="' + lang.upload + '" /> &nbsp;',
                '<span class="ke-button-common ke-button-outer">',
                '<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
                '</span>',
                '</div>',
                //width
                '<div class="ke-dialog-row">',
                '<label for="keWidth" style="width:60px;">' + lang.width + '</label>',
                '<input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="330" maxlength="4" /> ',
                '</div>',
                //height
                '<div class="ke-dialog-row">',
                '<label for="keHeight" style="width:60px;">' + lang.height + '</label>',
                '<input type="text" id="keHeight" class="ke-input-text ke-input-number" name="height" value="300" maxlength="4" /> ',
                '</div>',
                //autostart
                '<div class="ke-dialog-row">',
                '<label for="keAutostart">' + lang.autostart + '</label>',
                '<input type="checkbox" id="keAutostart" name="autostart" value="1" /> ',
                '</div>',
                '</div>'
            ].join('');

            var dialog = self.createDialog({
                    name: name,
                    width: 450,
                    title: self.lang(name),
                    body: html,
                    yesBtn: {
                        name: self.lang('yes'),
                        click: function (e) {
                            var url = K.trim(urlBox.val()),
                                width = widthBox.val(),
                                height = heightBox.val();
                            if (url == 'http://' || K.invalidUrl(url)) {
                                alert(self.lang('invalidUrl'));
                                urlBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(width)) {
                                alert(self.lang('invalidWidth'));
                                widthBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(height)) {
                                alert(self.lang('invalidHeight'));
                                heightBox[0].focus();
                                return;
                            }
                            var autostart = autostartBox[0].checked ? 1: 0;
                            var id_uuid = Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
                            var html = '<div id="a' + id_uuid + '" style="width: ' + width + 'px;height: ' + height + 'px;"><embed name="ke-media" src="/statics/js/ckplayer/ckplayer.swf"></embed></div>' +
                                '<script type="text/javascript">\r\n' +
                                'var flashvars={p:' + autostart + '};\r\n' +
                                'var video=["' + url + '->video/mp4"];\r\n' +
                                'CKobject.embed("/statics/js/ckplayer/ckplayer.swf", "a' + id_uuid + '", "ckplayer_a' + id_uuid + '", "100%", "100%", false, flashvars, video);\r\n' +
                                '</script>';
                            self.insertHtml(html).hideDialog().focus();
                        }
                    }
                }),
                div = dialog.div,
                urlBox = K('[name="url"]', div),
                viewServerBtn = K('[name="viewServer"]', div),
                widthBox = K('[name="width"]', div),
                heightBox = K('[name="height"]', div),
                autostartBox = K('[name="autostart"]', div);
            urlBox.val('http://');

            if (allowMediaUpload) {
                var uploadbutton = K.uploadbutton({
                    button: K('.ke-upload-button', div)[0],
                    fieldName: filePostName,
                    extraParams: extraParams,
                    url: K.addParam(uploadJson, 'dir=media'),
                    afterUpload: function (data) {
                        dialog.hideLoading();
                        if (data.error === 0) {
                            var url = data.url;
                            if (formatUploadUrl) {
                                url = K.formatUrl(url, 'absolute');
                            }
                            urlBox.val(url);
                            if (self.afterUpload) {
                                self.afterUpload.call(self, url, data, name);
                            }
                            alert(self.lang('uploadSuccess'));
                        } else {
                            alert(data.message);
                        }
                    },
                    afterError: function (html) {
                        dialog.hideLoading();
                        self.errorDialog(html);
                    }
                });
                uploadbutton.fileBox.change(function (e) {
                    dialog.showLoading(self.lang('uploadLoading'));
                    uploadbutton.submit();
                });
            } else {
                K('.ke-upload-button', div).hide();
            }

            if (allowFileManager) {
                viewServerBtn.click(function (e) {
                    self.loadPlugin('filemanager', function () {
                        self.plugin.filemanagerDialog({
                            viewType: 'LIST',
                            dirName: 'media',
                            clickFn: function (url, title) {
                                if (self.dialogs.length > 1) {
                                    K('[name="url"]', div).val(url);
                                    if (self.afterSelectFile) {
                                        self.afterSelectFile.call(self, url);
                                    }
                                    self.hideDialog();
                                }
                            }
                        });
                    });
                });
            } else {
                viewServerBtn.hide();
            }

            var img = self.plugin.getSelectedMedia();
            if (img) {
                var attrs = K.mediaAttrs(img.attr('data-ke-tag'));
                urlBox.val(attrs.url);
                widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
                heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
                autostartBox[0].checked = (attrs.autostart === 'true');
            }
            urlBox[0].focus();
            urlBox[0].select();
        },
        'delete': function () {
            self.plugin.getSelectedMedia().remove();
            // [IE] 删除图片后立即点击图片按钮出错
            self.addBookmark();
        }
    };
    self.clickToolbar(name, self.plugin.media.edit);
});