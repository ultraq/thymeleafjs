
Changelog
=========

### 0.8.1
 - Fix double-escaping of `thjs:text`/`data-thjs-text` and single-escaping of
   `thjs:utext`/`data-thjs-utext` processors

### 0.8.0
 - Rework bundles so that they can target browser and node environments
   separately
   ([#12](https://github.com/ultraq/thymeleaf-js/issues/12))
 - Other small changes to work on browsers more effectively

### 0.7.1
 - Fix the `main` entry to point to the new CommonJS bundle.

### 0.7.0
 - Add initial support for link expression syntax
   ([#9](https://github.com/ultraq/thymeleaf-js/issues/9))

### 0.6.0
 - Use `thjs` as the default prefix for the standard dialect.
 - Export `Dialect` and `AttributeProcessor`, and `StandardDialect` classes.
 - Add support for object navigation in expressions.

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
