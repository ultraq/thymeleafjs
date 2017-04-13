
Changelog
=========

### 0.1.0

 - Initial release, has a `th:text`/`data-th-text` attribute processor that
   handles only expressions that name an item in the current context, eg:
   `${greeting}` where `context = { greeting: 'Hello!' }`
