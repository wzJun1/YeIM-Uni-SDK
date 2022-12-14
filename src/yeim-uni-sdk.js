import {
	YeIMUniSDKDefines
} from './const/yeim-defines';
import {
	successHandle,
	errHandle
} from './func/callback';
import {
	emit,
	addEventListener,
	removeEventListener
} from './func/event';
import log from './func/log';
import {
	createTextMessage,
	createImageMessage,
	createAudioMessage,
	createLocationMessage,
	createVideoMessage,
	createCustomMessage,
	sendMessage,
	saveMessage,
	getMessageList,
	revokeMessage
} from './service/messageService'
import {
	deleteConversation,
	saveAndUpdateConversation,
	clearConversationUnread,
	getConversation,
	getConversationList,
	getConversationListFromLocal,
	getConversationListFromCloud,
	handlePrivateConversationReadReceipt
} from './service/conversationService'

import {
	createGroup,
	dissolveGroup,
	getGroup,
	getGroupList,
	transferLeader,
	updateGroup,
	joinGroup,
	leaveGroup,
	addGroupUsers,
	removeGroupUsers,
	setAdminstrator,
	getGroupApplyList,
	getGroupUserList,
	handleApply,
	setMute
} from './service/groupService'

import {
	getMediaUploadParams,
	upload,
} from './service/uploadService'
import {
	getUserInfo,
	updateUserInfo
} from './service/userService'

/**
 * SDK实例
 */
let instance;

class YeIMUniSDK {

	constructor(options = {}) {
		//全局配置参数
		this.defaults = {
			//事件前缀
			eventPrefix: 'YeIM_',
			// 最大重连次数，0不限制一直重连
			reConnectTotal: 15,
			// 重连时间间隔
			reConnectInterval: 3000,
			//心跳时间间隔(默认30s)
			heartInterval: 30000,
			/**
			 * 	日志等级
			 *  0 普通日志，日志量较多，接入时建议使用
			 *	1 关键性日志，日志量较少，生产环境时建议使用 
			 *	2 无日志级别，SDK 将不打印任何日志
			 */
			logLevel: 0,
			//IM参数
			...options
		};

		//版本号
		this.version = "1.1.0";

		//是否首次连接
		this.firstConnect = true;
		//socketTask
		this.socketTask = undefined;
		//是否已登陆YeIMServer
		this.socketLogged = false;

		//是否允许重连
		this.allowReconnect = true;
		//重连锁，防止多重调用
		this.lockReconnect = false;
		//重连次数
		this.reConnectNum = 0;
		//连接定时器
		this.connectTimer = undefined;
		//心跳定时器
		this.heartTimer = null;
		//检测定时器
		this.checkTimer = null;

		//用户信息
		this.user = {};
		//用户ID
		this.userId = undefined;
		//登陆token
		this.token = undefined;

		//媒体上传参数
		this.mediaUploadParams = {};

	}

	/**
	 * 初始化SDK
	 * @param options 配置项
	 * @returns YeIMUniSDK实例化对象
	 */
	static init(options = {}) {
		if (instance) {
			return instance;
		}
		instance = new YeIMUniSDK(options);
		YeIMUniSDK.prototype.createTextMessage = createTextMessage; //创建文字消息
		YeIMUniSDK.prototype.createImageMessage = createImageMessage; //创建图片消息
		YeIMUniSDK.prototype.createAudioMessage = createAudioMessage; //创建语音消息
		YeIMUniSDK.prototype.createVideoMessage = createVideoMessage; //创建小视频消息
		YeIMUniSDK.prototype.createLocationMessage = createLocationMessage; //创建位置消息
		YeIMUniSDK.prototype.createCustomMessage = createCustomMessage; //创建自定义消息
		YeIMUniSDK.prototype.upload = upload; //通用上传接口
		YeIMUniSDK.prototype.sendMessage = sendMessage; //发送消息统一接口
		YeIMUniSDK.prototype.getMessageList = getMessageList; //获取历史消息记录（本地默认只存取每个会话的最新20条记录，剩余记录均从云端拉取）
		YeIMUniSDK.prototype.revokeMessage = revokeMessage; //撤回消息
		YeIMUniSDK.prototype.getConversation = getConversation; //获取会话详情
		YeIMUniSDK.prototype.getConversationList = getConversationList; //获取会话列表
		YeIMUniSDK.prototype.clearConversationUnread = clearConversationUnread; //清除指定会话未读数
		YeIMUniSDK.prototype.deleteConversation = deleteConversation; //删除指定会话和聊天记录
		YeIMUniSDK.prototype.getUserInfo = getUserInfo; //获取用户资料
		YeIMUniSDK.prototype.updateUserInfo = updateUserInfo; //更新用户昵称和头像
		YeIMUniSDK.prototype.addEventListener = addEventListener; //设置监听器
		YeIMUniSDK.prototype.removeEventListener = removeEventListener; //移除监听器

		YeIMUniSDK.prototype.createGroup = createGroup; //创建群组
		YeIMUniSDK.prototype.dissolveGroup = dissolveGroup; //解散群组
		YeIMUniSDK.prototype.updateGroup = updateGroup; //更新群组资料
		YeIMUniSDK.prototype.getGroup = getGroup; //获取群组资料
		YeIMUniSDK.prototype.transferLeader = transferLeader; //转让群主
		YeIMUniSDK.prototype.getGroupList = getGroupList; //获取我的群组列表

		YeIMUniSDK.prototype.joinGroup = joinGroup; //申请入群
		YeIMUniSDK.prototype.leaveGroup = leaveGroup; //退出群组
		YeIMUniSDK.prototype.addGroupUsers = addGroupUsers; //添加群成员
		YeIMUniSDK.prototype.getGroupUserList = getGroupUserList; //获取群成员列表
		YeIMUniSDK.prototype.removeGroupUsers = removeGroupUsers; //移除群成员
		YeIMUniSDK.prototype.setAdminstrator = setAdminstrator; //设置群管理员
		YeIMUniSDK.prototype.setMute = setMute; //禁言群成员

		YeIMUniSDK.prototype.getGroupApplyList = getGroupApplyList; //获取名下群组用户入群申请列表
		YeIMUniSDK.prototype.handleApply = handleApply; //处理入群申请


		log(1, "============= YeIMUniSDK 初始化成功！版本号：" + instance.version + " =============");
		return instance;
	}

	/**
	 * 获取SDK实例化对象
	 */
	static getInstance() {
		if (instance) {
			return instance;
		}
		return null;
	}

	/**
	 * 连接YeIMServer
	 * @param options 配置项
	 * @returns YeIMUniSDK实例化对象
	 */
	connect(options = {}) {

		if (!options.userId) {
			return errHandle(options, "userId 不能为空");
		}

		if (!options.token) {
			return errHandle(options, "token 不能为空");
		}

		//首次连接成功后，设置websocket相关监听
		if (this.firstConnect) {
			uni.onSocketOpen(this.socketOpen.bind(this));
			uni.onSocketError(this.socketError.bind(this));
			uni.onSocketClose(this.socketClose.bind(this));
			uni.onSocketMessage(this.socketMessage.bind(this));
		}

		//拼接websocket连接url
		let url = this.defaults.socketURL + "/" + options.userId + "/" + options.token;
		//创建websocket连接
		this.socketTask = uni.connectSocket({
			url: url,
			success: (res) => {
				console.log("connectSocket success：")
				console.log(res)
			},
			fail: (err) => {
				console.log("connectSocket fail：")
				console.log(err)
			},
			complete: () => {}
		});
		//连接后，设置首次连接（firstConnect）为false
		this.firstConnect = false;

		//连接异常
		if (this.connectTimer) {
			clearTimeout(this.connectTimer);
			this.connectTimer = undefined;
		}
		this.connectTimer = setTimeout(() => {
			this.connectTimer = undefined;
			log(1, "连接服务端失败，请检查配置");
			return errHandle(options, "网络异常，请稍后重试");
		}, this.defaults.reConnectInterval + 1000);

		//临时设置监听onMessage
		this.socketTask.onMessage((res) => {
			if (this.socketLogged) {
				clearTimeout(this.connectTimer);
				this.connectTimer = undefined;
				return;
			}
			clearTimeout(this.connectTimer);
			this.connectTimer = undefined;
			let data = JSON.parse(res.data);
			//监听到登陆成功
			if (data.code == 201) {
				//移除临时监听
				this.socketTask.onMessage(() => {});
				//设置用户相关参数
				let user = data.data.user;
				this.user = user;
				this.userId = options.userId;
				this.token = options.token;
				//设置socket state（socketLogged）登陆成功
				this.socketLogged = true;
				this.reConnectNum = 0;
				log(1, "IMServer登陆成功，登陆用户：" + options.userId)
				//1.登陆成功后从服务端获取一下全部会话，并发送事件CONVERSATION_LIST_CHANGED
				getConversationListFromCloud(1, 100000);
				//2.获取媒体上传参数
				getMediaUploadParams();
				return successHandle(options, "登陆成功", user);
			} else {
				return errHandle(options, data.message);
			}
		})
	}

	/**
	 * 断开连接
	 * 手动操作断开连接后，不会重连
	 */
	disConnect() {
		this.allowReconnect = false;
		uni.closeSocket();
	}

	/**
	 * 重连
	 */
	reConnect() {
		if (this.allowReconnect && !this.lockReconnect) {

			//没有用户信息，取消重连
			if (!this.userId || !this.token) {
				this.allowReconnect = false;
				return;
			}

			//设置了最大重连次数，并且已经到了限制，不再连。
			if (this.defaults.reConnectTotal > 0 && this.defaults.reConnectTotal <= this.reConnectNum) {
				this.allowReconnect = false;
				return;
			}

			this.reConnectNum++;
			this.lockReconnect = true;
			//没连接上会一直重连，设置延迟避免请求过多
			//通知网络状态变化
			emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, "connecting");
			setTimeout(() => {
				log(1, "IMSDK 正在第" + this.reConnectNum + "次重连")
				this.connect({
					userId: this.userId,
					token: this.token
				});
				this.lockReconnect = false;
			}, this.defaults.reConnectInterval); //这里设置重连间隔(ms) 

		}
	}

	/**
	 * 获取当前连接状态 
	 * "CLOSED":3,"CLOSING":2,"CONNECTING":0,"OPEN":1
	 */
	readyState() {
		if (this.socketTask) {
			return this.socketTask.readyState;
		} else {
			return 3;
		}
	}

	/**
	 * 开始心跳
	 */
	startHeartTimer() {
		this.clearHeartTimer();
		this.heartTimer = setTimeout(() => {
			if (this.readyState() == 1) {
				//log(0, "YeIMUniSDK 心跳：" + new Date());
				let heartJson = {
					type: 'heart',
					data: 'ping'
				};
				uni.sendSocketMessage({
					data: JSON.stringify(heartJson)
				});
				this.checkTimer = setTimeout(() => {
					uni.closeSocket();
				}, this.defaults.heartInterval)
			}
		}, this.defaults.heartInterval)
	}

	/**
	 * 清除心跳定时器，取消心跳
	 */
	clearHeartTimer() {
		clearTimeout(this.heartTimer);
		clearTimeout(this.checkTimer);
		return this;
	}


	/**
	 * socket 打开回调
	 * @param {Object} info
	 */
	socketOpen(info) {
		emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, "connected");
	}

	/**
	 * socket 关闭回调
	 * @param {Object} err
	 */
	socketClose(err) {
		log(1, "YeIMUniSDK断开连接");
		this.socketLogged = false;
		emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, "closed");
		this.reConnect();
	}

	/**
	 * socket 错误回调
	 * @param {Object} err
	 */
	socketError(err) {
		log(1, err);
		this.reConnect();
	}

	/**
	 * socket 消息回调
	 * @param {Object} res
	 */
	socketMessage(res) {
		log(0, res);
		//收到任意消息代表心跳成功
		this.startHeartTimer();
		if (!this.socketLogged) return;
		let data = JSON.parse(res.data);
		if (data) {
			this.socketMessageHandle(data);
		} else {
			log(1, res);
		}
	}

	/**
	 * WebSocket消息统一处理
	 * @param {Object} data
	 */
	socketMessageHandle(data) {
		if (data.code == 200) {
			//收到消息
			let message = data.data;

			//1. 保存消息,会话数据由在线推送
			saveMessage(message);

			//2. 发送消息接收事件
			emit(YeIMUniSDKDefines.EVENT.MESSAGE_RECEIVED, message);

			//3.通知socket端我已收到（为保证双方消息投递可靠性，发送消息使用http协议确保发送成功。而接收消息使用到了websocket，所以这里发一条回调消息通知Server端这条消息确认收到。）
			this.notifySocketMessageReceived(message);

		} else if (data.code == 203) {
			//收到会话更新
			let conversation = data.data;
			saveAndUpdateConversation(conversation);
		} else if (data.code == 205) {
			//收到私聊会话已读回执
			let conversation = data.data;
			handlePrivateConversationReadReceipt(conversation.conversationId);
		} else if (data.code == 109) {
			//KICKED_OUT 被踢下线，不允许重连了
			this.allowReconnect = false;
			this.clearHeartTimer();
			uni.closeSocket();
			emit(YeIMUniSDKDefines.EVENT.KICKED_OUT, true);
			log(1, '用户：' + this.userId + '，被踢下线了');
		}
	}

	/**
	 * socket message消息接收回调
	 * @param {Object} message
	 */
	notifySocketMessageReceived(message) {
		//尝试在线发送
		let socketJson = {
			type: 'received_call',
			data: message
		};
		uni.sendSocketMessage({
			data: JSON.stringify(socketJson),
			fail: (err) => {
				log(1, err)
			}
		});
	}


	/**
	 * 拦截登陆状态
	 */
	checkLogged() {
		if (!this.socketLogged || !this.userId || !this.token) {
			log(1, "请登陆后再调用此方法");
			return false;
		} else {
			return true;
		}
	}


}


export {
	instance,
	YeIMUniSDK,
	YeIMUniSDKDefines
};
