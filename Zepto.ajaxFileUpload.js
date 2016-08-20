(function ($) {

    function flatten(data) {
        if ($.isArray(data)) return data;
        var out = [];
        $.param(data).split('&').forEach(function (item) {
            var itemArr = item.split('=');
            out.push({
                name: itemArr[0],
                value: itemArr[1]
            });
        });
        return out;
    }

    /**
     * upload with XMLHttpRequest
     * @dependencies FormData, file
     * @param {AjaxSettings} settings
     * @param {FileObject[]|HTMLInputElement[]|Map} settings.files
     * @param {string} settings.files.name
     * @param {File} settings.files.value
     * @param {string} settings.files.fileName
     */
    function ajaxUpload(settings) {
        settings = $.extend({ files: [], data: [] }, settings)
        var data = new FormData;
        var files = [];
        if ($.isArray(settings.files)) {
            files = settings.files;
        } else {
            $.each(files, function (value, key) {
                files.push({
                    name: key,
                    value: value
                });
            });
        }
        files.forEach(function (file) {
            file = file.files || file;
            var name = file.fileName;
            if ($.isArray(file)) {
                file.forEach(function (file) {
                    data.append(file.name + '[]', file, name);
                });
            } else {
                data.append(file.name, file.value, file.fileName);
            }
        });
        flatten(settings.data).forEach(function (item) {
            data.append(item.name, item.value);
        });
        delete settings.data;
        delete settings.files;
        settings.processData = false;
        return $.ajax(settings);
    }

    function uid() {
        return 'Zepto.ajaxFileUpload-' + +new Date + Math.random();
    }

    /**
     * upload with iframe submit
     * @param {AjaxSettings} settings
     * @param {HTMLInputElement[]} settings.files
     * @param {string|boolean} settings.secureuri
     */
    function iframeUpload(settings) {
        settings = $.extend({ files: [], data: [] }, settings);
        var id = uid();
        var $iframe = $('<iframe>').attr({
            id: id,
            name: id,
            src: window.ActiveXObject
                ? typeof uri === 'boolean'
                    ? 'javascript:false'
                    : (typeof uri === 'string' ? uri : '')
                : '',
            style: 'display: none'
        }).appendTo('body');
        var iframe = $iframe.get(0);
        var $form = $('<form>').attr({
            action: settings.url || '',
            method: settings.type || 'POST',
            target: id,
            enctype: 'multipart/form-data',
            style: 'display: none'
        }).appendTo('body');
        var files = $.isArray(settings.files) ? settings.files : [settings.files];
        files.forEach(function (item) {
            $form.append($(item).before($(item).clone()));
        });
        flatten(settings.data).forEach(function (item) {
            $form.append($('<input>').attr({
                type: 'text',
                name: item.name,
                value: item.value
            }));
        });
        var status = 0; // 0: fetching, 1: success, 2: timeout
        var deferred = $.Deferred && $.Deferred();
        function callback() {
            var errorType;
            var error;
            if (status === 0) {
                return;
            }
            if (status === 2) {
                errorType = 'timeout';
                error = new Error(errorType);
            }
            if (status === 1) {
                var content = iframe.contentWindow || iframe.contentDocument;
                var response = settings.dataType === 'xml'
                    ? content.document.XMLDocument || content.document
                    : (content.document.body && content.document.body.innerHTML);
                if (settings.dataType === 'json') {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        errorType = 'parse';
                        error = e;
                    }
                }
            }
            settings.error && error && settings.error(void 0, errorType, error);
            settings.success && !error && settings.success(response, status, void 0);
            if (deferred) {
                error
                    ? deferred.rejectWith(null, [void 0, errorType, error])
                    : deferred.resolveWith(null, [response, status, void 0]);
            }
            setTimeout(function () {
                $iframe.remove();
                $form.remove();
                delete $iframe;
                delete $form;
            }, 100);
        }
        var timer = settings.timeout > 0 && setTimeout(function () {
            if (status === 0) {
                status = 2;
                callback();
            }
        }, settings.timeout);
        $iframe.on('load', function () {
            if (status === 0) {
                status = 1;
                timer && clearTimeout(timer);
                callback();
            }
        });
        $form.submit();
        return deferred;
    }
    var support = typeof FormData === 'function' && typeof File === 'function';

    $.ajaxFileUpload = support ? ajaxUpload : iframeUpload;
    $.ajaxFileUpload.support = support;

    $.fn.submitWithFile = function (settings) {
        $.ajaxFileUpload($.extend({
            files: this.find(settings.fileElement || 'input[type=file]'),
            data: settings.data || this.serializeArray(),
        }, settings));
    };
})(window.Zepto || window.jQuery);