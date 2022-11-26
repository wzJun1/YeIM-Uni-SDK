import {
	YeIMUniSDKDefines
} from './const/yeim-defines';
import GenId from './utils/genid';
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
	createVideoMessage,
	createCustomMessage,
	sendMessage,
	saveMessage,
	getMessageList
} from './service/messageService'
import {
	saveAndUpdateConversation,
	getConversationListFromLocal,
	getConversationListFromCloud
} from './service/conversationService'
import {
	getMediaUploadParams
} from './service/uploadService'
import {
	updateUserInfo
} from './service/userService'


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

		//心跳定时器
		this.heartTimer = null;
		//检测定时器
		this.checkTimer = null;

		//分布式ID生成器
		this.genid = new GenId({
			WorkerId: 1
		});

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
		YeIMUniSDK.prototype.createTextMessage = createTextMessage;
		YeIMUniSDK.prototype.createImageMessage = createImageMessage;
		YeIMUniSDK.prototype.createVideoMessage = createVideoMessage;
		YeIMUniSDK.prototype.createCustomMessage = createCustomMessage;
		YeIMUniSDK.prototype.sendMessage = sendMessage;
		YeIMUniSDK.prototype.getMessageList = getMessageList;
		YeIMUniSDK.prototype.getConversationList = getConversationListFromLocal;
		YeIMUniSDK.prototype.updateUserInfo = updateUserInfo;
		YeIMUniSDK.prototype.addEventListener = addEventListener;
		YeIMUniSDK.prototype.removeEventListener = removeEventListener;
		console.log("============= YeIMUniSDK 初始化成功！=============")
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

		if (this.firstConnect) {
			uni.onSocketOpen(this.socketOpen.bind(this));
			uni.onSocketError(this.socketError.bind(this));
			uni.onSocketClose(this.socketClose.bind(this));
			uni.onSocketMessage(this.socketMessage.bind(this));
		}

		let url = this.defaults.socketURL + "/" + options.userId + "/" + options.token;
		this.socketTask = uni.connectSocket({
			url: url,
			success: (res) => {
				console.log(res)
			},
			fail: (err) => {
				console.log(err)
			},
			complete: () => {}
		});
		this.firstConnect = false;
		let timer = setTimeout(() => {
			timer = undefined;
			log(1, "连接服务端失败，请检查配置");
			return errHandle(options, "网络异常，请稍后重试");
		}, 5000);

		this.socketTask.onMessage((res) => {
			if (!timer) {
				return;
			}
			clearTimeout(timer);
			timer = undefined;
			let data = JSON.parse(res.data);
			//登陆成功
			if (data.code == 201) {
				this.socketTask.onMessage(() => {});
				this.user = data.data;
				this.userId = options.userId;
				this.token = options.token;
				this.socketLogged = true;
				log(1, "IMServer登陆成功，登陆用户：" + options.userId)
				//1.登陆成功后从服务端获取一下全部会话 
				getConversationListFromCloud(1, 100000);
				//2.获取媒体上传参数
				getMediaUploadParams();
				return successHandle(options, "登陆成功", data.data);
			} else {
				return errHandle(options, data.message);
			}
		})
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
			return 0;
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
		console.log(info)
		emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, "connected");
	}

	/**
	 * socket 关闭回调
	 * @param {Object} err
	 */
	socketClose(err) {
		console.log(err)
		this.socketLogged = false;
		emit(YeIMUniSDKDefines.EVENT.NET_CHANGED, "closed");
		this.reConnect();
	}

	/**
	 * socket 错误回调
	 * @param {Object} err
	 */
	socketError(err) {
		console.log(err)
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
	 * 消息统一处理
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

			//3.通知socket端我已收到
			this.notifySocketMessageReceived(message);

		} else if (data.code == 203) {
			//收到会话更新
			let conversation = data.data;
			saveAndUpdateConversation(conversation);

		} else if (data.code == 109) {
			//KICKED_OUT 被踢下线，不允许重连了
			this.allowReconnect = false;
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
	 * 拦截
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
