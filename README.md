
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
