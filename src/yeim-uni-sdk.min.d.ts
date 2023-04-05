export declare module './yeim-uni-sdk.min.js' {
	/** 
	 * 
	 * YeIM-Uni-SDK
	 * 可以私有化部署的全开源即时通讯js-sdk，仅需集成 SDK 即可轻松实现聊天能力，支持Web或uni-app项目接入使用，满足通信需要。
	 * 
	 * @author wzJun1
	 * @link https://github.com/wzJun1/YeIM-Uni-SDK 
	 * @doc https://wzjun1.netlify.app/ye_plugins/sdk/yeimunisdk
	 * @copyright wzJun1 2022, 2023. All rights reserved.
	 * @license Apache-2.0
	 * 
	 */
	declare class YeIMUniSDK {

		/**
		 * 初始化SDK
		 * 
		 * @param options 配置项
		 * @param options.baseURL - YeIMServer http url （如无特殊需求，服务端启动后仅需修改ip或者域名即可）
		 * @param options.socketURL - YeIMServer socket url（如无特殊需求，服务端启动后仅需修改ip或者域名即可）
		 * @param options.logLevel - SDK 日志等级
		 * @param options.reConnectInterval - socket 重连时间间隔
		 * @param options.reConnectTotal - socket 最大重连次数，0不限制一直重连
		 * @param options.heartInterval - socket 心跳时间间隔(默认30s)
		 * @param options.notification - APP离线通知配置
		 * @returns {YeIMUniSDK} YeIMUniSDK实例化对象
		 */
		static init(options: {

			/**
			 * YeIMServer http url （如无特殊需求，服务端启动后仅需修改ip或者域名即可）
			 */
			baseURL: string;

			/**
			 * YeIMServer socket url（如无特殊需求，服务端启动后仅需修改ip或者域名即可）
			 */
			socketURL: string;
			/**
			 *    SDK 日志等级
			 *    0 普通日志，日志量较多，接入时建议使用
			 *    1 关键性日志，日志量较少，生产环境时建议使用
			 *    2 无日志级别，SDK 将不打印任何日志
			 */

			logLevel?: number;
			/**
			 * socket 重连时间间隔
			 */

			reConnectInterval?: number;

			/**
			 * socket 最大重连次数，0不限制一直重连
			 */

			reConnectTotal?: number;

			/**
			 * socket 心跳时间间隔(默认30s)
			 */
			heartInterval?: number;

			/**
			 * APP离线通知配置
			 */
			notification?: object;

		}): YeIMUniSDK;

		/**
		 * 获取SDK实例化对象
		 */
		static getInstance(): YeIMUniSDK?;

		/**
		 * 连接登录YeIM
		 * 
		 * @param options 配置项
		 * @param options.userId 已注册的用户ID字符串
		 * @param options.token 登录token，由请求服务端Http接口换取
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * @returns {void}
		 */
		connect(options: {
			userId: string,
			token: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 创建文本消息 
		 * 
		 * @param {Options} options - 创建消息参数对象  
		 * 
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Object} options.body - 文本消息对象
		 * @param {String} options.body.text - 文本消息内容
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createTextMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				text: string
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建群聊 @ 艾特消息 
		 * 
		 * @param {Options} options - 创建消息参数对象 
		 *
		 * @param {String} options.toId - 群ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊 当前消息仅支持群里
		 * @param {Body} options.body - 文本消息对象
		 * @param {String} options.body.text - 文本消息内容
		 * @param {Array<String>} options.body.atUserIdList - 要艾特的用户ID列表
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createTextAtMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				text: string,
				atUserIdList: Array<string>
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建图片消息
		 * 
		 * 仅支持单张图片
		 * 
		 * @param {Options} options - 创建消息参数对象
		 *  
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 图片消息对象
		 * @param {File} options.body.file - 图片消息对象
		 * @param {String} options.body.file.tempFilePath - 本地图片文件临时路径
		 * @param {Number} options.body.file.width - 图片宽度
		 * @param {Number} options.body.file.height - 图片高度
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createImageMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				file: {
					tempFilePath: string,
					width: number,
					height: number
				}
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建图片Url直发消息
		 * 
		 * 仅支持单张图片
		 * 
		 * @param {Options} options - 创建消息参数对象
		 *        
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 图片消息对象
		 * @param {String} options.body.originalUrl - 原图网络Url
		 * @param {Number} options.body.originalWidth - 原图宽度
		 * @param {Number} options.body.originalHeight - 原图高度
		 * @param {String} options.body.thumbnailUrl - 缩略图网络Url
		 * @param {Number} options.body.thumbnailWidth - 缩略图宽度
		 * @param {Number} options.body.thumbnailHeight - 缩略图高度
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createImageMessageFromUrl(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				originalUrl: string,
				originalWidth: number,
				originalHeight: number,
				thumbnailUrl: string,
				thumbnailWidth: number,
				thumbnailHeight: number
			},
			extra?: string
		}): Message | Object;


		/**
		 * 创建语音消息
		 * 
		 * 仅支持AAC格式音频
		 * 
		 * @param {Options} options - 创建消息参数对象
		 *         
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 音频消息对象
		 * @param {File} options.body.file - 音频文件信息
		 * @param {String} options.body.file.tempFilePath - 本地音频文件临时路径
		 * @param {Number} options.body.file.duration - 音频时长，单位秒 
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createAudioMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				file: {
					tempFilePath: string,
					duration: number
				}
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建语音Url直发消息
		 *   
		 * @param {Options} options - 创建消息参数对象
		 *
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 音频消息对象 
		 * @param {String} options.body.audioUrl - 音频网络Url
		 * @param {Number} options.body.duration - 音频时长，单位秒 
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createAudioMessageFromUrl(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				tempFilePath: string,
				duration: number
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建小视频消息 
		 * 
		 * @param {Options} options - 创建消息参数对象
		 *
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 视频消息对象
		 * @param {File} options.body.file - 视频文件信息
		 * @param {String} options.body.file.tempFilePath - 本地小视频文件临时路径
		 * @param {Number} options.body.file.duration - 视频时长
		 * @param {Number} options.body.file.width - 视频宽度
		 * @param {Number} options.body.file.height - 视频高度
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createVideoMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				file: {
					tempFilePath: string,
					duration: number,
					width: number,
					height: number
				}
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建小视频Url直发消息 
		 * 
		 * @param {Options} options - 创建消息参数对象
		 *  
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 视频消息对象
		 * @param {String} options.body.videoUrl - 视频网络Url
		 * @param {String} options.body.thumbnailUrl - 视频缩略图网络Url
		 * @param {Number} options.body.duration - 视频时长
		 * @param {Number} options.body.width - 视频宽度
		 * @param {Number} options.body.height - 视频高度
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createVideoMessageFromUrl(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				videoUrl: string,
				thumbnailUrl: string,
				duration: number,
				width: number,
				height: number
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建位置消息 
		 * 
		 * @param {Options} options - 创建消息参数对象
		 * 
		 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: { address: "地址名称", description: "地址详细描述", longitude: 105.000000, latitude: 31.000000 }}
		 *
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 位置消息对象
		 * @param {String} options.body.address - 地址名称
		 * @param {String} options.body.description - 地址详细描述
		 * @param {Number} options.body.longitude - 经度
		 * @param {Number} options.body.latitude - 纬度
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createLocationMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				address: string,
				description: string,
				longitude: number,
				latitude: number
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建自定义消息 
		 * 
		 * 自定义消息内容放在body字段 
		 *
		 * @param {Options} options - 创建消息参数对象
		 * 
		 * { "toId": "接受者用户ID", "conversationType": YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE, body: {} }
		 *
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Object|String} options.body - 自定义消息内容 
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createCustomMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: string | object,
			extra?: string
		}): Message | Object;

		/**
		 * 创建合并消息 
		 * 
		 * @param {Options} options - 创建消息参数对象
		 *         
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 文本消息对象
		 * @param {String} options.body.title - 合并消息的标题
		 * @param {Array<Message>} options.body.messageList - 合并消息的标题
		 * @param {Array<String>} options.body.summaryList - 合并消息的标题
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createMergerMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				title: string,
				messageList: Array<T>,
				summaryList: Array<string>
			},
			extra?: string
		}): Message | Object;

		/**
		 * 创建转发消息 
		 * 
		 * @param {Options} options - 创建消息参数对象
		 * 
		 * @param {String} options.toId - 接受者用户ID
		 * @param {String} options.conversationType - 会话类型（私聊、群聊）定义在YeIMUniSDKDefines，YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE = 私聊，YeIMUniSDKDefines.CONVERSATION_TYPE.GROUP = 群聊
		 * @param {Body} options.body - 文本消息对象
		 * @param {Message} options.body.message - 要转发的消息 
		 * @param {String} options.extra - 自定义扩展数据
		 * 
		 * @return {(Object|Message)} Message 消息对象
		 *  
		 */
		createForwardMessage(options: {
			toId: string,
			conversationType: YeIMUniSDKDefines.CONVERSATION_TYPE,
			body: {
				message: Message | object,
			},
			extra?: string
		}): Message | Object;

		/**
		 *
		 * 通用上传接口 
		 *
		 * @param {Options} options
		 * @param {String} options.filename - 文件名称（需带后缀）
		 * @param {String} options.filepath - 本地文件临时路径
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * @param {(progress)=>void} [options.onProgress] - 上传进度回调
		 * 
		 */
		upload(options: {
			filename: string,
			filepath: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * @version 1.1.7
		 * 
		 * 获取历史消息记录  
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.nextMessageId - 下次拉取的开始ID    
		 * @param {String} options.conversationId - 会话ID    
		 * @param {Number} options.limit - 拉取数量，默认：20
		 * @param {(result)=>void} options.success - 成功回调
		 * @param {(error)=>void} options.fail - 失败回调 
		 * 
		 */
		getHistoryMessageList(options: {
			nextMessageId?: string,
			conversationId: string,
			limit?: number,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *   
		 * 删除消息  
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {Message} message - 要删除的消息对象  
		 * @param {(result)=>void} options.success - 成功回调
		 * @param {(error)=>void} options.fail - 失败回调 
		 * 
		 */
		deleteMessage(options: {
			message: Message | object,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *   
		 * 撤回消息  
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {Message} message - 要撤回的消息对象  
		 * @param {(result)=>void} options.success - 成功回调
		 * @param {(error)=>void} options.fail - 失败回调 
		 * 
		 */
		revokeMessage(options: {
			message: Message | object,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 根据会话ID获取本地会话详情
		 * 
		 * @param {String} conversationId - 会话ID
		 * @return {Conversation} conversation
		 */
		getConversation(conversationId: string): Conversation | object;

		/**
		 * 获取本地会话列表
		 * 
		 * @param {Options} options - 参数对象   
		 *   
		 * @param {String} options.page - 页码
		 * @param {String} options.limit - 每页数量
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调  
		 */
		getConversationList(options: {
			page: number,
			limit: number,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 根据会话ID删除会话和聊天记录（包括云端）
		 * 
		 * @param {Object} conversationId
		 * @return {void}
		 */
		deleteConversation(conversationId: string): void;

		/**
		 * 清除指定会话未读数
		 * 
		 * 云端同时发送给对端已读事件（私聊）
		 * 
		 * @param {String} conversationId - 会话ID
		 * @return {void}
		 */
		clearConversationUnread(conversationId: string): void;

		/**
		 *  
		 * 发送消息统一入口 
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {Message} options.message - 消息对象    
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * sendMessage({
			 message: message, 
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		sendMessage(options: {
			message: Message | Object | undefined,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 获取用户信息 
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.userId - 用户ID      
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 */
		getUserInfo(options: {
			userId: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 更新我的用户资料 
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.nickname - 昵称      
		 * @param {String} options.avatarUrl - 头像地址      
		 * @param {Number} options.gender - 性别，0=未知，1=男性，2=女性 
		 * @param {Number} options.mobile - 电话
		 * @param {String} options.email - 邮箱
		 * @param {String} options.birthday - 生日
		 * @param {String} options.motto - 个性签名
		 * @param {String} options.extend - 用户自定义扩展字段 
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 */
		updateUserInfo(options: {
			nickname?: string,
			avatarUrl?: string,
			gender?: number,
			mobile?: number,
			email?: string,
			birthday?: string,
			motto?: string,
			extend?: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 获取黑名单列表 
		 * 
		 * @param {Options} options - 参数对象     
		 *    
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 */
		getBlackUserList(options: {
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		*  
		* 添加用户到黑名单 
		*  
		* 
		* @param {Options} options - 参数对象    
		*  
		* 
		* @param {Array<String>} options.members - 用户ID列表    
		* @param {(result)=>void} [options.success] - 成功回调
		* @param {(error)=>void} [options.fail] - 失败回调 
		* 
		* @example  
		* addToBlackUserList({
			members: ["user1", "user2"],
			success: (result) => {},
			fail: (error) => {}
		});
		*/
		addToBlackUserList(options: {
			members: Array<string>
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		*  
		* 把用户移出黑名单
		*  
		* 
		* @param {Options} options - 参数对象    
		*  
		* 
		* @param {Array<String>} options.members - 用户ID列表    
		* @param {(result)=>void} [options.success] - 成功回调
		* @param {(error)=>void} [options.fail] - 失败回调 
		* 
		* @example  
		* removeFromBlacklist({
			members: ["user1", "user2"],
			success: (result) => {},
			fail: (error) => {}
		});
		*/
		removeFromBlacklist(options: {
			members: Array<string>
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 添加IM事件监听器
		 * @param {Object} event - 事件类型 YeIMUniSDKDefines.EVENT
		 * @param {(result)=>void} callback 监听回调方法
		 */
		addEventListener(event: string, callback: (result: any) => void);

		/**
		 * 移除IM事件监听器
		 * @param {Object} event - 事件类型 YeIMUniSDKDefines.EVENT
		 * @param {(result)=>void} callback 监听回调方法
		 */
		removeEventListener(event: string, callback: (result: any) => void);

		/**
		 *  
		 * 创建群组 
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.name - 群名称   
		 * @param {String} options.avatarUrl - 群头像  
		 * @param {String} [options.groupId] - 群ID，未填写时系统自动生成
		 * @param {Number} [options.joinMode] - 群申请处理方式 - YeIMUniSDKDefines.GROUP.JOINMODE
		 * @param {String} [options.introduction] - 群简介
		 * @param {String} [options.notification] - 群公告
		 * @param {Array<String>} [options.members] - 创建群聊初始化成员（用户ID数组）  
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * createGroup({
			 name: "",
			 avatarUrl: "", 
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		createGroup(options: {
			name: string,
			avatarUrl: string,
			groupId?: string,
			joinMode?: number,
			introduction?: string,
			notification?: string,
			members?: Array<string>,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 解散群组 
		 * 
		 * 仅群主可操作
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} [options.groupId] - 群ID    
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * dissolveGroup({
			   groupId: "",
			   success: (result) => {},
			   fail: (error) => {}
		   });
		 */
		dissolveGroup(options: {
			groupId: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 更新群组资料 
		 * 
		 * @param {Options} options - 参数对象     
		 *
		 * @param {String} [options.groupId] - 群ID
		 * @param {String} [options.name] - 群名称   
		 * @param {String} [options.avatarUrl] - 群头像  
		 * @param {YeIMUniSDKDefines.GROUP.JOINMODE} [options.joinMode] - 群申请处理方式
		 * @param {String} [options.introduction] - 群简介
		 * @param {String} [options.notification] - 群公告
		 * @param {Number} [options.isMute] - 全体禁言 0,1
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * updateGroup({
			 groupId: "",
			 name: "",
			 avatarUrl: "", 
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		updateGroup(options: {
			groupId: string,
			name?: string,
			avatarUrl?: string,
			joinMode?: number,
			introduction?: string,
			notification?: string,
			members?: Array<string>,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 通过群ID获取群组资料
		 * 
		 * @param {Options} options - 参数对象    
		 *   
		 * @param {String} options.groupId - 群ID    
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example 
		 * getGroup({
			 groupId: "",
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		getGroup(options: {
			groupId: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 转让群主 
		 * 
		 * 仅群主可操作
		 * 
		 * @param {Options} options - 参数对象    
		 *  
		 * @param {String} [options.groupId] - 群ID    
		 * @param {String} [options.userId] - 转让用户ID 
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * transferLeader({
			   groupId: "",
			   userId: "",
			   success: (result) => {},
			   fail: (error) => {}
		   });
		 */
		transferLeader(options: {
			groupId: string,
			userId: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 获取我的群组列表
		 * 
		 * @param {Options} options - 参数对象    
		 *  
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example 
		 * getGroupList({
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		getGroupList(options: {
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 用户申请入群 
		 * 
		 * IM内用户均可调用此接口申请进入传入的群组ID的群，根据群申请处理方式不同，可能直接进入，也可能等待审核
		 * 
		 * @param {Options} options - 参数对象    
		 *   
		 * @param {String} options.groupId - 群ID    
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * joinGroup({
			 groupId: "",
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		joinGroup(options: {
			groupId: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 退出群组  
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.groupId - 群ID    
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * leaveGroup({
			 groupId: "",
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		leaveGroup(options: {
			groupId: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 添加群成员  
		 * 
		 * 不限权限，IM内用户均可调用此接口，但根据群申请处理方式不同，可能直接进入，也可能等待审核
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.groupId - 群ID    
		 * @param {Array<String>} options.members - 用户ID列表   
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * addGroupUsers({
			 groupId: "",
			 members: ["user1", "user2"],
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		addGroupUsers(options: {
			groupId: string,
			members: Array<string>,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 移除群成员  
		 * 
		 * 仅群主可使用此接口
		 * 
		 * @param {Object} options - 参数对象    
		 *   
		 * @param {String} options.groupId - 群ID    
		 * @param {Array<String>} options.members - 用户ID列表   
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * removeGroupUsers({
			 groupId: "",
			 members: ["user1", "user2"],
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		removeGroupUsers(options: {
			groupId: string,
			members: Array<string>,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 设置群管理员
		 * 
		 * 仅群主可操作此接口 
		 * 
		 * @param {Options} options - 参数对象 
		 *  
		 * @param {String} options.groupId - 群ID  
		 * @param {String} options.userId - 要设置的用户ID  
		 * @param {Number} options.isAdmin - 是否设置管理员，0=取消，1=设置  
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example
		 * setAdminstrator({
			 groupId: "",
			 userId: "",
			 isAdmin: 1,
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		setAdminstrator(options: {
			groupId: string,
			userId: string,
			isAdmin: number,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 禁言群成员
		 * 
		 * 群组中群主或管理员可调用此接口禁言群成员，每次设置的分钟数均从操作时间开始算起，设置0则取消禁言
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.groupId - 群ID  
		 * @param {String} options.userId - 禁言用户ID  
		 * @param {Number} options.time - 禁言分钟数  
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * setMute({
			 groupId: "group_1",
			 userId: "user1",
			 time: 10,
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		setMute(options: {
			groupId: string,
			userId: string,
			time: number,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 获取群组用户入群申请列表
		 * 
		 * 群主或管理员调用此接口可获取名下所有群组入群申请列表 
		 * 
		 * @param {Options} options - 参数对象    
		 * 
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * getGroupApplyList({
			   success: (result) => {},
			   fail: (error) => {}
		   });
		 */
		getGroupApplyList(options: {
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 处理群组用户入群申请
		 * 
		 * 申请记录所在的群组中群主或管理员可调用此接口处理申请 
		 * 
		 * @param {Options} options - 参数对象    
		 * 
		 * @param {Number} options.id - 申请记录的ID  
		 * @param {Number} options.status - 处理结果 YeIMUniSDKDefines.GROUP.APPLYSTATU
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * handleApply({
			 id: 5,  
			 status: YeIMUniSDKDefines.GROUP.APPLYSTATUS.AGREE,  
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		handleApply(options: {
			id: number,
			status: number
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 *  
		 * 获取群成员列表 
		 * 
		 * @param {Options} options - 参数对象     
		 * 
		 * @param {String} options.groupId - 群ID  
		 * @param {(result)=>void} [options.success] - 成功回调
		 * @param {(error)=>void} [options.fail] - 失败回调 
		 * 
		 * @example  
		 * getGroupUserList({
			 groupId: "group_1",
			 success: (result) => {},
			 fail: (error) => {}
		});
		*/
		getGroupUserList(options: {
			groupId: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 从云端获取好友列表
		 * 
		 * @param {Options} options - 参数对象
		 * 
		 * @param {Number} options.profile - 资料类型，0=简略资料，1=详细资料      
		 * @param {Number} options.page - 页码      
		 * @param {Number} options.limit - 每页数量      
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		getFriendList(options: {
			profile?: number,
			page?: number,
			limit?: number,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 从云端获取好友申请列表
		 * 
		 * @param {Options} options - 参数对象
		 * 
		 * @param {Number} options.type - 类型，0=发给我申请，1=我发出去的申请      
		 * @param {Number} options.page - 页码      
		 * @param {Number} options.limit - 每页数量      
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		getFriendApplyList(options: {
			type?: number,
			page?: number,
			limit?: number,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 将全部好友申请设置为已读状态
		 * 
		 * @param {Options} options - 参数对象 
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		setApplyListRead(options: {
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 添加好友
		 * 
		 * @param {Options} options - 参数对象
		 * 
		 * @param {String} options.userId - 用户ID           
		 * @param {String} options.remark - 好友备注
		 * @param {String} options.extraMessage - 附言
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		addFriend(options: {
			userId: string,
			remark?: string,
			extraMessage?: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 删除好友
		 * 
		 * @param {Options} options - 参数对象
		 * 
		 * @param {Array<String>} options.members - 好友ID列表  
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		deleteFriend(options: {
			members: Array<string>,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 更新好友资料
		 * 
		 * @param {Options} options - 参数对象
		 * 
		 * @param {String} options.userId - 好友ID  
		 * @param {String} options.remark - 好友备注  
		 * @param {String} options.extend - 自定义扩展字段  
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		updateFriend(options: {
			userId: string,
			remark?: string,
			extend?: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 同意好友申请
		 * 
		 * @param {Options} options - 参数对象
		 * 
		 * @param {Number} options.id - 申请ID      
		 * @param {String} options.remark - 备注          
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		acceptApply(options: {
			id: number,
			remark?: string,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		 * 
		 * 拒绝好友申请
		 * 
		 * @param {Options} options - 参数对象
		 * 
		 * @param {Number} options.id - 申请ID             
		 * 
		 * @param {(result)=>{}} [options.success] - 成功回调
		 * @param {(error)=>{}} [options.fail] - 失败回调 
		 */
		refuseApply(options: {
			id: number,
			success?: (result: any) => void,
			fail?: (error: any) => void
		}): void;

		/**
		* 断开连接，此操作不会重连
		*/
		disConnect(): void;

		/**
		* 获取当前连接状态
		* 
		* 0：连接中 1：连接已打开 2：连接关闭中 3：连接已关闭 
		* @returns {number}
		*/
		readyState(): number;

		/**
		 * 设置APP在前台
		 */
		intoApp(): void;

		/**
		 * 设置APP已进入后台
		 */
		leaveApp(): void;

	}

	interface Message {

	}

	interface Conversation {

	}

	/**
	 * YeIMUniSDK预定义常量
	 */
	declare const YeIMUniSDKDefines = {
		/**
		 * 事件类型
		 */
		EVENT: {
			/**
			 * 网络状态变化
			 */
			NET_CHANGED,
			/**
			 * 会话列表变化
			 */
			CONVERSATION_LIST_CHANGED,
			/**
			 * 收到消息
			 */
			MESSAGE_RECEIVED,
			/**
			 * 撤回消息
			 */
			MESSAGE_REVOKED,
			/**
			 * 私聊会话已读回执
			 */
			PRIVATE_READ_RECEIPT,
			/**
			 * 用户被踢下线
			 */
			KICKED_OUT
		},
		/**
		 * 会话类型
		 */
		CONVERSATION_TYPE: {
			/**
			 * 私聊
			 */
			PRIVATE,
			/**
			 * 群聊
			 */
			GROUP
		},
		/**
		 * 消息类型
		 */
		MESSAGE_TYPE: {
			/**
			 * 文本消息
			 */
			TEXT,
			/**
			* 文本 @ 消息
			*/
			TEXT_AT,
			/**
			* 图片消息
			*/
			IMAGE,
			/**
			* 语音消息
			*/
			AUDIO,
			/**
			* 小视频消息
			*/
			VIDEO,
			/**
			* 位置消息
			*/
			LOCATION,
			/**
			* 自定义消息
			*/
			CUSTOM,
			/**
			* 合并消息
			*/
			MERGER,
			/**
			* 转发消息
			*/
			FORWARD,
			/**
			* 群聊系统通知
			*/
			GROUP_SYS_NOTICE
		},
		/**
		 * 用户相关常量
		 */
		USER: {
			/**
			 * 加好友验证方式
			 */
			ADDFRIEND: {
				/**
				 * 允许任何人添加自己为好友
				 */
				ALLOW,
				/**
				 * 需要经过自己确认才能添加自己为好友
				 */
				CONFIRM,
				/**
				 * 拒绝加好友
				 */
				DENY
			}
		},
		/**
		 * 群组相关常量
		 */
		GROUP: {
			/**
			 * 群申请处理方式
			 */
			JOINMODE: {
				/**
				 * 自有加入，不需要申请和审核，不需要被邀请人允许。
				 */
				FREE,
				/**
				 * 验证加入，需要申请，以及群主或管理员的同意才能入群
				 */
				CHECK,
				/**
				 * 禁止加入
				 */
				FORBIDDEN
			},
			/**
			 * 入群申请处理结果
			 */
			APPLYSTATUS: {
				/**
				 * 待处理 
				 */
				PENDING,
				/**
			   * 同意
			   */
				AGREE,
				/**
			   * 拒绝
			   */
				REFUSE
			}
		},
	}
}
