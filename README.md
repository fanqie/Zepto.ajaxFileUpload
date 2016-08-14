# Zepto.ajaxFileUpload

a file upload library for zepto

## Install

- save [raw file](https://raw.githubusercontent.com/acrazing/Zepto.ajaxFileUpload/master/Zepto.ajaxFileUpload.js) to your website directory
- add to your html

  ```html
  <script src="path/to/zepto.js"></script>
  <script src="path/to/Zepto.ajaxFileUpload.js"></script>
  ```

## Usage

- static method

  ```js
  // static
  $.ajaxFileUpload({
    fileElement: 'input[type=file]', // required, the selector for which one or more file element will be upload
    fileElementId: 'file', // deprecated, the id for which one file element will be upload
    data: $('form').serializeArray(), // optional, the extra data to upload, if none, do not pass this field
    url: '/upload', // required, the url key to handle upload action
    secure: false, // optional, no use for mobile browser, please ignore
  })
  ```
- dynamic method

  ```js
  $('form').submitWithFile({
    url: '/upload', // required, the url key to handle upload action
    fileElement: '[type=file]', // optional, if set, will use this.find(fileElement) to get file elements, 
                                // else will use this.find('input[type=file]') to get file elements
    data: void 0, // optional, if not set, will use this.serializeArray() to get extra data to submit
  })
  ```

## Example

See [example](./examle/index.html)

## LICENSE

**MIT**
