import {
	instance
} from '../yeim-uni-sdk';

import {
	YeIMUniSDKDefines
} from '../const/yeim-defines';

import {
	uploadImage,
	uploadAudio,
	uploadVideo
} from './uploadService';

import {
	buildErrObject,
	successHandle,
	errHandle
} from '../func/callback';


import {
	isHttpURL
} from '../func/common';

import md5 from '../utils/md5';

import formatMessage from '../func/formatMessage';

import log from '../func/log';
import {
	Api,
	request
} from '../func/request';
import {
	YeIMUniSDKStatusCode
} from '../const/yeim-status-code';
import {
	emit 
} from '../func/event';
import {
	getCache,
	setCache
} from '../func/storage';


/**
 * 创建文本消息 
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { text: "" }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 文本消息对象
 * @param {String} options.body.text - 文本消息内容
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createTextMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body || !options.body.text) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'text 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.TEXT,
		conversationType: options.conversationType,
		body: {
			text: options.body.text
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 创建群聊 @ 艾特消息 
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "群ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { text: "", atUserIdList: [] }}
 *
 * @param {String} options.toId - 群ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊 当前消息仅支持群里
 * @param {Object} options.body - 文本消息对象
 * @param {String} options.body.text - 文本消息内容
 * @param {Array<String>} options.body.atUserIdList - 要艾特的用户ID列表
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createTextAtMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (options.conversationType != YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, '仅群聊支持文本@消息');
	}

	if (!options.body || !options.body.text) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'text 不能为空');
	}

	if (!options.body.atUserIdList) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'atUserIdList 不能为空');
	}

	if (Object.prototype.toString.call(options.body.atUserIdList) !== '[object Array]') {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'atUserIdList 应为用户ID组成的字符串数组');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.TEXT_AT,
		conversationType: options.conversationType,
		body: {
			text: options.body.text,
			atUserIdList: options.body.atUserIdList
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 创建图片消息
 * 
 * 仅支持单张图片
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { file: { tempFilePath: "", width: 100, height: 100 } }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 图片消息对象
 * @param {Object} options.body.file - 图片消息对象
 * @param {String} options.body.file.tempFilePath - 本地图片文件临时路径
 * @param {Number} options.body.file.width - 图片宽度
 * @param {Number} options.body.file.height - 图片高度
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createImageMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body || !options.body.file) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'file 不能为空');
	}

	if (!options.body.file.tempFilePath) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'tempFilePath 不能为空');
	}

	if (!options.body.file.width) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'width 不能为空');
	}

	if (!options.body.file.height) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'height 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.IMAGE,
		conversationType: options.conversationType,
		body: {
			originalUrl: options.body.file.tempFilePath,
			originalWidth: options.body.file.width,
			originalHeight: options.body.file.height,
			thumbnailUrl: options.body.file.tempFilePath,
			thumbnailWidth: options.body.file.width,
			thumbnailHeight: options.body.file.height
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	if (options.onProgress !== undefined && typeof options.onProgress === 'function') {
		message.onProgress = options.onProgress;
	}
	return message;
}

/**
 * 创建图片Url直发消息
 * 
 * 仅支持单张图片
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { originalUrl: "http://xxx.com/xxx.jpg", originalWidth: 500, originalHeight: 500, thumbnailUrl: "http://xxx.com/_xxx.jpg", thumbnailWidth: 200, thumbnailHeight: 200 } }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 图片消息对象
 * @param {String} options.body.originalUrl - 原图网络Url
 * @param {Number} options.body.originalWidth - 原图宽度
 * @param {Number} options.body.originalHeight - 原图高度
 * @param {String} options.body.thumbnailUrl - 缩略图网络Url
 * @param {Number} options.body.thumbnailWidth - 缩略图宽度
 * @param {Number} options.body.thumbnailHeight - 缩略图高度
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createImageMessageFromUrl(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'body 不能为空');
	}

	if (!options.body.originalUrl) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'originalUrl 不能为空');
	}

	if (!options.body.originalWidth) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'originalWidth 不能为空');
	}

	if (!options.body.originalHeight) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'originalHeight 不能为空');
	}

	if (!options.body.thumbnailUrl) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'thumbnailUrl 不能为空');
	}

	if (!options.body.thumbnailWidth) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'thumbnailWidth 不能为空');
	}

	if (!options.body.thumbnailHeight) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'thumbnailHeight 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.IMAGE,
		conversationType: options.conversationType,
		body: {
			originalUrl: options.body.originalUrl,
			originalWidth: options.body.originalWidth,
			originalHeight: options.body.originalHeight,
			thumbnailUrl: options.body.thumbnailUrl,
			thumbnailWidth: options.body.thumbnailWidth,
			thumbnailHeight: options.body.thumbnailHeight
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);

	return message;
}

/**
 * 创建位置消息 
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { address: "地址名称", description: "地址详细描述", longitude: 105.000000, latitude: 31.000000 }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 位置消息对象
 * @param {String} options.body.address - 地址名称
 * @param {String} options.body.description - 地址详细描述
 * @param {Number} options.body.longitude - 经度
 * @param {Number} options.body.latitude - 纬度
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createLocationMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body.address) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'address 不能为空');
	}

	if (!options.body.description) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'description 不能为空');
	}

	if (!options.body.longitude) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'longitude 不能为空');
	}

	if (!options.body.latitude) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'latitude 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.LOCATION,
		conversationType: options.conversationType,
		body: {
			address: options.body.address,
			description: options.body.description,
			longitude: options.body.longitude,
			latitude: options.body.latitude,
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 创建语音消息
 * 
 * 仅支持AAC格式音频
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { file: { tempFilePath: "", duration: 10 } }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 音频消息对象
 * @param {Object} options.body.file - 音频文件信息
 * @param {String} options.body.file.tempFilePath - 本地音频文件临时路径
 * @param {Number} options.body.file.duration - 音频时长，单位秒 
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createAudioMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body || !options.body.file) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'file 不能为空');
	}

	if (!options.body.file.tempFilePath) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'tempFilePath 不能为空');
	}

	if (!options.body.file.duration) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'duration 不能为空');
	}


	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.AUDIO,
		conversationType: options.conversationType,
		body: {
			audioUrl: options.body.file.tempFilePath,
			duration: options.body.file.duration
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	if (options.onProgress !== undefined && typeof options.onProgress === 'function') {
		message.onProgress = options.onProgress;
	}
	return message;
}

/**
 * 创建语音Url直发消息
 *   
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { audioUrl: "http://xxx.com/1.aac", duration: 5 } }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 音频消息对象 
 * @param {String} options.body.audioUrl - 音频网络Url
 * @param {Number} options.body.duration - 音频时长，单位秒 
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createAudioMessageFromUrl(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'body 不能为空');
	}

	if (!options.body.audioUrl) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'audioUrl 不能为空');
	}

	if (!options.body.duration) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'duration 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.AUDIO,
		conversationType: options.conversationType,
		body: {
			audioUrl: options.body.audioUrl,
			duration: options.body.duration
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 创建小视频消息 
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { file: { tempFilePath: "", width: 100, height: 100 } }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 视频消息对象
 * @param {Object} options.body.file - 视频文件信息
 * @param {String} options.body.file.tempFilePath - 本地小视频文件临时路径
 * @param {Number} options.body.file.duration - 视频时长
 * @param {Number} options.body.file.width - 视频宽度
 * @param {Number} options.body.file.height - 视频高度
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createVideoMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body || !options.body.file) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'file 不能为空');
	}

	if (!options.body.file.duration) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'duration 不能为空');
	}

	if (typeof options.body.file.duration !== 'number') {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'duration 参数请传入整型');
	}

	if (!options.body.file.tempFilePath) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'tempFilePath 不能为空');
	}

	if (!options.body.file.width) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'width 不能为空');
	}

	if (!options.body.file.height) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'height 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO,
		conversationType: options.conversationType,
		body: {
			videoUrl: options.body.file.tempFilePath,
			thumbnailUrl: '',
			duration: options.body.file.duration,
			videoWidth: options.body.file.width,
			videoHeight: options.body.file.height
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	if (options.onProgress !== undefined && typeof options.onProgress === "function") {
		message.onProgress = options.onProgress;
	}
	return message;
}

/**
 * 创建小视频Url直发消息 
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { videoUrl: "http://xxx.com/1.mp4", thumbnailUrl: "http://xxx.com/1.jpg", duration: 5, width: 720, height: 1280 }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 视频消息对象
 * @param {String} options.body.videoUrl - 视频网络Url
 * @param {String} options.body.thumbnailUrl - 视频缩略图网络Url
 * @param {Number} options.body.duration - 视频时长
 * @param {Number} options.body.width - 视频宽度
 * @param {Number} options.body.height - 视频高度
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createVideoMessageFromUrl(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'file 不能为空');
	}

	if (!options.body.duration) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'duration 不能为空');
	}

	if (typeof options.body.duration !== 'number') {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'duration 参数请传入整型');
	}

	if (!options.body.videoUrl) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'tempFilePath 不能为空');
	}

	if (!options.body.width) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'width 不能为空');
	}

	if (!options.body.height) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'height 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO,
		conversationType: options.conversationType,
		body: {
			videoUrl: options.body.videoUrl,
			thumbnailUrl: options.body.thumbnailUrl,
			duration: options.body.duration,
			videoWidth: options.body.width,
			videoHeight: options.body.height
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 创建自定义消息 
 * 
 * 自定义消息内容放在body字段 
 *
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: {} }
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 自定义消息体
 * @param {Object|String} options.body.custom - 消息内容
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createCustomMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body || !options.body.custom) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, '自定义消息的 body 和 body.custom 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.CUSTOM,
		conversationType: options.conversationType,
		body: {
			custom: options.body.custom
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 创建合并消息 
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { title: "", messageList: [], summaryList: [] }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 文本消息对象
 * @param {String} options.body.title - 合并消息的标题
 * @param {Array<Message>} options.body.messageList - 合并消息的标题
 * @param {Array<String>} options.body.summaryList - 合并消息的标题
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createMergerMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body || !options.body.title) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'title 不能为空');
	}

	if (!options.body.messageList) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'messageList 不能为空');
	}

	if (Object.prototype.toString.call(options.body.messageList) !== '[object Array]') {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'messageList 应为由Message结构组成的数组');
	}

	if (!options.body.summaryList) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'summaryList 不能为空');
	}

	if (Object.prototype.toString.call(options.body.summaryList) !== '[object Array]') {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'summaryList 应为字符串数组');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.MERGER,
		conversationType: options.conversationType,
		body: {
			title: options.body.title,
			messageList: options.body.messageList,
			summaryList: options.body.summaryList,
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 创建转发消息 
 * 
 * @param {Object} options - 创建消息参数对象
 * 
 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { message: message }}
 *
 * @param {String} options.toId - 接受者用户ID
 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {Object} options.body - 文本消息对象
 * @param {Message} options.body.message - 要转发的消息 
 * 
 * @return {(Object|Message)} Message 消息对象
 *  
 */
function createForwardMessage(options) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (options == null || !options.toId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'toId 不能为空');
	}

	if (!options.conversationType) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationType 不能为空');
	}

	if (!options.body || !options.body.message) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'message 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.FORWARD,
		conversationType: options.conversationType,
		body: {
			message: options.body.message
		}
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 *  
 * 发送消息统一入口 
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "message": message, success: (result) => {}, fail: (error) => {} }
 * 
 * @param {Message} options.message - 消息对象    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * sendMessage({
	   message: message, 
	   success: (result) => {},
	   fail: (error) => {}
   });
 */
function sendMessage(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.message) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'message 不能为空');
	}

	let message = options.message;
	if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.IMAGE) {
		sendImageMessage(options);
	} else if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO) {
		sendVideoMessage(options);
	} else if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.AUDIO) {
		sendAudioMessage(options);
	} else {
		sendIMMessage(options);
	}

}

/**
 *  
 * 发送消息 
 * 
 * @private
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Message} options.message - 消息对象    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function sendIMMessage(options) {
	let message = options.message;
	request(Api.Message.sendMessage, 'POST', message).then((result) => {
		//保存消息到本地
		saveMessage(result);
		//发送成功回调
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});
}

/**
 *  
 * 发送图片消息 
 * 
 * @private
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Message} options.message - 消息对象    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function sendImageMessage(options) {
	let message = options.message;
	if (typeof message.body.originalUrl == 'string') {
		//如果原图Url和缩略图Url均为网络图片，则我们认为此媒体消息为直发消息，不进行上传处理。 
		if (isHttpURL(message.body.originalUrl) && isHttpURL(message.body.thumbnailUrl)) {
			//直发消息
			return sendIMMessage(options);
		}
	}

	uploadImage({
		filename: instance.token + '_image.png',
		filepath: message.body.originalUrl,
		width: message.body.originalWidth,
		height: message.body.originalHeight,
		success: (res) => {
			message.body.originalUrl = res.data.url;
			message.body.thumbnailWidth = res.data.thumbnailWidth;
			message.body.thumbnailHeight = res.data.thumbnailHeight;
			message.body.thumbnailUrl = res.data.thumbnailUrl;
			options.message = message;
			sendIMMessage(options);
		},
		fail: (err) => {
			errHandle(options, err.code, err.message);
			log(1, err);
		},
		onProgress: (progress) => {
			if (message.onProgress !== undefined && typeof message.onProgress === 'function') {
				message.onProgress(progress);
			}
		}
	})
}

/**
 *  
 * 发送语音消息 
 * 
 * @private
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Message} options.message - 消息对象    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function sendAudioMessage(options) {
	let message = options.message;

	//如果音频Url为网络图片，则我们认为此媒体消息为直发消息，不进行上传处理。
	if (typeof message.body.audioUrl == 'string') {
		if (isHttpURL(message.body.audioUrl)) {
			//直发消息
			return sendIMMessage(options);
		}
	}
	uploadAudio({
		filename: instance.token + '_audio.aac',
		filepath: message.body.audioUrl,
		success: (res) => {
			let resultUrl = res.data.url;
			message.body.audioUrl = resultUrl;
			options.message = message;
			sendIMMessage(options);
		},
		fail: (err) => {
			errHandle(options, err.code, err.message);
			log(1, err);
		},
		onProgress: (progress) => {
			if (message.onProgress !== undefined && typeof message.onProgress === 'function') {
				message.onProgress(progress);
			}
		}
	})
}

/**
 *  
 * 发送小视频消息
 * 
 * @private
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Message} options.message - 消息对象    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function sendVideoMessage(options) {
	let message = options.message;

	//如果视频Url为网络图片，则我们认为此媒体消息为直发消息，不进行上传处理。
	if (typeof message.body.videoUrl == 'string') {
		if (isHttpURL(message.body.videoUrl)) {
			//直发消息
			return sendIMMessage(options);
		}
	}
	uploadVideo({
		filename: instance.token + '_video.mp4',
		filepath: message.body.videoUrl,
		success: (res) => {
			console.log(uploadVideo)
			console.log(res)

			let videoUrl = res.data.videoUrl;
			let thumbnailUrl = res.data.thumbnailUrl;
			message.body.videoUrl = videoUrl;
			message.body.thumbnailUrl = thumbnailUrl;
			options.message = message;
			sendIMMessage(options);
		},
		fail: (err) => {
			errHandle(options, err.code, err.message);
			log(1, err);
		},
		onProgress: (progress) => {
			if (message.onProgress !== undefined && typeof message.onProgress === 'function') {
				message.onProgress(progress);
			}
		}
	})
}

/**
 *  
 * 保存消息到本地
 * 
 * @private 
 * 
 * @param {Message} message - 消息对象     
 * @return {void}
 */
function saveMessage(message) {
	if (!message.conversationId) {
		return log(1, 'conversationId 不能为空');
	}
	let list = getMessageListFromLocal(message.conversationId);
	let index = list.findIndex(item => {
		return item.messageId === message.messageId
	});
	let key = `yeim:messageList:${md5(instance.userId)}:conversationId:${md5(message.conversationId)}`;
	//不存在插入
	if (index === -1) {
		if (list.length > 19) {
			list.splice(0, list.length - 19);
		}
		list.push(message);
		setCache(key, list);
	} else {
		//存在则更新
		list[index] = message;
		setCache(key, list);
	}
}

/**
 * 
 * @version 1.1.7
 * 
 * 获取历史消息记录  
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {String} options.nextMessageId - 下次拉取的开始ID    
 * @param {String} options.conversationId - 会话ID    
 * @param {Number} options.limit - 拉取数量，默认：20
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function getHistoryMessageList(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.conversationId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationId 不能为空');
	}

	//拉取数量
	let limit = 20;
	if (options.limit && typeof options.limit == 'number') {
		limit = options.limit;
	}

	//先查询本地消息
	let cacheList = getMessageListFromLocal(options.conversationId);

	//检查是否需要从云端对齐
	let cloud = false;
	if (!options.nextMessageId) {
		let key = `yeim:conversationList:${md5(instance.userId)}`;
		let result = getCache(key);
		result = result ? result : [];
		let index = result.findIndex(item => {
			return item.conversationId === options.conversationId;
		});
		if (index > -1 && cacheList.length > 0) {
			let conversation = result[index];
			let lastLocalMessage = cacheList[cacheList.length - 1];
			//如果本地最新消息和会话保存的最新消息不一致则从云端对齐
			if (conversation.lastMessage.messageId && conversation.lastMessage.messageId != lastLocalMessage
				.messageId) {
				cloud = true;
			}
		}
	}

	//云端对齐
	if (cloud) {
		getHistoryMessageFromCloud(options.conversationId, null, 20)
			.then((map) => {
				let list = map.list;
				let key = `yeim:messageList:${md5(instance.userId)}:conversationId:${md5(options.conversationId)}`;
				setCache(key, list);
				successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, map);
			}).catch((err) => {
				errHandle(options, err.code, err.message);
			});
	}
	//判断是否存在上一次拉取的最后一条消息.
	//如果传入nextMessageId，则从此消息ID开始倒序查询消息记录，否则从最新一条开始查询  
	else if (!options.nextMessageId) {
		//如果小于limit条，再从云端查询一次，同步本地记录 
		if (cacheList.length < limit) {
			let diff = limit - cacheList.length;
			let nextMessageId = null;
			if (cacheList.length > 0) {
				nextMessageId = cacheList[0].messageId;
			}
			getHistoryMessageFromCloud(options.conversationId, nextMessageId, diff)
				.then((map) => {
					let list = map.list;
					let result = cacheList.concat(list);
					result.sort((a, b) => {
						return a.sequence - b.sequence;
					});
					//本地缓存中当前会话不够limit条，从云端拉取补足 
					let key =
						`yeim:messageList:${md5(instance.userId)}:conversationId:${md5(options.conversationId)}`;
					setCache(key, result);
					map.list = result;
					if (!map.nextMessageId) {
						map.nextMessageId = nextMessageId;
					}
					successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, map);
				}).catch((err) => {
					errHandle(options, err.code, err.message);
				});
		} else {
			//如果不小于limit条，直接返回数据
			successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, {
				list: cacheList,
				nextMessageId: cacheList[0].messageId
			});
		}
	}
	//传入了nextMessageId，从此消息ID开始倒序查询消息记录
	else {

		let nextMessageId = options.nextMessageId;

		//是否在本地
		let index = cacheList.findIndex(item => {
			return item.messageId === nextMessageId
		});

		//本地没找着，直接从云端去拿
		if (index === -1) {
			getHistoryMessageFromCloud(options.conversationId, nextMessageId, limit)
				.then((map) => {
					successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, map);
				}).catch((err) => {
					errHandle(options, err.code, err.message);
				});
		} else {
			let message = cacheList[index];
			//本地找到一个消息，先取出从nextMessageId开始的本地的几个数据
			cacheList = cacheList.slice(0, index);
			//如果这几个数据对比limit不足，再从云端补足
			if (cacheList.length < limit) {
				let diff = limit - cacheList.length;
				let nextMessageId = null;
				if (cacheList.length == 0) {
					nextMessageId = message.messageId;
				} else {
					nextMessageId = cacheList[0].messageId;
				}
				//从云端补足
				getHistoryMessageFromCloud(options.conversationId, nextMessageId, diff)
					.then((map) => {
						let list = map.list;
						let result = cacheList.concat(list);
						result.sort((a, b) => {
							return a.sequence - b.sequence;
						});
						map.list = result;
						if (!map.nextMessageId) {
							map.nextMessageId = nextMessageId;
						}
						successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, map);
					}).catch((err) => {
						errHandle(options, err.code, err.message);
					});
			} else {
				//这几个数据对比limit已经够了，直接返回
				successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, {
					list: cacheList,
					nextMessageId: cacheList[0].messageId
				});
			}
		}
	}
}

/**
 * 
 * @version 1.1.7
 * 
 * 从云端获取历史消息记录   
 * 
 * @param {String} nextMessageId - 下次拉取的开始ID    
 * @param {String} conversationId - 会话ID    
 * @param {Number} limit - 拉取数量，默认：20 
 * @return Promise
 */
function getHistoryMessageFromCloud(conversationId, nextMessageId = null, limit = 20) {

	return new Promise((resolve, reject) => {
		request(Api.Message.fetchHistoryMessageList, 'GET', {
			nextMessageId: (nextMessageId == null || nextMessageId == '') ? null : nextMessageId,
			conversationId: conversationId,
			limit: limit
		}).then((response) => {
			let result = {};
			let list = response.records;
			list = list.reverse();
			list.sort((a, b) => {
				return a.sequence - b.sequence;
			});
			result.list = list;
			if (response.nextMessageId) {
				result.nextMessageId = response.nextMessageId;
			}
			resolve(result);
		}).catch((fail) => {
			reject(fail);
		})
	});

}

/**
 *  
 * 从本地获取历史消息记录  
 * 
 * @param {String} conversationId - 会话ID         
 * @return {Array<Message>} MessageList
 */
function getMessageListFromLocal(conversationId) {
	let key = `yeim:messageList:${md5(instance.userId)}:conversationId:${md5(conversationId)}`;
	let result = getCache(key);
	result = result ? result : [];
	result.sort((a, b) => {
		return a.sequence - b.sequence;
	});
	return result;
}

/**
 *  
 * 删除某条消息 
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Message} message - 消息对象        
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function deleteMessage(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.message) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'message 不能为空');
	}

	if (!options.message.messageId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'message.messageId 不能为空');
	}

	request(Api.Message.deleteMessage, 'GET', {
		messageId: options.message.messageId
	}).then(() => {
		//云端消息删除后，本地修改消息记录 
		options.message.isDeleted = 1;
		saveMessage(options.message);
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, options.message);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 撤回消息 
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Message} message - 消息对象        
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function revokeMessage(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.message) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'message 不能为空');
	}

	if (!options.message.messageId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'message.messageId 不能为空');
	}

	request(Api.Message.revokeMessage, 'GET', {
		messageId: options.message.messageId
	}).then(() => {
		//消息撤回后，本地操作消息记录
		//修改消息为撤回
		options.message.isRevoke = 1;
		saveMessage(options.message);
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, options.message);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 响应撤回消息的处理事件 
 * 
 * @param {Message} message - 消息结构     
 *   
 */
function handleMessageRevoked(message) {
	let key = `yeim:messageList:${md5(instance.userId)}:conversationId:${md5(message.conversationId)}`;
	let list = getCache(key) ? getCache(key) : [];
	list = list ? list : [];
	let index = list.findIndex(item => {
		return item.messageId === message.messageId;
	});
	if (index !== -1) {
		list[index] = message;
		setCache(key, list);
	}
	emit(YeIMUniSDKDefines.EVENT.MESSAGE_REVOKED, message);
}


export {
	createTextMessage,
	createTextAtMessage,
	createImageMessage,
	createImageMessageFromUrl,
	createAudioMessage,
	createAudioMessageFromUrl,
	createVideoMessage,
	createVideoMessageFromUrl,
	createLocationMessage,
	createCustomMessage,
	createMergerMessage,
	createForwardMessage,
	sendMessage,
	saveMessage,
	getHistoryMessageList,
	revokeMessage,
	deleteMessage,
	handleMessageRevoked
}