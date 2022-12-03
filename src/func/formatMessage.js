import {
	instance
} from "../yeim-uni-sdk";
import log from './log';

/**
 * 生成消息ID
 */
// function createMessageId() {
// 	if (!instance.nextIdGen) {
// 		log(1, "分布式消息ID异常，请检查后端代码");
// 		return null;
// 	}
// 	return instance.nextIdGen + "-" + (new Date()).getTime();
// }

/**
 * 统一消息格式
 * @param {Object} params
 */
function formatMessage(params) {
	return {
		// 取消本地生成messageId，改为服务端统一调配
		// messageId: createMessageId(),
		conversationId: params.to, //会话ID
		conversationType: params.conversationType, //会话类型
		fromUserInfo: {
			nickname: instance.user.nickname,
			avatarUrl: instance.user.avatarUrl
		}, // 发送者用户信息
		from: instance.userId, //发送者ID
		to: params.to, //接收者ID
		type: params.type, //消息内容类型
		isRead: 0, //是否已读
		isRevoke: 0, //是否撤回
		isDeleted: 0, //是否删除
		status: 'unSend', //消息状态
		time: (new Date()).getTime(), //发送时间戳
		body: params.body, //消息体
		extra: params.extra ? params.extra : "" //自定义扩展数据
	}
}

export default formatMessage
