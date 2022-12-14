import {
	instance
} from "../yeim-uni-sdk";

import {
	YeIMUniSDKDefines
} from '../const/yeim-defines';

import {
	uploadImage,
	uploadAudio,
	uploadVideo
} from './uploadService';

import {
	buildSuccessObject,
	buildErrObject,
	successHandle,
	errHandle
} from '../func/callback';

import md5 from '../utils/md5';

import formatMessage from '../func/formatMessage';

import CryptoJS from '../utils/CryptoJS';

import log from '../func/log';

/**
 * 创建文本消息
 * 
 * @param {Object} options
 * @param {String} options.toId @description 接受者用户ID
 * @param {String} options.conversationType @description 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {String} options.body.text @description 需要发送的文本消息内容
 * 
 * @return Message
 */
function createTextMessage(options) {

	if (!instance.userId) {
		return buildErrObject("请登陆后再调用此接口");
	}

	if (options == null || !options.toId) {
		return buildErrObject("toId 不能为空");
	}

	if (!options.conversationType) {
		return buildErrObject("conversationType 不能为空");
	}

	if (!options.body || !options.body.text) {
		return buildErrObject("text 不能为空");
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
 * @description 仅支持单张图片
 * 
 * @param {Object} options
 * @param {String} options.toId @description 接受者用户ID
 * @param {String} options.conversationType @description 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {String} options.body.file.tempFilePath @description 本地图片文件临时路径
 * @param {Number} options.body.file.width @description 图片宽度
 * @param {Number} options.body.file.height @description 图片高度
 * 
 * @return Message
 */
function createImageMessage(options) {

	if (!instance.userId) {
		return buildErrObject("请登陆后再调用此接口");
	}

	if (options == null || !options.toId) {
		return buildErrObject("toId 不能为空");
	}

	if (!options.conversationType) {
		return buildErrObject("conversationType 不能为空");
	}

	if (!options.body || !options.body.file) {
		return buildErrObject("file 不能为空");
	}

	if (!options.body.file.tempFilePath) {
		return buildErrObject("tempFilePath 不能为空");
	}

	if (!options.body.file.width) {
		return buildErrObject("width 不能为空");
	}

	if (!options.body.file.height) {
		return buildErrObject("height 不能为空");
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
	if (options.onProgress !== undefined && typeof options.onProgress === "function") {
		message.onProgress = options.onProgress;
	}
	return message;
}

/**
 * 创建位置消息
 * 
 * @param {Object} options
 * @param {String} options.toId @description 接受者用户ID
 * @param {String} options.conversationType @description 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {String} options.body.address @description 地址名称
 * @param {String} options.body.description @description 地址详细描述
 * @param {Double} options.body.longitude @description 经度
 * @param {Double} options.body.latitude @description 纬度
 * 
 * @return Message
 */
function createLocationMessage(options) {

	if (!instance.userId) {
		return buildErrObject("请登陆后再调用此接口");
	}

	if (options == null || !options.toId) {
		return buildErrObject("toId 不能为空");
	}

	if (!options.conversationType) {
		return buildErrObject("conversationType 不能为空");
	}

	if (!options.body.address) {
		return buildErrObject("address 不能为空");
	}

	if (!options.body.description) {
		return buildErrObject("description 不能为空");
	}

	if (!options.body.longitude) {
		return buildErrObject("longitude 不能为空");
	}

	if (!options.body.latitude) {
		return buildErrObject("latitude 不能为空");
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
 * @param {Object} options
 * @param {String} options.toId @description 接受者用户ID
 * @param {String} options.conversationType @description 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {String} options.body.file.tempFilePath @description 本地音频文件临时路径
 * @param {String} options.body.file.duration @description 音频时长，单位秒
 * 
 * @return Message
 */
function createAudioMessage(options) {

	if (!instance.userId) {
		return buildErrObject("请登陆后再调用此接口");
	}

	if (options == null || !options.toId) {
		return buildErrObject("toId 不能为空");
	}

	if (!options.conversationType) {
		return buildErrObject("conversationType 不能为空");
	}

	if (!options.body || !options.body.file) {
		return buildErrObject("file 不能为空");
	}

	if (!options.body.file.tempFilePath) {
		return buildErrObject("tempFilePath 不能为空");
	}

	if (!options.body.file.duration) {
		return buildErrObject("duration 不能为空");
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
	if (options.onProgress !== undefined && typeof options.onProgress === "function") {
		message.onProgress = options.onProgress;
	}
	return message;
}

/**
 * 创建小视频消息
 * 
 * @param {Object} options
 * @param {String} options.toId @description 接受者用户ID
 * @param {String} options.conversationType @description 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {String} options.body.file.tempFilePath @description 本地小视频文件临时路径
 * @param {Number} options.body.file.width @description 视频宽度
 * @param {Number} options.body.file.height @description 视频高度
 * 
 * @return Message
 */
function createVideoMessage(options) {

	if (!instance.userId) {
		return buildErrObject("请登陆后再调用此接口");
	}

	if (options == null || !options.toId) {
		return buildErrObject("toId 不能为空");
	}

	if (!options.conversationType) {
		return buildErrObject("conversationType 不能为空");
	}

	if (!options.body || !options.body.file) {
		return buildErrObject("file 不能为空");
	}

	if (!options.body.file.tempFilePath) {
		return buildErrObject("tempFilePath 不能为空");
	}

	if (!options.body.file.width) {
		return buildErrObject("width 不能为空");
	}

	if (!options.body.file.height) {
		return buildErrObject("height 不能为空");
	}

	let params = {
		to: options.toId,
		type: YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO,
		conversationType: options.conversationType,
		body: {
			videoUrl: options.body.file.tempFilePath,
			thumbnailUrl: null,
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
 * @description 自定义消息内容放在body字段
 * 
 * @param {Object} options
 * @param {String} options.toId @description 接受者用户ID
 * @param {String} options.conversationType @description 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
 * @param {String|Object} options.body @description 自定义消息内容
 *  
 * @return Message
 */
function createCustomMessage(options) {

	if (!instance.userId) {
		return buildErrObject("请登陆后再试");
	}

	if (options == null || !options.toId) {
		return buildErrObject("toId 不能为空");

	}

	if (!options.conversationType) {
		return buildErrObject("conversationType 不能为空");
	}

	if (!options.body) {
		return buildErrObject("自定义消息的 body 不能为空");
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
function sendMessage(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.message) {
		return errHandle(options, "message 不能为空");
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
 * 发送普通文本消息
 * 
 * @param {Object} options
 * @param {Object} options.message @description 消息
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
 */
function sendIMMessage(options) {
	let message = options.message;
	uni.request({
		url: instance.defaults.baseURL + "/message/save",
		data: message,
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				//消息保存到YeIMServer成功
				let result = res.data.data;
				//保存消息到本地
				saveMessage(result);
				//发送成功回调
				successHandle(options, '接口调用成功', result);
			} else {
				errHandle(options, res.data.message);
			}
		},
		fail: (err) => {
			errHandle(options, err);
		}
	});
}

/**
 * 发送图片消息
 * 
 * @param {Object} options
 * @param {Object} options.message @description 消息
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
 */
function sendImageMessage(options) {
	let message = options.message;
	uploadImage({
		filename: instance.token + "_image.png",
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
			log(1, err);
		},
		onProgress: (progress) => {
			if (message.onProgress !== undefined && typeof message.onProgress === "function") {
				message.onProgress(progress);
			}
		}
	})
}

/**
 * 发送aac语音消息
 *  
 * @param {Object} options
 * @param {Object} options.message @description 消息
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
 */
function sendAudioMessage(options) {
	let message = options.message;
	uploadAudio({
		filename: instance.token + "_audio.aac",
		filepath: message.body.audioUrl,
		success: (res) => {
			let resultUrl = res.data.url;
			message.body.audioUrl = resultUrl;
			options.message = message;
			sendIMMessage(options);
		},
		fail: (err) => {
			log(1, err);
		},
		onProgress: (progress) => {
			if (message.onProgress !== undefined && typeof message.onProgress === "function") {
				message.onProgress(progress);
			}
		}
	})
}


/**
 * 发送小视频消息
 * 
 * @param {Object} options
 * @param {Object} options.message @description 消息
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
 */
function sendVideoMessage(options) {
	let message = options.message;
	uploadVideo({
		filename: instance.token + "_video.mp4",
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
			log(1, err);
		},
		onProgress: (progress) => {
			if (message.onProgress !== undefined && typeof message.onProgress === "function") {
				message.onProgress(progress);
			}
		}
	})
}

/**
 * 保存消息到本地
 * 
 * @param {Object} message
 */
function saveMessage(message) {
	if (!message.conversationId) {
		return log(1, "message.conversationId 不能为空");
	}
	let list = getMessageListFromLocal(message.conversationId);
	let index = list.findIndex(item => {
		return item.messageId === message.messageId
	});
	let key = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(message.conversationId);
	//不存在插入
	if (index === -1) {
		list.push(message);
		uni.setStorageSync(key, list);
	} else {
		//存在则更新
		list[index] = message;
		uni.setStorageSync(key, list);
	}
}

/**
 * 获取历史消息记录
 * 
 * @param {Object} options
 * @param {Number} options.page @description 页码 @default 1
 * @param {String} options.conversationId @description 会话ID
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
 */
function getMessageList(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.conversationId) {
		return errHandle(options, "conversationId 不能为空")
	}

	if (!options.page || !parseFloat(options.page)) {
		options.page = 1;
	}

	// limit 默认就是20个  
	//如果获取页码不是最新一页，那就直接走缓存
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
			return errHandle(options, "会话不存在");
		} else {
			//本地有会话，找出来当前会话
			let index = result.findIndex(item => {
				return item.conversationId === options.conversationId
			});
			if (index === -1) {
				//没找到当前会话 
				return errHandle({
					code: 500,
					message: "会话不存在"
				}, options);
			} else {
				//找到了当前会话的最新消息ID，index是索引
				let conversation = result[index];
				let lastMessageId = conversation.lastMessage.messageId;
				// 2. 对比当前会话的最新消息ID，如果和缓存的最新一条消息ID相等，则直接拉本地，否则拉云端
				let cacheLastMessage = cacheList[cacheList.length - 1];
				if (lastMessageId == cacheLastMessage.messageId) {
					//相等，直接返回cacheList 
					return successHandle(options, '接口调用成功', cacheList);
				} else {
					//不相等，说明有新消息没同步，走一下云端
					getMessageListFromCloud(options, options.page);
				}
			}
		}
	}

}

/**
 * 从本地缓存获取历史消息记录
 * 
 * @param {String} conversationId @description 会话ID
 */
function getMessageListFromLocal(conversationId) {
	let key = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(conversationId);
	let result = uni.getStorageSync(key);
	result = result ? result : [];
	result.sort((a, b) => {
		return a.sequence - b.sequence;
	});
	return result;
}

/**
 * 从Server获取历史消息记录
 * 
 * @param {Object} options
 * @param {Number} page @description 页码 @default 1
 * @param {Object} options.conversationId @description 会话ID
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
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
				successHandle(options, "接口调用成功", list);
				//如果是从云端拉取最新一页消息，就存入缓存
				if (page == 1) {
					let key = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(options
						.conversationId);
					uni.setStorageSync(key, list);
				}
			} else {
				errHandle(options, res.data.message);
			}
		},
		fail: (err) => {
			errHandle(options, err);
			log(1, err);
		}
	});
}

/**
 * 撤回消息
 * 
 * @param {Object} options
 * @param {Message} message @description 消息
 * @param {Function} options.success @description 成功回调
 * @param {Function} options.fail @description 失败回调
 */
function revokeMessage(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.message) {
		return errHandle(options, "message 不能为空")
	}

	if (!options.message.messageId) {
		return errHandle(options, "message.messageId 不能为空")
	}

	if (!options.message.conversationId) {
		return errHandle(options, "message.conversationId 不能为空")
	}

	uni.request({
		url: instance.defaults.baseURL + "/message/revoke",
		data: {
			messageId: options.message.messageId
		},
		method: 'GET',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			//消息撤回后，本地操作消息记录
			//修改消息为撤回
			if (res.data.code == 200) {
				options.message.isRevoke = 1;
				saveMessage(options.message);
				successHandle(options, "撤回成功", options.message);
			} else {
				errHandle(options, res.data.message);
			}
		},
		fail: (err) => {
			log(1, err);
			errHandle(options, err);
		}
	});
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
	revokeMessage
}
