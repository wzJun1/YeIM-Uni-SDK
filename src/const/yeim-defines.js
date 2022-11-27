//事件名称
var YeIMUniSDKDefines = {};
YeIMUniSDKDefines.EVENT = {};
YeIMUniSDKDefines.EVENT.NET_CHANGED = "net_changed"; //网络状态变化
YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED = "conversation_list_changed"; // 会话列表变化
YeIMUniSDKDefines.EVENT.MESSAGE_RECEIVED = "message_received"; // 收到消息
YeIMUniSDKDefines.EVENT.KICKED_OUT = "kicked_out"; //用户被踢下线

//会话类型
YeIMUniSDKDefines.CONVERSATION_TYPE = {};
YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 'private'; //私聊
YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 'group'; //群聊

//消息类型
YeIMUniSDKDefines.MESSAGE_TYPE = {};
YeIMUniSDKDefines.MESSAGE_TYPE.TEXT = 'text'; //文本消息
YeIMUniSDKDefines.MESSAGE_TYPE.IMAGE = 'image'; //图片消息
YeIMUniSDKDefines.MESSAGE_TYPE.AUDIO = 'audio'; //语音消息
YeIMUniSDKDefines.MESSAGE_TYPE.VIDEO = 'video'; //小视频消息
YeIMUniSDKDefines.MESSAGE_TYPE.LOCATION = 'location'; //位置消息
YeIMUniSDKDefines.MESSAGE_TYPE.CUSTOM = 'custom'; //自定义消息

export {
	YeIMUniSDKDefines
};
