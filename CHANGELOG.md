
Changelog
=========

### 0.13.0
 - Add support for string concatenation (string literals or expressions that
   return strings and any combination of the 2)

### 0.12.1
 - Add support for parsing the iteration status variable (though nothing is done
   with it) to round out support for the iteration expression
 - Added testing against Node 10 on TravisCI

### 0.12.0
 - The template resolver is now a dev-specified function, meaning no more
   special hacks required to get template insertion working!

### 0.11.1
 - Restoring `href`/`src`/`value` processors lost in the last update

### 0.11.0
 - Whitespace no longer significant in parsing most expression types
 - Parsing errors are output to the log in built mode and no longer thrown so
   that they don't bring down the whole thread

### 0.10.0
 - Add a `th:value`/`data-th-value` processor
 - Add support for if-then expressions (`(condition) ? (true branch)`)
 - Add support for a literals (text, number, boolean, and tokens)
 - Add a `th:checked`/`data-th-checked` processor

### 0.9.0
 - Fix `th:attr`/`data-th-attr` where re-using the regex in the processor would
   cause subsequent uses to fail.
 - First attempt at support for the fragment syntax and `th:insert`/`data-th-insert`
   to include other templates/fragments (still a hack that's documented in the
   README).
 - Include Node 8 in CI builds/tests as it's now entered LTS.
 - Testing frameworks simplified: mocha + chai + nyc + jsdom -> jest

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
