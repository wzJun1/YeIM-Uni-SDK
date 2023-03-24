import {
	instance
} from '../yeim-uni-sdk';
import {
	YeIMUniSDKDefines
} from '../const/yeim-defines';
import {
	emit
} from '../func/event';
import log from '../func/log';
import md5 from '../utils/md5';
import {
	buildSuccessObject,
	buildErrObject,
	successHandle,
	errHandle
} from '../func/callback';
import {
	YeIMUniSDKStatusCode
} from '../const/yeim-status-code';
import {
	Api,
	request
} from '../func/request';
import { getCache, removeCache, setCache } from '../func/storage';


/**
 * 更新、保存单个会话到本地会话列表、发送会话列表更新事件
 * 
 * @param {Conversation} conversation - 会话对象
 * @return {void}
 */
function saveAndUpdateConversation(conversation) {

	let key = `yeim:conversationList:${md5(instance.userId)}`;
	let list = getCache(key);
	list = list ? list : [];
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
 * 根据会话ID获取本地会话详情
 * 
 * @param {String} conversationId - 会话ID
 * @return {Conversation} conversation
 */
function getConversation(conversationId) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}
	if (!conversationId) {
		return buildErrObject(YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'conversationId 不能为空');
	}
	let key = `yeim:conversationList:${md5(instance.userId)}`;
	let result = getCache(key);
	result = result ? result : [];
	let index = result.findIndex(item => {
		return item.conversationId === conversationId;
	});
	if (index !== -1) {
		return buildSuccessObject(YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result[index]);
	} else {
		return buildErrObject(YeIMUniSDKStatusCode.NO_CONVERSATION.code, YeIMUniSDKStatusCode.NO_CONVERSATION.describe);
	}

}

/**
 * 获取本地会话列表
 * 
 * @param {Object} options - 参数对象   
 *   
 * @param {String} options.page - 页码
 * @param {String} options.limit - 每页数量
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调  
 */
function getConversationList(options) {
	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}
	let page = options.page;
	let limit = options.limit;
	let key = `yeim:conversationList:${md5(instance.userId)}`;
	let result = getCache(key);
	result = result ? result : [];
	let skipNum = (page - 1) * limit;
	let list = (skipNum + limit >= result.length) ? result.slice(skipNum, result.length) : result.slice(skipNum,
		skipNum + limit);
	successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, list);
}

/**
 * 从云端获取会话列表保存到本地、并发送会话列表更新事件
 * 
 * @return {void}
 */
function saveCloudConversationListToLocal() {

	request(Api.Conversation.fetchConversationList, 'GET', {
		page: 1,
		limit: 999999,
	}).then((result) => {
		//查询结果保存到本地
		saveConversationList(result.records);
	}).catch((fail) => {
		log(1, fail);
	});

}

/**
 * 保存会话列表到本地，并发送会话更新事件
 * 
 * @param {Array<Conversation>} list - 会话对象数组
 * @return {void}
 */
function saveConversationList(list) {
	let key = `yeim:conversationList:${md5(instance.userId)}`;
	setCache(key, list);
	emit(YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, list);
}

/**
 * 清除指定会话未读数
 * 
 * 云端同时发送给对端已读事件（私聊）
 * 
 * @param {String} conversationId - 会话ID
 * @return {void}
 */
function clearConversationUnread(conversationId) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	//本地清除会话未读数
	let key = `yeim:conversationList:${md5(instance.userId)}`;
	let result = getCache(key);
	result = result ? result : [];
	let index = result.findIndex(item => {
		return item.conversationId === conversationId;
	});
	if (index !== -1) {
		result[index].unread = 0;
		setCache(key, result);
	}
	//云端清除会话未读数
	request(Api.Conversation.clearConversationUnread, "GET", {
		conversationId: conversationId
	}).then(() => { }).catch((fail) => {
		log(1, fail);
	});
	//发送会话列表更新事件
	emit(YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, result);

}

/**
 * 收到某对端会话消息已读事件，处理本地会话消息已读字段，并发送给当前用户对端会话已读事件 
 * 
 * @param {Object} conversationId
 * @return {void}
 */
function handlePrivateConversationReadReceipt(conversationId) {

	if (!conversationId) {
		return log(1, 'conversationId 为空，无法继续执行');
	}
	//查出当前会话发出的消息 
	let messageKey = `yeim:messageList:${md5(instance.userId)}:conversationId:${md5(conversationId)}`;
	let result = getCache(messageKey);
	result = result ? result : [];
	if (result) {
		let tempList = [];
		for (let i = 0; i < result.length; i++) {
			let message = result[i];
			if (message.direction == 'out') {
				message.isRead = 1;
				result[i].isRead = 1;
				tempList.push(message);
			}
		}
		setCache(messageKey, result);
		//发送私聊会话已读事件
		emit(YeIMUniSDKDefines.EVENT.PRIVATE_READ_RECEIPT, {
			conversationId: conversationId,
			list: tempList
		});
	}

}

/**
 * 根据会话ID删除会话和聊天记录（包括云端）
 * 
 * @param {Object} conversationId
 * @return {void}
 */
function deleteConversation(conversationId) {

	if (!instance.checkLogged()) {
		return buildErrObject(YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	//1.删除本地会话
	let key = `yeim:conversationList:${md5(instance.userId)}`;
	let result = getCache(key);
	result = result ? result : [];
	let index = result.findIndex(item => {
		return item.conversationId === conversationId;
	});
	if (index !== -1) {
		result.splice(index, 1);
		setCache(key, result);
	}
	//2.删除本地会话内的聊天记录 
	let messageKey = `yeim:messageList:${md5(instance.userId)}:conversationId:${md5(conversationId)}`;
	removeCache(messageKey);

	//3.删除云端会话和云端聊天记录 
	request(Api.Conversation.deleteConversation, 'GET', {
		conversationId: conversationId
	}).then(() => { }).catch((fail) => {
		log(1, fail);
	});

	//4.发出会话列表更新事件
	emit(YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, result);

}

export {
	saveAndUpdateConversation,
	clearConversationUnread,
	deleteConversation,
	getConversation,
	getConversationList,
	saveCloudConversationListToLocal,
	handlePrivateConversationReadReceipt
}
