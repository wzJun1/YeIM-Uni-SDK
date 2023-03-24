//SDK常量

var YeIMUniSDKDefines = {};

//事件类型
YeIMUniSDKDefines.EVENT = {};
YeIMUniSDKDefines.EVENT.NET_CHANGED = "net_changed"; //网络状态变化
YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED = "conversation_list_changed"; // 会话列表变化
YeIMUniSDKDefines.EVENT.MESSAGE_RECEIVED = "message_received"; // 收到消息
YeIMUniSDKDefines.EVENT.MESSAGE_REVOKED = "message_revoked"; // 撤回消息 
YeIMUniSDKDefines.EVENT.PRIVATE_READ_RECEIPT = "private_read_receipt"; //私聊会话已读回执
YeIMUniSDKDefines.EVENT.KICKED_OUT = "kicked_out"; //用户被踢下线

//会话类型
YeIMUniSDKDefines.CONVERSATION_TYPE = {};
YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 'private'; //私聊
YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 'group'; //群聊

//消息类型
YeIMUniSDKDefines.MESSAGE_TYPE = {};
YeIMUniSDKDefines.MESSAGE_TYPE.TEXT = 'text'; //文本消息
YeIMUniSDKDefines.MESSAGE_TYPE.TEXT_AT = 'text_at'; //文本@消息
YeIMUniSDKDefines.MESSAGE_TYPE.IMAGE = 'image'; //图片消息
YeIMUniSDKDefines.MESSAGE_TYPE.AUDIO = 'audio'; //语音消息
YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO = 'video'; //小视频消息
YeIMUniSDKDefines.MESSAGE_TYPE.LOCATION = 'location'; //位置消息
YeIMUniSDKDefines.MESSAGE_TYPE.CUSTOM = 'custom'; //自定义消息
YeIMUniSDKDefines.MESSAGE_TYPE.MERGER = 'merger'; //合并消息
YeIMUniSDKDefines.MESSAGE_TYPE.FORWARD = 'forward'; //转发消息 
YeIMUniSDKDefines.MESSAGE_TYPE.GROUP_SYS_NOTICE = 'group_sys_notice'; //群聊系统通知

//群组
YeIMUniSDKDefines.GROUP = {};

//群申请处理方式 
YeIMUniSDKDefines.GROUP.JOINMODE = {};
YeIMUniSDKDefines.GROUP.JOINMODE.FREE = 1; //自有加入，不需要申请和审核，不需要被邀请人允许。
YeIMUniSDKDefines.GROUP.JOINMODE.CHECK = 2; //验证加入，需要申请，以及群主或管理员的同意才能入群
YeIMUniSDKDefines.GROUP.JOINMODE.FORBIDDEN = 3; //禁止加入

//入群申请处理结果
YeIMUniSDKDefines.GROUP.APPLYSTATUS = {};
YeIMUniSDKDefines.GROUP.APPLYSTATUS.PENDING = 1; //待处理
YeIMUniSDKDefines.GROUP.APPLYSTATUS.AGREE = 2; //同意
YeIMUniSDKDefines.GROUP.APPLYSTATUS.REFUSE = 3; //拒绝

export {
	YeIMUniSDKDefines
};
