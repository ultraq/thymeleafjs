
Thymeleaf JS
============

[![Build Status](https://travis-ci.org/ultraq/thymeleafjs.svg?branch=master)](https://travis-ci.org/ultraq/thymeleafjs)
[![Coverage Status](https://coveralls.io/repos/github/ultraq/thymeleafjs/badge.svg?branch=master)](https://coveralls.io/github/ultraq/thymeleafjs?branch=master)
[![GitHub tag](https://img.shields.io/github/tag/ultraq/thymeleafjs.svg?maxAge=3600)](https://github.com/ultraq/thymeleafjs/tags)
[![License](https://img.shields.io/github/license/ultraq/thymeleafjs.svg?maxAge=2592000)](https://github.com/ultraq/thymeleafjs/blob/master/LICENSE.txt)

A basic implementation of the [Thymeleaf](http://thymeleaf.org/) templating
engine in JavaScript.

Having worked with Thymeleaf for several years, other templating languages are
starting to look foreign to me.  Upon evaluating several existing JavaScript
templating languages to help build a mock Node server for development, it made
me yearn for the natural templating feature of Thymeleaf.

The goal of this project is not to be a full JS implementation of Thymeleaf, but
rather to support the use of equivalent Thymeleaf "attribute processors" which
perform the same tasks as simple JS templating libraries like [Mustache](https://github.com/janl/mustache.js/).
And then, finally, I can use it with a Node server like [Express](http://expressjs.com/)
and achieve my Thymeleaf-in-JS dream :)


Current goals
-------------

This project already works very well as a server-side template renderer, but now
I'm trying to get it to play nice with the original Thymeleaf, ie: render
templates on the server with Thymeleaf, then re-render the templates on the
client using Thymeleaf JS with *the same template code* (I've been calling this
feature "isomorphic templating", akin to isomorphic JavaScript where the same
code is run on the client and server).

To help with this, I've written a simple TODO app in Spring Boot w/ Thymeleaf
and am using ThymeleafJS to test and develop this feature.  The TODO app can be
found here: https://github.com/ultraq/thymeleafjs-todo


Natural Templates
-----------------

For those unfamiliar with Thymeleaf, it's main feature is being able to use
*natural templates* - HTML that can be correctly displayed in browsers and also
work as static prototypes, allowing for stronger collaboration in development
teams.

Borrowing the example from the front page of the Thymeleaf website:

```html
<p>Hello <span thjs:text="${username}">(username)</span>
You're using Thymeleaf for JavaScript!  Wanna see some random fruit?</p>
<ul>
  <li thjs:each="product: ${allProducts}">
    <div thjs:text="${product.name}">Oranges</div>
    <div thjs:text="${product.price}">0.99</div>
  </li>
</ul>
```


Installation
------------

Via NPM:

```
npm install thymeleaf --save
```


API
---

> thymeleaf-js is still under development, denoted by the 0.x semver, so expect
> anything below to change.

Create a new instance of a Thymeleaf `TemplateEngine`, then use one of its
`process*` functions to process your Thymeleaf template, eg:

```javascript
import {TemplateEngine} from 'thymeleaf';

let templateEngine = new TemplateEngine();

// Render template from string
templateEngine.process('<div thjs:text="${greeting}">(greeting)</div>', { greeting: 'Hello!' })
  .then(result => {
    // Do something with the result...
  });

// Render template from file
templateEngine.processFile('template.html', { greeting: 'Hello!' })
  .then(result => {
    // Do something with the result...
  });
```

### TemplateEngine

The main class for the processing of templates.

#### new TemplateEngine(options)

When constructing a new instance of the template engine, a config object can be
passed in to set any of the available options.  These are:

 - **dialects**: array of [Dialect](#dialect) instances to use in processing

```javascript
import {TemplateEngine} from 'thymeleaf';

let templateEngine = new TemplateEngine({
  dialects: [
    // Dialect instances here
  ]
});
```

#### process(templateString, context)

Process the Thymeleaf template, returning a Promise which is resolved with the
processed template.

 - **template**: a Thymeleaf template string to process
 - **context**: an object of key/value pairs, what the expressions evaluate to
   and the values they're set to

#### processFile(templateFile, context)

Process the Thymeleaf template at the given file location, returning a Promise
which is resolved with the processed template.

 - **templateFile**: path to the Thymeleaf template to process
 - **context**: an object of key/value pairs, what the expressions evaluate to
   and the values they're set to


### Dialect

A basic class that is used as a template for implementing dialects that contain
processors to expand Thymeleaf's functionality.  The [Standard Dialect](#standarddialect)
is itself an instance of `Dialect`.


### AttributeProcessor

A basic class that is used for creating processors that work using HTML
attributes.  All of the processors in the Standard Dialect are currently
`AttributeProcessor`s.


### StandardDialect

The built-in dialect that provides all the functionality that Thymeleaf is known
for.  Importing this class is only useful for specifying a prefix different from
the default of `thjs`, eg:

```javascript
import {TemplateEngine, StandardDialect} from 'thymeleaf';

let templateEngine = new TemplateEngine({
  dialects: [
    new StandardDialect('th')
  ]
});
```

Use the [STANDARD_CONFIGURATION](#standard_configuration) export to do this more
succinctly.


### STANDARD_CONFIGURATION

A configuration object used to set the prefix to the `th` that many of us will
be used to from the original Thymeleaf.

```javascript
import {TemplateEngine, STANDARD_CONFIGURATION} from 'thymeleaf';

let templateEngine = new TemplateEngine(STANDARD_CONFIGURATION);
```

This configuration object may contain more default options in the future, but
for now it only serves this 1 purpose.


Supported features (so far)
---------------------------

Given that Thymeleaf JS has only a subset of Thymeleaf's features, and that most
people familiar with Thymeleaf are from the Java side who have used the full
feature set, it might help those coming here to let them know what this project
is capable, and thus incapable, of doing.

### Processors

 - `th:attr` (attribute replacement)
 - `th:each` (iteration)
 - `th:href` (`href` attribute replacement w/ link expression support)
 - `th:if` (conditional rendering)
 - `th:insert` (fragment inclusion)
 - `th:src` (`src` attribute replacement w/ link expression support)
 - `th:text` (text replacement)
 - `th:utext` (text replacement, unescaped)

### Expressions

 - `${name}`/`${item.name}` (navigation expressions, references any object and
   its properties on the current context)
 - `@{path{param=${item})}`/`@{path/{placeholder}/(placeholder=${item})}` (url
   expressions, parameters become either search parameters in the URL, replace
   placeholders in the URL, or both)
 - `~{template::fragment}` (fragment expressions, references an element in
   another template)


### Caveat on fragment inclusion

The current method of fragment inclusion still requires a decent amount of
hacking in the consuming app to work.  As seen in the thymeleafjs-todo example
app, the webpack configuration uses [the HTML loader with attribute parsing
turned off](https://github.com/ultraq/thymeleafjs-todo/blob/01ebb094bef0eaef168bc084fe3d50657b2a1f10/todo-ui/webpack.config.js#L23-L31),
plus a special [`templates` alias to point to the location of Thymeleaf
templates](https://github.com/ultraq/thymeleafjs-todo/blob/01ebb094bef0eaef168bc084fe3d50657b2a1f10/todo-ui/webpack.config.js#L36).
This matches up with a special [`templates` require directive](https://github.com/ultraq/thymeleafjs/blob/4413cc04a30399d7b18847ef63e1d734ce196fa3/src/utilities/TemplateResolver.js#L42)
in template resolution.  The reason for all this is because webpack has no way
of knowing how to include other templates based on Thymeleaf fragment directives.

[A new issue has been raised](https://github.com/ultraq/thymeleafjs/issues/16)
to address this hack for webpack bundlers.


Integration
-----------

### Express

Integration with the Express server is its own module,
[express-thymeleaf](https://github.com/ultraq/express-thymeleaf).  Installation
and usage instructions are also in that project's readme.
