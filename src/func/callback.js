/**
 * 格式化成功对象
 */
function buildSuccessObject(code = 200, message, data = null) {
	return {
		code: code,
		message: message,
		data: data
	}
}

/**
 * 格式化失败对象
 */
function buildErrObject(code = 500, message, data = null) {
	return {
		code: code,
		message: message,
		data: data
	}
}

/**
 * 参数函数成功回调
 * 
 * @param {Object} options 包含成功回调函数参数的对象
 * @param {Function} [options.success] - 成功回调 
 * @param {String} message 消息提示
 * @param {Object} data 回调参数
 * @param {Number} code 状态码
 */
function successHandle(options, message, data = null, code = 200) {
	try {
		if (options != null && options.success !== undefined && typeof options.success === "function") {
			options.success(buildSuccessObject(code, message, data));
		}
	} catch (e) {
		console.error(e)
	}
}

/**
 * 参数函数失败回调
 * 
 * @param {Object} options 包含失败回调函数参数的对象
 * @param {Function} [options.fail] - 失败回调 
 * @param {Number} code 状态码
 * @param {String} message 消息提示
 * @param {Object} data 回调参数
 */
function errHandle(options, code = 500, message, data = null) {
	try {
		if (options != null && options.fail !== undefined && typeof options.fail === "function") {
			options.fail(buildErrObject(code, message, data));
		}
	} catch (e) {
		console.error(e)
	}
}

export {
	buildSuccessObject,
	buildErrObject,
	successHandle,
	errHandle
}
