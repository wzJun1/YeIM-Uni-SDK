import {
	instance
} from "../yeim-uni-sdk";
import {
	YeIMUniSDKDefines
} from '../const/yeim-defines';
import {
	emit
} from '../func/event';
import log from '../func/log';
import md5 from '../utils/md5';
/**
 * 单个更新会话
 * 从socket端推送的会话更新
 * @param {Object} conversation
 */
function saveAndUpdateConversation(conversation) {
	let list = getConversationListFromLocal(1, 100000);
	let index = list.findIndex(item => {
		return item.conversationId === conversation.conversationId
	});
	if (index === -1) {
		list.unshift(conversation);
	} else {
		list.splice(index, 1);
		list.unshift(conversation);
	}
	saveConversationList(list);
}


/**
 * 从本地获取会话列表
 */
function getConversationListFromLocal(page = 1, limit = 20) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	let key = "yeim:conversationList:" + md5(instance.userId);
	let result = uni.getStorageSync(key);
	result = result ? result : [];
	let skipNum = (page - 1) * limit;
	let list = (skipNum + limit >= result.length) ? result.slice(skipNum, result.length) : result.slice(skipNum,
		skipNum + limit);
	return list;
}

/**
 * 从服务端获取会话列表
 */
function getConversationListFromCloud(page = 1, limit = 20) {
	uni.request({
		url: instance.defaults.baseURL + "/conversation/list",
		data: {
			page,
			limit,
		},
		method: 'GET',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			saveConversationList(res.data.data.records);
		},
		fail: (err) => {
			log(1, err);
		}
	});
}

/**
 * 保存会话并发送事件
 * @param {Object} list
 */
function saveConversationList(list) {
	let key = "yeim:conversationList:" + md5(instance.userId);
	uni.setStorageSync(key, list);
	emit(YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, list);
}

/**
 * 清除指定会话未读数
 * @param {Object} conversationId
 */
function clearConversationUnread(conversationId) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	let key = "yeim:conversationList:" + md5(instance.userId);
	let result = uni.getStorageSync(key);
	result = result ? result : [];
	let index = result.findIndex(item => {
		return item.conversationId === conversationId;
	});
	if (index !== -1) {
		result[index].unread = 0;
		uni.setStorageSync(key, result);
	}

	uni.request({
		url: instance.defaults.baseURL + "/conversation/update/unread",
		data: {
			conversationId: conversationId
		},
		method: 'GET',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {

		},
		fail: (err) => {
			log(1, err);
		}
	});
	emit(YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, result);
}

/**
 * 处理私聊会话已读回执
 * @param {Object} conversationId
 */
function handlePrivateConversationReadReceipt(conversationId) {
	if (!conversationId) {
		return log(1, "conversationId is null");
	}
	//查出当前会话发出到消息
	let messageKey = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(conversationId);
	let result = uni.getStorageSync(messageKey);
	result = result ? result : [];
	if (result) {
		let tempList = [];
		for (let i = 0; i < result.length; i++) {
			let message = result[i];
			if (message.direction == "out") {
				message.isRead = 1;
				result[i].isRead = 1;
				tempList.push(message);
			}
		}
		uni.setStorageSync(messageKey, result);
		//发送私聊会话已读事件
		emit(YeIMUniSDKDefines.EVENT.PRIVATE_READ_RECEIPT, {
			conversationId: conversationId,
			list: tempList
		});
	}
}

/**
 * 删除会话和会话里的聊天记录
 * @param {Object} conversationId
 */
function deleteConversation(conversationId) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	//1.删除本地会话
	let key = "yeim:conversationList:" + md5(instance.userId);
	let result = uni.getStorageSync(key);
	result = result ? result : [];
	let index = result.findIndex(item => {
		return item.conversationId === conversationId;
	});
	if (index !== -1) {
		result.splice(index, 1);
		uni.setStorageSync(key, result);
	}
	//2.删除本地会话内的聊天记录
	let messageKey = "yeim:messageList:" + md5(instance.userId) + ":conversationId:" + md5(conversationId);
	uni.removeStorageSync(messageKey);

	//3.删除云端会话和云端聊天记录
	uni.request({
		url: instance.defaults.baseURL + "/conversation/delete",
		data: {
			conversationId: conversationId
		},
		method: 'GET',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {

		},
		fail: (err) => {
			log(1, err);
		}
	});
	emit(YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, result);

}

export {
	saveAndUpdateConversation,
	clearConversationUnread,
	deleteConversation,
	getConversationListFromLocal,
	getConversationListFromCloud,
	handlePrivateConversationReadReceipt
}
