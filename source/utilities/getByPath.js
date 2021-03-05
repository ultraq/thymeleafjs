/**
 *
 * @param {Object|Array} obj
 * @param {string} path
 * @return {*}
 */
export function getByPath(obj, path) {
	const paths = getPathArray(path);
	let requestedObject = Array.isArray(obj) ? [...obj] : {...obj};

	for (let i = 0; i < paths.length; i++) {
		try {
			if (requestedObject[paths[i]] === undefined) {
				requestedObject = null;
				break;
			}

			requestedObject = requestedObject[paths[i]];
		}
		catch (e) {
			requestedObject = null;
			break;
		}
	}

	return requestedObject;
}

/**
 * Helper function to convert array like path string into array
 *
 * @param {string} path
 * @return {Array<string>}
 */
export function getPathArray(path) {
	return path.split('.').reduce((acc, el) => {
		return acc.concat(el.replace(/["']/g, '')
			.split('[')
			.filter(i => i !== '')
			.map(i => i.replace(']', '')));
	}, []);
}
