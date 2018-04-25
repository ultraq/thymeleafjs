
ThymeleafJS
===========

[![Build Status](https://travis-ci.org/ultraq/thymeleafjs.svg?branch=master)](https://travis-ci.org/ultraq/thymeleafjs)
[![Coverage Status](https://coveralls.io/repos/github/ultraq/thymeleafjs/badge.svg?branch=master)](https://coveralls.io/github/ultraq/thymeleafjs?branch=master)
[![npm](https://img.shields.io/npm/v/thymeleaf.svg?maxAge=3600)](https://www.npmjs.com/package/thymeleaf)
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
client using ThymeleafJS with *the same template code* (I've been calling this
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

> thymeleafjs is still under development, denoted by the 0.x semver, so expect
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
 - **isomorphic**: enables the ability to run standard Thymeleaf processors with
   priority given to `thjs` processors of the same name.
 - **templateResolver**: a function supplied the template name which should then
   return the text or a `Promise` that will resolve with the text of the
   template being requested.  Required if you want to make use of template
   fragment processors like `th:insert`.

```javascript
import {TemplateEngine} from 'thymeleaf';

let templateEngine = new TemplateEngine({
  dialects: [
    // ...
  ],
  isomorphic: {
  	prefix: 'thjs'
  },
  templateResolver: templateName => {
  	// ...
  }
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
be used to from the original Thymeleaf.  It also enables the experimental
"isomorphic mode", in which ThymeleafJS can also process original Thymeleaf
processing instructions, unless a `thjs` one is specified for the same name, in
which case that will take precedence.

```javascript
import {TemplateEngine, STANDARD_CONFIGURATION} from 'thymeleaf';

let templateEngine = new TemplateEngine(STANDARD_CONFIGURATION);
```


Supported features (so far)
---------------------------

See here for supported processors: https://github.com/ultraq/thymeleafjs/issues/21

See here for supported expression syntaxes: https://github.com/ultraq/thymeleafjs/issues/20


Integration
-----------

### Express

Integration with the Express server is its own module,
[express-thymeleaf](https://github.com/ultraq/express-thymeleaf).  Installation
and usage instructions are also in that project's readme.
