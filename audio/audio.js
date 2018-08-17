/**
 * 自定义音频插件：kineditor.js加入
 *   htmlTags['audio'] = ['src','controls','autoplay'];
 *   items['audio']
 */
KindEditor.plugin('audio', function (K) {
    var self = this, name = 'audio', lang = self.lang(name + '.'),
        allowAudioUpload = K.undef(self.allowAudioUpload, true),
        allowFileManager = K.undef(self.allowFileManager, false),
        formatUploadUrl = K.undef(self.formatUploadUrl, true),
        extraParams = K.undef(self.extraFileUploadParams, {size: 10}), //文件大小限制 10M
        filePostName = K.undef(self.filePostName, 'imgFile'),
        uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php');
    self.plugin.audio = {
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
                            var url = K.trim(urlBox.val());
                            if (url == 'http://' || K.invalidUrl(url)) {
                                alert(self.lang('invalidUrl'));
                                urlBox[0].focus();
                                return;
                            }
                            var autoplay = autostartBox[0].checked ? true: false;
                            var html = '<p><audio src="' + url + '" autoplay="' + autoplay + '" controls="controls"></audio><br/></p>';
                            self.insertHtml(html).hideDialog().focus();
                        }
                    }
                }),
                div = dialog.div,
                urlBox = K('[name="url"]', div),
                viewServerBtn = K('[name="viewServer"]', div),
                autostartBox = K('[name="autostart"]', div);
            urlBox.val('http://');

            if (allowAudioUpload) {
                var uploadbutton = K.uploadbutton({
                    button: K('.ke-upload-button', div)[0],
                    fieldName: filePostName,
                    extraParams: extraParams,
                    url: K.addParam(uploadJson, 'dir=audio'),
                    afterUpload: function (data) {
                        dialog.hideLoading();
                        if (data.error === 0) {
                            var url = data.url;
                            if (formatUploadUrl) {
                                url = K.formatUrl(url, 'absolute');
                            }
                            urlBox.val(url);
                            if (self.afterUpload) {
                                self.afterUpload.call(self, url);
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
                            dirName: 'audio',
                            clickFn: function (url, title) {
                                if (self.dialogs.length > 1) {
                                    K('[name="url"]', div).val(url);
                                    self.hideDialog();
                                }
                            }
                        });
                    });
                });
            } else {
                viewServerBtn.hide();
            }
        }
    };
    self.clickToolbar(name, self.plugin.audio.edit);
});