/* 
 * Copyright 2017, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {DEFAULT_CONFIGURATION}     from './Configurations.js';
import AttributeProcessor          from './processors/AttributeProcessor.js';
import ElementProcessor            from './processors/ElementProcessor.js';
import Matcher                     from './processors/Matcher.js';
import ExpressionProcessor         from './standard/expressions/ExpressionProcessor.js';
import FragmentSignatureGrammar    from './standard/expressions/FragmentSignatureGrammar.js';
import ThymeleafExpressionLanguage from './standard/expressions/ThymeleafExpressionLanguage.js';
import {deserialize, serialize}    from './utilities/Dom.js';
import {promisify}                 from './utilities/Functions.js';

import {readFile} from 'fs';

/**
 * A highly-configurable class responsible for processing the Thymeleaf
 * directives found in HTML documents and fragments.
 * 
 * @author Emanuel Rabina
 */
export default class TemplateEngine {

	/**
	 * Constructor, set up a new template engine instance.
	 * 
	 * @param {Object} [config=DEFAULT_CONFIGURATION]
	 */
	constructor({dialects, messageResolver, templateResolver} = DEFAULT_CONFIGURATION) {

		this.messageResolver  = messageResolver;
		this.templateResolver = templateResolver;
		this.expressionProcessor = new ExpressionProcessor(ThymeleafExpressionLanguage);
		this.fragmentSignatureProcessor = new ExpressionProcessor(FragmentSignatureGrammar);

		// Combine all processors into a unified list
		this.processors = dialects.reduce((acc, {processors}) => processors ? [
			...acc,
			...processors
		] : acc, []);

		// Combine all expression objects into a unified object
		this.expressionObjects = dialects.reduce((acc, {expressionObjects}) => expressionObjects ? {
			...acc,
			...expressionObjects
		} : acc, {});
	}

	/**
	 * Process the Thymeleaf template data, returning the processed template.
	 *
	 * @param {String} template
	 * @param {Object} [context={}]
	 * @return {Promise<String>}
	 *   A promise resolved with the processed template, or rejected with an error
	 *   message.
	 */
	process(template, context = {}) {

		let documentFragment = deserialize(template);
		let rootElement = documentFragment.firstElementChild;
		return this.processNode(rootElement, {
			...context,
			...this.expressionObjects,
			// TODO: Is there some way to make these things a dependency of the
			//       processors that need them?  Otherwise it feels like passing
			//       dependencies as part of the context object 🤔
			expressionProcessor: this.expressionProcessor,
			fragmentSignatureProcessor: this.fragmentSignatureProcessor,
			messageResolver:  this.messageResolver,
			templateResolver: this.templateResolver
		})
			.then(() => {
				return serialize(documentFragment);
			});
	}

	/**
	 * Process the Thymeleaf template at the given path, returning a promise of
	 * the processed template.
	 * 
	 * @param {String} filePath
	 * @param {Object} [context={}]
	 * @return {Promise<String>}
	 *   A promise of the processed template.  The promise is immediately rejected
	 *   if this method is called in a browser environment.
	 */
	processFile(filePath, context = {}) {

		/* global ENVIRONMENT */
		return ENVIRONMENT === 'browser' ?
			Promise.reject(new Error('Cannot use TemplateEngine.processFile() inside a browser')) :
			promisify(readFile)(filePath)
				.then(data => {
					return this.process(data, context);
				});
	}

	/**
	 * Process a DOM element.
	 * 
	 * @private
	 * @param {Element} element
	 * @param {Object} [context={}]
	 * @return {Promise<Boolean>} Whether or not the parent node needs
	 *   reprocessing.
	 */
	async processNode(element, context = {}) {

		let localVariables = element.__thymeleafLocalVariables || {};
		let localContext = {
			...context,
			...localVariables
		};
		let matcher = new Matcher();

		// Run the current element through the gamut of registered processors.  If
		// one of them sends a reprocessing signal, return from this method to let
		// the caller re-run everything.
		for (let i = 0; i < this.processors.length; i++) {
			let processor = this.processors[i];
			let processorResult = false;

			let match = matcher.matches(element, processor);
			if (match) {
				if (processor instanceof AttributeProcessor) {
					processorResult = await processor.process(element, match,
						element.getAttribute(match), localContext);
				}
				else if (processor instanceof ElementProcessor) {
					processorResult = await processor.process(element, localContext);
				}
			}

			if (processorResult) {
				return true;
			}
		}

		// Process this element's children, handling the reprocessing signal to
		// re-run the 'current' child element (could have been shifted due to being
		// removed etc).
		for (let i = 0; i < element.children.length; ) {
			let child = element.children[i];
			let reprocess = await this.processNode(child, localContext);
			if (!reprocess) {
				i++;
			}
		}
	}
}
