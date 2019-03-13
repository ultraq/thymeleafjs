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

import UnlessAttributeProcessor            from '../../../source/standard/processors/UnlessAttributeProcessor';
import {createThymeleafAttributeValue} from '../../../source/utilities/Dom';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div, p} = hh(h);

/**
 * Tests for the `th:unless` attribute processor.
 */
describe('processors/standard/UnlessAttributeProcessor', function() {

  let attribute, processor;
  beforeAll(function() {
    processor = new UnlessAttributeProcessor('test');
    attribute = `${processor.prefix}:${processor.name}`;
  });

  test('Renders the element and children if the expression is falsey', function() {
    let expression = '${value}';
    let child = createThymeleafAttributeValue(p('Hello!'), attribute, expression);
    let parent = div([child]);
    processor.process(child, attribute, expression, { value: false });
    expect(parent.childNodes).toHaveLength(1);
  });

  test('Removes the element and children if the expression is truthy', function() {
    let expression = '${value}';
    let child = createThymeleafAttributeValue(p('Hello!'), attribute, expression);
    let parent = div([child]);
    processor.process(child, attribute, expression, { value: true });
    expect(parent.childNodes).toHaveLength(0);
  });
});
