(function ($) {
    function createUploadIframe(id, uri) {
        id = id || +new Date;
        id = 'jUploadFrame-' + id;
        return $('<iframe>', {
            id: id,
            name: id,
            style: 'position: absolute; top: -9999px; left: -9999px',
            src: window.ActiveXObject ? (typeof  uri === 'boolean' ? 'javascript:false' : (typeof uri === 'string' ? uri : '')) : ''
        }).appendTo(document.body)
    }

    function createUploadForm(id, fileSelector, data) {
        id = 'jUploadFormId-' + id;
        var fileId = 'jUploadFile' + id,
            $file = $(fileSelector),
            $form = $('<form>', {
                action: '',
                method: 'post',
                name: id,
                id: id,
                enctype: 'multipart/form-data',
                style: 'position: absolute; top: -9999px; left: -9999px'
            });
        $.isArray(data) && data.forEach(function (item) {
            $form.append($('<input>', {
                type: 'hidden',
                name: item.name,
                value: item.value
            }))
        });
        return $form.append($file.before($file.clone())).appendTo(document.body);
    }

    function uploadData(r, type) {
        var data = type === 'xml' || !type ? r.responseXML : r.responseText;
        type === 'json' && (data = JSON.parse(data));
        return data;
    }

    $.ajaxFileUpload = function (s) {
        s = $.extend({}, $.ajaxSettings, s);
        var id = +new Date,
            d = $.Deferred(),
            $form = createUploadForm(id, s.fileElement || ('#' + s.fileElementId), s.data),
            $io = createUploadIframe(id, s.secureuri),
            io = $io.get(0),
            frameId = 'jUploadFrame' + id,
            xml = {},
            status,
            requestDone = false;
        var uploadCallback = function (isTimeout) {
            if (io.contentWindow) {
                xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
            } else if (io.contentDocument) {
                xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
            }
            if (xml || isTimeout) {
                requestDone = true;
                status = isTimeout === true ? 'error' : 'success';
                if (status === 'success') {
                    var data = uploadData(xml, s.dataType);
                    if (s.success)
                        s.success(data, status);
                    if (s.complete)
                        s.complete(xml, status);
                    setTimeout(function () {
                        $io.remove();
                        $form.remove();
                    }, 100);
                    xml = null
                }
            }
        };
        if (s.timeout > 0) {
            setTimeout(function () {
                requestDone || uploadCallback(true);
            }, s.timeout);
        }
        $form.attr({
            action: s.url,
            target: frameId
        }).submit();
        $io.on('load', function() {uploadCallback()});
    };
    
    $.fn.submitWithFile = function(settings) {
        $.ajaxFileUpload($.extend(settings, {
            fileElement: settings.fileElement ? $(settings.fileElement) : (settings.fileElementId ? $('#' + settings.fileElementId) : this.find('input[type=file]')),
            data: this.serializeArray(),
        }))
    }
})(Zepto);
