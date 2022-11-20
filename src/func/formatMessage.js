import {
	instance
} from "../yeim-uni-sdk";

/**
 * 生成消息ID
 */
function createMessageId() {
	let min = 10000000;
	let max = 99999999;
	let range = max - min;
	let random = Math.random();
	let rand = (min + Math.round(random * range));
	return (new Date()).getTime() + "-" + instance.genid.NextId() + "-" + rand;
}

/**
 * 统一消息格式
 * @param {Object} params
 */
function formatMessage(params) {
	return {
		messageId: createMessageId(),
		conversationId: params.to,
		conversationType: params.conversationType,
		fromUserInfo: {
			nickname: instance.user.nickname,
			avatarUrl: instance.user.avatarUrl
		},
		from: instance.userId,
		to: params.to,
		type: params.type,
		isRead: false,
		isRecall: false,
		status: 'unSend',
		time: (new Date()).getTime(),
		body: params.body
	}
}

export default formatMessage
