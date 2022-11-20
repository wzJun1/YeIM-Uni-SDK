import {
	instance
} from "../yeim-uni-sdk";

import {
	YeIMUniSDKDefines
} from '../const/yeim-defines';

import {
	buildSuccessObject,
	buildErrObject,
	successHandle,
	errHandle
} from '../func/callback';

import md5 from '../utils/md5';

import formatMessage from '../func/formatMessage';

/**
 * 创建文本消息
 * @param {Object} options
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
	let message = formatMessage(params);
	return message;
}

/**
 * 创建自定义消息
 * @param {Object} options
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
	let message = formatMessage(params);
	return message;
}

/**
 * 发送消息统一入口
 * @param {Object} options
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
		sendTextMessage(options);
	}
}

/**
 * 发送普通文本消息
 * @param {Object} options
 */
function sendTextMessage(options) {
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
			//消息保存到YeIMServer成功
			let result = res.data.data;
			//保存消息到本地
			saveMessage(result);
			//发送成功回调
			successHandle(options, '接口调用成功', result);
		},
		fail: (err) => {
			errHandle(options, err);
		}
	});
}

/**
 * 保存消息
 * @param {Object} message
 */
function saveMessage(message) {
	let list = getMessageListFromLocal(message.conversationId);
	let index = list.findIndex(item => {
		return item.messageId === message.messageId
	});
	if (index === -1) {
		list.push(message);
		let key = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(message.conversationId);
		uni.setStorageSync(key, list);
	}
}

/**
 * 获取历史消息
 * @param {Object} options
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
 * 从本地获取消息记录
 */
function getMessageListFromLocal(conversationId) {
	let key = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(conversationId);
	let result = uni.getStorageSync(key);
	result = result ? result : [];
	return result;
}

/**
 * 从服务端获取会话列表
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
			console.log(res)
			let list = res.data.data.records;
			list = list.reverse();
			successHandle(options, "接口调用成功", list);
			//如果是从云端拉取最新一页消息，就存入缓存
			if (page == 1) {
				let key = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(options
					.conversationId);
				uni.setStorageSync(key, list);
			}
		},
		fail: (err) => {
			errHandle(options, err);
			log(1, err);
		}
	});
}

export {
	createTextMessage,
	createCustomMessage,
	sendMessage,
	saveMessage,
	getMessageList
}
