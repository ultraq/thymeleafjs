
Thymeleaf JS
============

[![Build Status](https://travis-ci.org/ultraq/thymeleaf-js.svg?branch=master)](https://travis-ci.org/ultraq/thymeleaf-js)
[![GitHub tag](https://img.shields.io/github/tag/ultraq/thymeleaf-js.svg?maxAge=3600)](https://github.com/ultraq/thymeleaf-js/tags)
[![License](https://img.shields.io/github/license/ultraq/thymeleaf-js.svg?maxAge=2592000)](https://github.com/ultraq/thymeleaf-js/blob/master/LICENSE.txt)

A basic implementation of the [Thymeleaf](http://thymeleaf.org/) templating
engine in JavaScript.

Having worked with Thymeleaf for several years, other templating languages are
starting to look foreign to me.  Upon evaluating several existing JavaScript
templating languages to help build a mock Node server for development, it made
me yearn for the static-prototyping-friendliness of Thymeleaf.

The goal of this project is not to be a full JS implementation of Thymeleaf, but
rather to support the use of equivalent Thymeleaf "attribute processors" which
perform the same tasks as simple JS templating libraries like [Mustache](https://github.com/janl/mustache.js/).
And then, finally, I can use it with a Node server like [Express](http://expressjs.com/)
and achieve my Thymeleaf-in-JS dream :)


Installation
------------

Via NPM:

```
npm install thymeleaf --save
```


Natural Templates
-----------------

Just like the original Thymeleaf, Thymeleaf for JavaScript brings elegant
*natural templates* to your development workflow - HTML that can be correctly
displayed in browsers and also work as static prototypes, allowing for stronger
collaboration in development teams.

Taking this:

```html
<p><span data-th-text="${greeting}">(greeting)</span>
You're using Thymeleaf for JavaScript!</p>
```

And making it this:

```html
<p><span>Hello!</span>
You're using Thymeleaf for JavaScript!</p>
```


API
---

> thymeleaf-js is still under development, denoted by the 0.x semver, so expect
> anything below to change.

Include the Thymeleaf module like you would any other module, then use one of
its `process*` functions process your Thymeleaf template, eg:

```javascript
import thymeleaf from 'thymeleaf';

// Render template from string
thymeleaf.process('<div data-th-text="${greeting}">(greeting)</div>', { greeting: 'Hello!' })
  .then(result => {
  	// Do something with the result...
  });

// Render template from file
thymeleaf.processFile('template.html', { greeting: 'Hello!' })
  .then(result => {
  	// Do something with the result...
  });
```

### process(templateString, context)

Process the Thymeleaf template, returning a Promise which is resolved with the
processed template.

 - **template**: a Thymeleaf template string to process
 - **context**: an object of key/value pairs, what the expressions evaluate to
   and the values they're set to

### processFile(templateFile, context)

Process the Thymeleaf template at the given file location, returning a Promise
which is resolved with the processed template.

 - **templateFile**: path to the Thymeleaf template to process
 - **context**: an object of key/value pairs, what the expressions evaluate to
   and the values they're set to
