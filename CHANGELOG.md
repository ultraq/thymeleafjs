
Changelog
=========

### 0.20.5
 - Add support for array access by index: `array[i]`
   ([#44](https://github.com/ultraq/thymeleafjs/pull/44))

### 0.20.4
 - Add support for literal substitions: `|...|`
   ([#43](https://github.com/ultraq/thymeleafjs/pull/43))

### 0.20.3
 - Emit complex objects in `thjs:attr` using `JSON.stringify`
   ([#41](https://github.com/ultraq/thymeleafjs/issues/41))

### 0.20.2
 - Add support for logical operators: `&&`/`and`, `||`/`or`
 - Add support for equality operator keywords: `eq`, `ne`

### 0.20.1
 - Fix `Node is not defined` errors when using Thymeleaf in a NodeJS environment,
   ([#38](https://github.com/ultraq/thymeleafjs/issues/38))

### 0.20.0
 - Added `XmlNsAttributeProcessor` to remove Thymeleaf's XML namespaces in HTML
   files.
 - Remove the standard variant of an attribute processor when the isomorphic one
   is processed.
 - Isomorphic mode now configured at the dialect level
 - Lots of statics moved to named exports for better tree-shaking / smaller
   imports.

### 0.19.0
 - Changes to template rendering, brought about by:
    - No longer render using the `XMLSerializer`.  This should remove
      unnecessary XML namespaces appearing in template fragments or re-rendered
      templates.
    - Update JSDOM dependency from 9.x to 16.x.

### 0.18.1
 - Allow variable expressions in 'template name' part of the fragment expression
   ([#35](https://github.com/ultraq/thymeleafjs/pull/35))

### 0.18.0
 - Added support for message expressions `#{...}` and a `messageResolver`
   configuration function.
 - Fix TypeError when calling native JS methods within expression language
   blocks

### 0.17.2
 - Adding `th:alt` as a removable attribute
 - Allow escaped single quotes in strings
   ([#23](https://github.com/ultraq/thymeleafjs/issues/23))

### 0.17.1
 - Expressions can now do negation using the `!` operator

### 0.17.0
 - Dialects can now add expression objects to the processing context

### 0.16.1
 - Fix chained expressions when using built-in javascript properties

### 0.16.0
 - Added support for the `all-but-first` value of the `thjs:remove` processor.
 - Added support for `thjs:datetime` -> `datetime` HTML attribute
 - Small performance tweaks to address 'over re-processing' of templates.

### 0.15.1
 - Fix for the `th:if` processor not causing the element to be reprocessed once
   removed

### 0.15.0
 - Added a `thjs:unless/data-thjs-unless` processor
   ([#25](https://github.com/ultraq/thymeleafjs/pull/25))
 - Added a `thjs:with/data-thjs-with` processor
 - Added support for parameters passed in fragment expressions
 - Added support for element processors and Thymeleaf's `th:block` element
   processor

### 0.14.0
 - Method calls (`#...` in variable expressions) supported, though they don't
   really do anything as their are no expression objects in the Thymeleaf
   context just yet
 - Updated minimum supported Node version to 8
 - Added a `thjs:replace/data-thjs-replace` processor
   ([#24](https://github.com/ultraq/thymeleafjs/issues/24))

### 0.13.1
 - Template names in fragment expressions can have `/` in their name (as they
   are often paths to a file)

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
   ([#12](https://github.com/ultraq/thymeleafjs/issues/12))
 - Other small changes to work on browsers more effectively

### 0.7.1
 - Fix the `main` entry to point to the new CommonJS bundle.

### 0.7.0
 - Add initial support for link expression syntax
   ([#9](https://github.com/ultraq/thymeleafjs/issues/9))

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
