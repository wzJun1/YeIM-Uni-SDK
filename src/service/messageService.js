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
 * @param {Object|String} options.body - 自定义消息内容 
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

	if (!options.body) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, '自定义消息的 body 不能为空');
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.CUSTOM,
		conversationType: options.conversationType,
		body: options.body
	};
	//自定义消息数据
	if (options.extra) {
		params.extra = options.extra;
	}
	let message = formatMessage(params);
	return message;
}

/**
 * 发送消息统一入口
 * @description 为保证双方消息投递可靠性，发送消息使用http协议确保发送成功。
 * 
 * @param {Object} options
 * @param {Object} options.message @description 消息
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
 */

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
	if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.TEXT) {
		sendIMMessage(options);
	} else if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.IMAGE) {
		sendImageMessage(options);
	} else if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO) {
		sendVideoMessage(options);
	} else if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.AUDIO) {
		sendAudioMessage(options);
	} else if (message.type == YeIMUniSDKDefines.MESSAGE_TYPE.LOCATION) {
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
 * 发送aac语音消息 
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
	uploadVideo({
		filename: instance.token + '_video.mp4',
		filepath: message.body.videoUrl,
		success: (res) => {
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
		uni.setStorageSync(key, list);
	} else {
		//存在则更新
		list[index] = message;
		uni.setStorageSync(key, list);
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

	//判断是否存在上一次拉取的最后一条消息.
	//如果传入nextMessageId，则从此消息ID开始倒序查询消息记录，否则从最新一条开始查询  
	if (!options.nextMessageId) {
		//先查询本地消息
		let cacheList = getMessageListFromLocal(options.conversationId);
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
					uni.setStorageSync(key, result);
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
	} else {
		//传入了nextMessageId，从此消息ID开始倒序查询消息记录
		let nextMessageId = options.nextMessageId;
		//先从本地查，如果本地没有，直接从云端查
		let cacheList = getMessageListFromLocal(options.conversationId);
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
			conversationId: conversationId
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
 * 获取历史消息记录 
 * 
 * @deprecated 从1.1.7版本开始不再推荐使用此方法获取历史消息记录，请使用getHistoryMessageList
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Number} options.page - 页码    
 * @param {String} options.conversationId - 会话ID    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function getMessageList(options) {

	log(1, '从1.1.7版本开始不再推荐使用[getMessageList]获取历史消息记录，请使用[getHistoryMessageList]', true);

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.conversationId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationId 不能为空');
	}

	if (!options.page || !parseFloat(options.page)) {
		options.page = 1;
	}

	// limit 默认就是20个  
	//如果获取页码不是最新一页，那就直接走云端
	if (options.page != 1) {
		return getMessageListFromCloud(options, options.page);
	}

	//如果是最新一页，可以本地看看有没有
	//本地每个会话的消息缓存数量就只有20条，再多就加载云端的。
	//先取20条进行对比。
	let cacheList = getMessageListFromLocal(options.conversationId);
	if (cacheList.length <= 0) {
		//本地没有这个会话的任何消息记录，那么获取的时候直接从云端拉
		getMessageListFromCloud(options, options.page);
	} else {
		//本地有记录，开始对比 
		//1.获取当前会话的最新消息ID
		let key = "yeim:conversationList:" + md5(instance.userId);
		let result = uni.getStorageSync(key);
		result = result ? result : [];
		if (result <= 0) {
			//本地有这个会话的消息列表，但是本地没有任何会话。 
			return errHandle(options, YeIMUniSDKStatusCode.NORMAL_ERROR.code, "会话不存在");
		} else {
			//本地有会话，找出来当前会话
			let index = result.findIndex(item => {
				return item.conversationId === options.conversationId
			});
			if (index === -1) {
				//没找到当前会话 
				return errHandle(options, YeIMUniSDKStatusCode.NORMAL_ERROR.code, "会话不存在");
			} else {
				//找到了当前会话的最新消息ID，index是索引
				let conversation = result[index];
				let lastMessageId = conversation.lastMessage.messageId;
				// 2. 对比当前会话的最新消息ID，如果和缓存的最新一条消息ID相等，则直接拉本地，否则拉云端
				let cacheLastMessage = cacheList[cacheList.length - 1];
				if (lastMessageId == cacheLastMessage.messageId) {
					//相等，直接返回cacheList 
					return successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, cacheList);
				} else {
					//不相等，说明有新消息没同步，走一下云端
					getMessageListFromCloud(options, options.page);
				}
			}
		}
	}

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
	let result = uni.getStorageSync(key);
	result = result ? result : [];
	result.sort((a, b) => {
		return a.sequence - b.sequence;
	});
	return result;
}

/**
 *  
 * @deprecated 从1.1.7版本开始不再推荐使用此方法
 * 
 * 从云端获取历史消息记录 
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {Number} options.page - 页码    
 * @param {String} options.conversationId - 会话ID    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function getMessageListFromCloud(options, page = 1) {

	uni.request({
		url: instance.defaults.baseURL + "/message/list",
		data: {
			page,
			conversationId: options.conversationId
		},
		method: 'GET',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				let list = res.data.data.records;
				list = list.reverse();
				list.sort((a, b) => {
					return a.sequence - b.sequence;
				});
				successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, list);
				//如果是从云端拉取最新一页消息，就存入缓存
				if (page == 1) {
					let key = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(options
						.conversationId);
					uni.setStorageSync(key, list);
				}
			} else {
				errHandle(options, res.data.code, res.data.message);
			}
		},
		fail: (err) => {
			errHandle(options, YeIMUniSDKStatusCode.NORMAL_ERROR.code, err);
			log(1, err);
		}
	});
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
	let list = uni.getStorageSync(key) ? uni.getStorageSync(key) : [];
	list = list ? list : [];
	let index = list.findIndex(item => {
		return item.messageId === message.messageId;
	});
	if (index !== -1) {
		list[index] = message;
		uni.setStorageSync(key, list);
	}
	emit(YeIMUniSDKDefines.EVENT.MESSAGE_REVOKED, message);
}


export {
	createTextMessage,
	createImageMessage,
	createAudioMessage,
	createVideoMessage,
	createLocationMessage,
	createCustomMessage,
	sendMessage,
	saveMessage,
	getMessageList,
	getHistoryMessageList,
	revokeMessage,
	deleteMessage,
	handleMessageRevoked
}
