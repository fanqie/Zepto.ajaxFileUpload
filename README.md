# Zepto.ajaxFileUpload
a file upload library for zepto

## How to use
`Zepto.ajaxFileUpload(setttings);`

the settings is the parameters for upload, except for the default settings from Zepto, the follow elements is required

`String fileElementId`: the id of the input element which will be upload

`Array data`: the data will be upload, the array's element is Object, key => value to be upload

## Explain

A better way to use `XMLHttpRequest` to upload file or submit form use `Blob` or `FormData`: <https://github.com/acrazing/ajaxUploadForm>
