/*eslint-disable*/

import {
	YeIMUniSDKStatusCode
} from '../const/yeim-status-code';
import {
	fetch
} from '../utils/fetch';
import queryParams from '../utils/queryParams';
import {
	instance
} from '../yeim-uni-sdk';
import {
	errHandle,
	successHandle
} from './callback';
import log from './log';

/**
 * APIURL
 */
let Api = {
	//用户相关接口
	User: {
		//根据userId查询用户资料
		fetchUserInfoById: '/user/info',
		//用户更新资料
		updateUserInfo: '/user/update',
		//黑名单列表
		getBlackUserList: '/user/black/list',
		//添加到黑名单
		addToBlackUserList: '/user/black/add',
		//移出黑名单
		removeFromBlacklist: '/user/black/remove'
	},
	//群组相关接口
	Group: {
		//创建群组
		create: '/group/create',
		//更新群组
		update: '/group/edit',
		//解散群组
		dissolve: '/group/dissolve',
		//通过群ID获取群组资料
		fetchGroupInfoById: '/group/get',
		//获取当前登录用户群组列表
		list: '/group/list',
		//转让群组
		transferLeader: '/group/transferLeader',
		//添加用户入群
		addUser: '/group/user/add',
		//退出群组
		leave: '/group/user/leave',
		//移除群成员
		remove: '/group/user/delete',
		//获取群成员列表
		memberList: '/group/user/list',
		//设置群管理员
		adminstrator: '/group/user/set/adminstrator',
		//获取入群申请请求列表
		applyList: '/group/user/apply/list',
		//处理入群申请
		handleApply: '/group/user/apply/change',
		//禁言群成员
		setMute: '/group/user/set/mute'
	},
	//会话相关接口
	Conversation: {
		//查询用户会话列表
		fetchConversationList: '/conversation/list',
		//清除私聊会话未读数
		clearConversationUnread: '/conversation/update/unread',
		//删除会话，将同时删除聊天记录
		deleteConversation: '/conversation/delete'
	},
	//消息相关接口
	Message: {
		//通过http发送消息
		sendMessage: '/message/save',
		//获取历史消息记录
		fetchHistoryMessageList: '/v117/message/list',
		//删除消息
		deleteMessage: '/message/delete',
		//撤回消息
		revokeMessage: '/message/revoke'
	},
	//好友相关接口
	Friend: {
		//获取好友申请列表
		fetchList: '/friend/list',
		//获取好友申请列表
		fetchApplyList: '/friend/apply/list',
		//将全部好友申请设置为已读状态
		setRead: '/friend/apply/set/read',
		//同意好友申请
		acceptApply: '/friend/apply/accept',
		//拒绝好友申请
		refuseApply: '/friend/apply/refuse',
		//添加好友
		addFriend: '/friend/add',
		//删除好友
		deleteFriend: '/friend/delete',
		//更新好友资料
		updateFriend: '/friend/update'
	},
	//推送相关
	Push: {
		//APP开启离线推送后，绑定个推clientID
		bindClientId: '/user/bind/push/id'
	},
	//上传相关
	Upload: {
		//获取上传配置信息
		sign: '/upload/sign',
		//通用上传
		normal: '/upload',
		//图片上传
		image: '/upload/image',
		//视频上传
		video: '/upload/video'
	}
}

/**
 * 公共请求 
 * 
 *
 * @param {String} url - 请求路由
 * @param {String} method - 请求方法
 * @param {Object} data - 请求参数
 * 
 * @return uni.request Promise
 *  
 */
function request(url, method = 'GET', data = null) {

	return new Promise((resolve, reject) => {

		if (instance.uni) {
			uni.request({
				url: instance.defaults.baseURL + url,
				data: data,
				method: method,
				header: {
					'content-type': 'application/json',
					'token': instance.token != null ? instance.token : ''
				},
				success: (result) => {
					if (result.data == null) {
						return reject({
							code: YeIMUniSDKStatusCode.NORMAL_ERROR.code,
							message: result.message ? result.message : YeIMUniSDKStatusCode
								.NORMAL_ERROR.describe,
							data: null
						});
					}
					result = result.data;
					let code = result.code;
					if (code === YeIMUniSDKStatusCode.NORMAL_SUCCESS.code) {
						resolve(result.data ? result.data : null);
					} else {
						reject(result);
					}
				},
				fail: (fail) => {
					log(1, fail);
					reject({
						code: YeIMUniSDKStatusCode.NORMAL_ERROR.code,
						message: JSON.stringify(fail),
						data: null
					});
				}
			});
		} else {

			let options = {
				method: method,
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
					'token': instance.token != null ? instance.token : ''
				},
			};

			if (method == "GET") {
				url = url + queryParams(data, true);
				delete options.body;
			}

			fetch(instance.defaults.baseURL + url, options).then(async (response) => {
				let result = await response.json();
				if (result == null) {
					return reject({
						code: YeIMUniSDKStatusCode.NORMAL_ERROR.code,
						message: result.message ? result.message : YeIMUniSDKStatusCode
							.NORMAL_ERROR.describe,
						data: null
					});
				}
				let code = result.code;
				if (code === YeIMUniSDKStatusCode.NORMAL_SUCCESS.code) {
					resolve(result.data ? result.data : null);
				} else {
					reject(result);
				}
			}, (error) => {
				log(1, error);
				reject({
					code: YeIMUniSDKStatusCode.NORMAL_ERROR.code,
					message: JSON.stringify(error.message),
					data: null
				});
			})
		}
	});
}

/**
 * 公共上传
 * 
 * @param {Object} options - 请求参数
 * @param {String} options.url - 请求地址
 * @param {String} options.name - 文件上传的标识符
 * @param {Object} options.header - 请求头
 * @param {Object} options.data - 请求参数
 * @param {String} options.filePath - 上传文件资源的路径
 * @param {Boolean} options.ignoreResult - 是否忽略结果
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @return uploadTask
 *  
 */
function upload(options) {
	return uni.uploadFile({
		url: options.url,
		name: options.name,
		formData: options.data,
		header: options.header,
		filePath: options.filePath,
		success: (result) => {
			//忽略结果
			if (options.ignoreResult) {
				successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe)
			} else {
				if (result.data == null) reject(null);
				result = JSON.parse(result.data);
				let code = result.code;
				if (code === YeIMUniSDKStatusCode.NORMAL_SUCCESS.code) {
					console.log(111)
					console.log(result.data)
					successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result.data ?
						result.data : null)
				} else {
					errHandle(options, code, result.message);
				}
			}
		},
		fail: (fail) => {
			log(1, fail);
			errHandle(options, YeIMUniSDKStatusCode.NORMAL_ERROR.code, fail);
		}
	});
}

/**
 * 公共上传
 * 
 * @param {Object} options - 请求参数
 * @param {String} options.url - 请求的下载地址 
 * @param {Object} options.header - 请求头 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @return downloadTask
 *  
 */
function download(options) {
	return uni.downloadFile({
		url: options.url,
		header: options.header,
		success: (downloadRes) => {
			if (downloadRes.statusCode === 200) {
				successHandle(options, YeIMUniSDKStatusCode
					.NORMAL_SUCCESS.describe, downloadRes.tempFilePath)
			} else {
				errHandle(options, YeIMUniSDKStatusCode.DOWNLOAD_ERROR
					.code, YeIMUniSDKStatusCode.DOWNLOAD_ERROR
					.code.describe);
			}
		},
		fail: (fail) => {
			log(1, fail);
			errHandle(options, YeIMUniSDKStatusCode.DOWNLOAD_ERROR
				.code, YeIMUniSDKStatusCode.DOWNLOAD_ERROR
				.code.describe);
		}
	});
}

export {
	Api,
	request,
	upload,
	download
}