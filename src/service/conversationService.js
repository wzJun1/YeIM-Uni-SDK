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

export {
	saveAndUpdateConversation,
	getConversationListFromLocal,
	getConversationListFromCloud
}
