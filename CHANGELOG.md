
Changelog
=========

### 0.5.0
 - Add support for the `th:each`/`data-th-each` attribute processor.

### 0.4.0
 - Add support for the `th:attr`/`data-th-attr` attribute processor.

### 0.3.0
 - Add support for the `th:utext`/`data-th-utext` attribute processor
 - Fixed `th:text` not escaping unsafe HTML content.

### 0.2.0
 - Extract the Express integration into its own module,
   [express-thymeleaf](https://github.com/ultraq/express-thymeleaf)
 - Added support for the `th:if`/`data-th-if` attribute processor

### 0.1.0
 - Initial release, has a `th:text`/`data-th-text` attribute processor that
   handles only expressions that name an item in the current context, eg:
   `${greeting}` where `context = { greeting: 'Hello!' }`
