import {
	instance
} from "../yeim-uni-sdk";

/**
 * 触发事件
 * @param {Object} event
 * @param {Object} data
 */
function emit(event, data) {
	uni.$emit(instance.defaults.eventPrefix + event, data)
}

/**
 * 添加事件监听器
 * @param {Object} event
 * @param {Object} callback
 */
function addEventListener(event, callback) {
	if (event) {
		//uni.$off(this.eventPrefix + event);
		uni.$on(instance.defaults.eventPrefix + event, callback);
	}
}

/**
 * 移除事件监听器
 * @param {Object} event
 * @param {Object} callback
 */
function removeEventListener(event, callback) {
	if (event) {
		uni.$off(instance.defaults.eventPrefix + event, callback);
	}
}

export {
	emit,
	addEventListener,
	removeEventListener
};
