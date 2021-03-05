import { getByPath, getPathArray } from '../../source/utilities/getByPath.js';

describe('utilities/getByPath', function() {
	const testObj = {
		nested: {
			depth1: {
				depth2: [
					'a',
					'b'
				]
			}
		}
	};

	describe('getPathArray', function() {
		it('Should convert array like path into array', () => {
			expect(getPathArray('array[0][1][2]')).toEqual(['array', '0', '1', '2']);
			expect(getPathArray('array[0].hello[2]')).toEqual(['array', '0', 'hello', '2']);
		});
	});

	describe('getByPath', function() {
		it('Should able to access JS object or array by path', () => {
			expect(getByPath(testObj, 'nested.depth1.depth2.3')).toBeNull();
			expect(getByPath(testObj, 'xyz')).toBeNull();
			expect(getByPath(testObj, 'nested.depth1.depth2[0]')).toEqual('a');
			expect(getByPath(testObj, 'nested.depth1.depth2.0')).toEqual('a');
			expect(getByPath(testObj, 'nested.depth1.depth2[1]')).toEqual('b');
			expect(getByPath(testObj, 'nested.depth1.depth2.1')).toEqual('b');
		});
	});
});
