/*eslint-disable*/

/** 
 * 
 * YeIM-Uni-SDK
 * 可以私有化部署的全开源即时通讯js-sdk，仅需集成 SDK 即可轻松实现聊天能力，支持Web或uni-app项目接入使用，满足通信需要。
 * 
 * @author wzJun1
 * @link https://github.com/wzJun1/YeIM-Uni-SDK 
 * @doc https://wzjun1.netlify.app/ye_plugins/sdk/yeimunisdk
 * @copyright wzJun1 2022, 2024. All rights reserved.
 * @license Apache-2.0
 * 
 */

import {
	version
} from '../package.json';

import {
	YeIMUniSDKDefines
} from './const/yeim-defines';

import {
	YeIMUniSDKStatusCode
} from './const/yeim-status-code';

import WebSocketUtil from './func/websocket';

import {
	successHandle,
	errHandle
} from './func/callback';

import mitt from './utils/mitt.umd'

import {
	emit,
	addEventListener,
	removeEventListener
} from './func/event';

import log from './func/log';

import {
	createTextMessage,
	createTextAtMessage,
	createImageMessage,
	createImageMessageFromUrl,
	createAudioMessage,
	createAudioMessageFromUrl,
	createLocationMessage,
	createVideoMessage,
	createVideoMessageFromUrl,
	createCustomMessage,
	createMergerMessage,
	createForwardMessage,
	sendMessage,
	saveMessage,
	getHistoryMessageList,
	revokeMessage,
	deleteMessage,
	handleMessageRevoked
} from './service/messageService'

import {
	deleteConversation,
	saveAndUpdateConversation,
	clearConversationUnread,
	getConversation,
	getConversationList,
	saveCloudConversationListToLocal,
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
	updateUserInfo,
	getBlackUserList,
	addToBlackUserList,
	removeFromBlacklist
} from './service/userService'

import {
	setPushPermissions,
	createNotificationChannel,
	bindAppUserPushCID
} from './service/pushService'

import {
	acceptApply,
	addFriend,
	deleteFriend,
	getFriendApplyList,
	getFriendList,
	handleFriendApplyListChanged,
	handleFriendListChanged,
	refuseApply,
	setApplyListRead,
	updateFriend
} from './service/friendService';

/**
 * YeIMUniSDK实例化对象
 */
let instance;

/**
 * YeIMUniSDK 
 * @class  
 */
class YeIMUniSDK {

	/**
	 * @constructs
	 */
	constructor(options = {}) {

		/**
		 * 全局配置参数
		 */
		this.defaults = {

			/**
			 * http url
			 */
			baseURL: undefined,

			/**
			 * socket url
			 */
			socketURL: undefined,

			/**
			 * 事件前缀
			 */
			eventPrefix: 'YeIM_',

			/**
			 * 最大重连次数，0不限制一直重连
			 */
			reConnectTotal: 15,

			/**
			 * 重连时间间隔
			 */
			reConnectInterval: 3000,

			/**
			 * 心跳时间间隔(默认30s)
			 */
			heartInterval: 30000,

			/**
			 * 	日志等级
			 *  0 普通日志，日志量较多，接入时建议使用
			 *	1 关键性日志，日志量较少，生产环境时建议使用 
			 *	2 无日志级别，SDK 将不打印任何日志
			 */
			logLevel: 0,

			/**
			 * SDK自定义初始化参数
			 */
			...options,

			/**
			 * APP离线通知配置
			 */
			notification: {

				/**
				 *  登录后是否自动检测通知权限
				 */
				autoPermission: false,

				/**
				 *  手机安卓8.0以上的通知渠道ID（需要申请）
				 */
				oppoChannelId: 'Default', //OPPO手机安卓8.0以上的通知渠道ID

				/**
				 * 小米手机重要级别消息通知渠道ID（需要申请，一般默认为high_system）
				 */
				xiaomiChannelId: 'high_system',

				...options.notification
			},

		};

		/**
		 * uni环境
		 */
		if (typeof uni !== 'undefined') {
			this.uni = true;
		} else {
			this.uni = false;
		}
		/**
		 * 版本号
		 */
		this.version = version;
		/**
		 * 事件总线
		 */
		this.emitter = mitt();
		/**
		 * 是否首次连接
		 */
		this.firstConnect = true;
		/**
		 * webSocket
		 */
		this.webSocket = undefined;
		/**
		 * 是否已登陆YeIMServer
		 */
		this.socketLogged = false;
		/**
		 * 是否允许重连
		 */
		this.allowReconnect = true;
		/**
		 * 重连锁，防止多重调用
		 */
		this.lockReconnect = false;
		/**
		 * 重连次数
		 */
		this.reConnectNum = 0;
		/**
		 * 登录连接超时定时器
		 */
		this.connectTimer = undefined;
		/**
		 * 心跳定时器
		 */
		this.heartTimer = undefined;
		/**
		 * 检测定时器
		 */
		this.checkTimer = undefined;
		/**
		 * 用户信息
		 */
		this.user = {};
		/**
		 * 用户ID
		 */
		this.userId = undefined;
		/**
		 * 登陆token
		 */
		this.token = undefined;
		/**
		 * 媒体上传参数
		 */
		this.mediaUploadParams = {};
		/**
		 * 移动端推送标识符	
		 */
		this.mobileDeviceId = undefined;
		/**
		 * APP是否在前台
		 */
		this.inApp = true;
	}

	/**
	 * 初始化SDK
	 * @param options 配置项
	 * @returns YeIMUniSDK实例化对象
	 */
	static init(options = {}) {
		if (typeof uni !== 'undefined' && uni.$YeIMInstance) {
			instance = uni.$YeIMInstance;
		}
		if (instance) {
			return instance;
		}
		if (!options.baseURL || !options.socketURL) {
			return console.error(YeIMUniSDKStatusCode.SDK_PARAMS_ERROR.describe);
		}
		instance = new YeIMUniSDK(options);
		if (typeof uni !== 'undefined') {
			uni.$YeIMInstance = instance;
		}
		YeIMUniSDK.prototype.createTextMessage = createTextMessage; //创建文字消息
		YeIMUniSDK.prototype.createTextAtMessage = createTextAtMessage; //创建群聊文字@消息 
		YeIMUniSDK.prototype.createImageMessage = createImageMessage; //创建图片消息
		YeIMUniSDK.prototype.createImageMessageFromUrl = createImageMessageFromUrl; //创建图片Url直发消息
		YeIMUniSDK.prototype.createAudioMessage = createAudioMessage; //创建语音消息
		YeIMUniSDK.prototype.createAudioMessageFromUrl = createAudioMessageFromUrl; //创建语音Url直发消息 
		YeIMUniSDK.prototype.createVideoMessage = createVideoMessage; //创建小视频消息
		YeIMUniSDK.prototype.createVideoMessageFromUrl = createVideoMessageFromUrl; //创建小视频Url直发消息 
		YeIMUniSDK.prototype.createLocationMessage = createLocationMessage; //创建位置消息
		YeIMUniSDK.prototype.createCustomMessage = createCustomMessage; //创建自定义消息
		YeIMUniSDK.prototype.createMergerMessage = createMergerMessage; //创建合并消息  
		YeIMUniSDK.prototype.createForwardMessage = createForwardMessage; //创建转发消息    
		YeIMUniSDK.prototype.upload = upload; //通用上传接口
		YeIMUniSDK.prototype.sendMessage = sendMessage; //发送消息统一接口 
		YeIMUniSDK.prototype.getHistoryMessageList =
			getHistoryMessageList; //v1.1.7开始使用！获取历史消息记录（本地默认只存取每个会话的最新20条记录，剩余记录均从云端拉取） 
		YeIMUniSDK.prototype.revokeMessage = revokeMessage; //撤回消息
		YeIMUniSDK.prototype.deleteMessage = deleteMessage; //删除消息
		YeIMUniSDK.prototype.getConversation = getConversation; //获取会话详情
		YeIMUniSDK.prototype.getConversationList = getConversationList; //获取会话列表
		YeIMUniSDK.prototype.clearConversationUnread = clearConversationUnread; //清除指定会话未读数
		YeIMUniSDK.prototype.deleteConversation = deleteConversation; //删除指定会话和聊天记录
		YeIMUniSDK.prototype.getUserInfo = getUserInfo; //获取用户资料
		YeIMUniSDK.prototype.updateUserInfo = updateUserInfo; //更新用户昵称和头像 
		YeIMUniSDK.prototype.getBlackUserList = getBlackUserList; //获取黑名单列表
		YeIMUniSDK.prototype.addToBlackUserList = addToBlackUserList; //添加用户到黑名单
		YeIMUniSDK.prototype.removeFromBlacklist = removeFromBlacklist; //把用户从黑名单移除  
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
		YeIMUniSDK.prototype.getFriendList = getFriendList; //获取好友列表 
		YeIMUniSDK.prototype.getFriendApplyList = getFriendApplyList; //获取好友申请列表  
		YeIMUniSDK.prototype.setApplyListRead = setApplyListRead; //将全部好友申请设置为已读状态  
		YeIMUniSDK.prototype.acceptApply = acceptApply; //同意好友申请 
		YeIMUniSDK.prototype.refuseApply = refuseApply; //拒绝好友申请 
		YeIMUniSDK.prototype.addFriend = addFriend; //添加好友 
		YeIMUniSDK.prototype.deleteFriend = deleteFriend; //添加好友  
		YeIMUniSDK.prototype.updateFriend = updateFriend; //更新好友资料   
		log(1, "============= YeIMUniSDK 初始化成功！版本号：" + instance.version + " =============");
		return instance;
	}

	/**
	 * 获取SDK实例化对象
	 */
	static getInstance() {
		if (typeof uni !== 'undefined' && uni.$YeIMInstance) {
			instance = uni.$YeIMInstance;
		}
		if (instance) {
			return instance;
		}
		console.error("SDK未初始化，无法获取实例化对象")
		return undefined;
	}

	/**
	 * 连接YeIMServer
	 * @param options 配置项
	 * @returns YeIMUniSDK实例化对象
	 */
	connect(options = {}) {

		if (!options.userId || !options.token) {
			return errHandle(options, YeIMUniSDKStatusCode.NO_USERID.code, YeIMUniSDKStatusCode.NO_USERID
				.describe);
		}

		//拼接websocket连接url
		let url = this.defaults.socketURL + "/" + options.userId + "/" + options.token;
		//创建websocket连接
		this.webSocket = new WebSocketUtil(url);

		//设置websocket相关监听
		this.webSocket.onOpen(this.socketOpen.bind(this));
		this.webSocket.onClose(this.socketClose.bind(this));
		this.webSocket.onError(this.socketError.bind(this));
		this.webSocket.onMessage(this.socketMessage.bind(this));

		//连接异常
		if (this.connectTimer) {
			clearTimeout(this.connectTimer);
			this.connectTimer = undefined;
		}
		this.connectTimer = setTimeout(() => {
			this.connectTimer = undefined;
			log(1, '连接服务端失败，请检查配置');
			return errHandle(options, YeIMUniSDKStatusCode.CONNECT_ERROR.code, YeIMUniSDKStatusCode
				.CONNECT_ERROR
				.describe);
		}, this.defaults.reConnectInterval + 1000);

		//临时设置监听onMessage
		this.webSocket.onMessage((res) => {
			if (this.socketLogged) {
				clearTimeout(this.connectTimer);
				this.connectTimer = undefined;
				return;
				z
			}
			clearTimeout(this.connectTimer);
			this.connectTimer = undefined;
			let data = JSON.parse(res.data);
			//监听到登陆成功
			if (data.code == 201) {
				//设置用户相关参数
				let user = data.data.user;
				this.user = user;
				this.userId = options.userId;
				this.token = options.token;
				//设置推送参数
				let pushConfig = data.data.pushConfig;
				if (pushConfig.oppoChannelId) {
					this.defaults.notification.oppoChannelId = pushConfig.oppoChannelId;
				}
				if (pushConfig.xiaomiChannelId) {
					this.defaults.notification.xiaomiChannelId = pushConfig.xiaomiChannelId;
				}
				//设置socket state（socketLogged）登陆成功
				this.socketLogged = true;
				this.reConnectNum = 0;
				log(1, `YeIMServer登陆成功，登陆用户：${options.userId}`)
				//登陆成功后从服务端获取一下全部会话，并发送事件CONVERSATION_LIST_CHANGED
				saveCloudConversationListToLocal(1, 100000);
				//登陆成功触发一次好友列表更新事件
				handleFriendListChanged();
				//登陆成功触发一次好友申请列表更新事件
				handleFriendApplyListChanged();
				//获取媒体上传参数
				getMediaUploadParams();
				//如果在uni环境下，执行以下操作
				if (this.uni) {
					//3.1 申请权限
					if (this.defaults.notification.autoPermission) {
						setPushPermissions();
					}
					//创建推送渠道
					createNotificationChannel();
					//APP用户绑定个推CID到后端，用于离线推送
					bindAppUserPushCID();
					//监听在线透传消息
					let uuidList = [];
					uni.onPushMessage((res) => {
						//APP在后台，并且没被杀掉的时候，收到透传消息在客户端创建通知提示
						if (!this.inApp && res.type == 'receive') {
							let uuid = res.data.__UUID__;
							if (uuidList.indexOf(uuid) <= 0) {
								uuidList.push(uuid);
								uni.createPushMessage({
									title: res.data.title,
									content: res.data.content,
									sound: 'system',
									success: () => {},
									fail: () => {}
								})
							}
						}
					})
				}
				return successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, user);
			} else {
				return errHandle(options, YeIMUniSDKStatusCode.LOGIN_ERROR.code, YeIMUniSDKStatusCode
					.LOGIN_ERROR
					.describe);
			}
		})
	}

	/**
	 * 断开连接
	 * 手动操作断开连接后，不会重连
	 */
	disConnect() {
		this.allowReconnect = false;
		this.webSocket.close();
		this.webSocket.destroy();
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
			emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, 'connecting');
			setTimeout(() => {
				log(1, `WebSocket 正在进行第${this.reConnectNum}次重连`)
				try {
					this.connect({
						userId: this.userId,
						token: this.token
					});
				} catch (e) {
					console.log(e)
				}
				this.lockReconnect = false;
			}, this.defaults.reConnectInterval); //这里设置重连间隔(ms) 

		}
	}

	/**
	 * 获取当前连接状态 
	 * "CLOSED":3,"CLOSING":2,"CONNECTING":0,"OPEN":1
	 */
	readyState() {
		if (this.webSocket && this.webSocket.socketTask) {
			return this.webSocket.socketTask.readyState;
		} else {
			return 3;
		}
	}

	/**
	 * 开始心跳
	 */
	startHeartTimer() {
		this.clearHeartTimer();
		if (this.webSocket && this.webSocket.socketTask) {
			this.heartTimer = setTimeout(() => {
				if (this.readyState() == 1) {
					let heartJson = {
						type: 'heart',
						data: 'ping'
					};
					this.webSocket.send(heartJson);
					this.checkTimer = setTimeout(() => {
						this.webSocket.close();
					}, this.defaults.heartInterval)
				}
			}, this.defaults.heartInterval)
		}
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
		log(1, 'WebSocket成功连接');
		emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, 'connected');
	}

	/**
	 * socket 关闭回调
	 * @param {Object} err
	 */
	socketClose(err) {
		log(1, 'WebSocket断开连接');
		this.socketLogged = false;
		this.webSocket.close();
		this.webSocket.destroy();
		emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, 'closed');
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

		} else if (data.code == 203) {
			//收到会话更新
			let conversation = data.data;
			saveAndUpdateConversation(conversation);
		} else if (data.code == 205) {
			//收到私聊会话已读回执
			let conversation = data.data;
			handlePrivateConversationReadReceipt(conversation.conversationId);
		} else if (data.code == 207) {
			//收到消息撤回事件 
			handleMessageRevoked(data.data);
		} else if (data.code == 208) {
			//好友列表更新事件  
			setTimeout(() => {
				handleFriendListChanged();
			}, 500);
		} else if (data.code == 209) {
			//好友申请列表更新   
			setTimeout(() => {
				handleFriendApplyListChanged();
			}, 500);
		} else if (data.code == 210) {
			//好友申请被拒绝 
			emit(YeIMUniSDKDefines.EVENT.FRIEND_APPLY_REFUSE, data.data);
			//更新好友申请列表 
			setTimeout(() => {
				handleFriendApplyListChanged(1);
			}, 500);
		} else if (data.code == 10009) {
			//被踢下线不允许重连
			this.allowReconnect = false;
			this.clearHeartTimer();
			this.webSocket.close();
			emit(YeIMUniSDKDefines.EVENT.KICKED_OUT, true);
			log(1, `用户：${this.userId} 由于多个实例同时登录被踢出`);
		}
	}


	/**
	 * 拦截登陆状态
	 */
	checkLogged() {
		if (!this.socketLogged || !this.userId || !this.token) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 设置APP在前台
	 */
	intoApp() {
		this.inApp = true;
	}

	/**
	 * 设置APP已进入后台
	 */
	leaveApp() {
		this.inApp = false;
	}

}

export {
	instance,
	YeIMUniSDK,
	YeIMUniSDKDefines
};
