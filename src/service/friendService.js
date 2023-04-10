import {
	YeIMUniSDKDefines,
	instance
} from '../yeim-uni-sdk';
import {
	Api,
	request
} from '../func/request';
import {
	successHandle,
	errHandle
} from '../func/callback';
import {
	YeIMUniSDKStatusCode
} from '../const/yeim-status-code';
import {
	emit
} from '../func/event';
import log from '../func/log';
import {
	getCache,
	setCache
} from '../func/storage';
import md5 from '../utils/md5';

/**
 * 
 * 从云端获取好友列表
 * 
 * @param {Object} options - 参数对象
 * @param {Boolean} options.cloud - 是否从云端拉取
 * @param {Number} options.profile - 资料类型，0=简略资料，1=详细资料 (云端拉取有效)     
 * @param {Number} options.page - 页码      
 * @param {Number} options.limit - 每页数量      
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function getFriendList(options) {

	let key = `yeim:friendList:${md5(instance.userId)}`;
	let page = options.page ? options.page : 1;
	let limit = options.limit ? options.limit : 20;
	if (options.cloud) {
		//从云端获取好友列表
		request(Api.Friend.fetchList, 'GET', {
			profile: options.profile ? 0 : 1,
			page: page,
			limit: limit,
		}).then((result) => {
			const {
				records
			} = result;
			successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, records);
		}).catch((fail) => {
			errHandle(options, fail.code, fail.message);
			log(1, fail);
		});
	} else {
		//从本地获取好友列表

		//查询本地缓存 
		let list = getCache(key);
		list = list ? list : [];
		let skipNum = (page - 1) * limit;
		list = (skipNum + limit >= list.length) ? list.slice(skipNum, list.length) : list.slice(skipNum,
			skipNum + limit);
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, list);
	}
}

/**
 *  
 * 响应好友列表更新     
 * 
 */
function handleFriendListChanged() {
	//获取最新记录
	getFriendList({
		cloud: true,
		page: 1,
		limit: 9999999,
		success: (result) => {
			let key = `yeim:friendList:${md5(instance.userId)}`;
			setCache(key, result.data);
			emit(YeIMUniSDKDefines.EVENT.FRIEND_LIST_CHANGED, result);
		},
		fail: () => {
			emit(YeIMUniSDKDefines.EVENT.FRIEND_LIST_CHANGED, null);
		}
	});
}

/**
 *  
 * 响应好友申请列表更新     
 * 
 */
function handleFriendApplyListChanged(type = 0) {
	//获取最新记录
	getFriendApplyList({
		cloud: true,
		type: type,
		page: 1,
		limit: 9999999,
		success: (result) => {
			const {
				data: {
					records,
					unread
				}
			} = result;
			let listKey = `yeim:friendApplyList:${md5(instance.userId)}`;
			let unreadKey = `yeim:friendApplyUnread:${md5(instance.userId)}`;
			setCache(listKey, records);
			setCache(unreadKey, unread);
			emit(YeIMUniSDKDefines.EVENT.FRIEND_APPLY_LIST_CHANGED, result);
		},
		fail: () => {
			emit(YeIMUniSDKDefines.EVENT.FRIEND_APPLY_LIST_CHANGED, null);
		}
	});
}

/**
 * 
 * 从云端获取好友申请列表
 * 
 * @param {Object} options - 参数对象
 * 
 * @param {Boolean} options.cloud - 是否从云端拉取 
 * @param {Number} options.type - 类型，0=发给我申请，1=我发出去的申请 (云端拉取有效)     
 * @param {Number} options.page - 页码      
 * @param {Number} options.limit - 每页数量      
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function getFriendApplyList(options) {

	let listKey = `yeim:friendApplyList:${md5(instance.userId)}`;
	let unreadKey = `yeim:friendApplyUnread:${md5(instance.userId)}`;
	let page = options.page ? options.page : 1;
	let limit = options.limit ? options.limit : 20;
	if (options.cloud) {
		//从云端获取好友申请列表
		request(Api.Friend.fetchApplyList, 'GET', {
			type: options.type ? options.type : 0,
			page: page,
			limit: limit,
		}).then((result) => {
			const {
				apply: {
					records
				},
				unread
			} = result;
			successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, {
				records,
				unread
			});
		}).catch((fail) => {
			errHandle(options, fail.code, fail.message);
			log(1, fail);
		});
	} else {
		//从本地获取好友列表

		//查询本地缓存 
		let list = getCache(listKey);
		list = list ? list : [];
		let skipNum = (page - 1) * limit;
		list = (skipNum + limit >= list.length) ? list.slice(skipNum, list.length) : list.slice(skipNum,
			skipNum + limit);

		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, {
			list,
			unread: getCache(unreadKey) ? getCache(unreadKey) : 0
		});

	}
}

/**
 * 
 * 将全部好友申请设置为已读状态
 * 
 * @param {Object} options - 参数对象  
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function setApplyListRead(options) {
	request(Api.Friend.setRead, 'GET', {}).then(() => {
		let unreadKey = `yeim:friendApplyUnread:${md5(instance.userId)}`;
		getCache(unreadKey, 0);
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, null);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});
}


/**
 * 
 * 同意好友申请
 * 
 * @param {Object} options - 参数对象
 * 
 * @param {Number} options.id - 申请ID      
 * @param {String} options.remark - 备注          
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function acceptApply(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.id) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'id 不能为空');
	}

	request(Api.Friend.acceptApply, 'GET', {
		id: options.id,
		remark: options.remark ? options.remark : null
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, null);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});
}

/**
 * 
 * 拒绝好友申请
 * 
 * @param {Object} options - 参数对象
 * 
 * @param {Number} options.id - 申请ID           
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function refuseApply(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.id) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'id 不能为空');
	}

	request(Api.Friend.refuseApply, 'GET', {
		id: options.id
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, null);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});
}

/**
 * 
 * 添加好友
 * 
 * @param {Object} options - 参数对象
 * 
 * @param {String} options.userId - 用户ID           
 * @param {String} options.remark - 好友备注
 * @param {String} options.extraMessage - 附言
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function addFriend(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.userId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'userId 不能为空');
	}

	request(Api.Friend.addFriend, 'POST', {
		userId: options.userId,
		remark: options.remark ? options.remark : null,
		extraMessage: options.extraMessage ? options.extraMessage : null
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, null);
	}).catch((fail) => {
		if (fail.code === YeIMUniSDKStatusCode.APPLY_NEED.code) {
			successHandle(options, YeIMUniSDKStatusCode.APPLY_NEED.describe, null, YeIMUniSDKStatusCode
				.APPLY_NEED.code);
		} else {
			errHandle(options, fail.code, fail.message);
			log(1, fail);
		}
	});

}

/**
 * 
 * 删除好友
 * 
 * @param {Object} options - 参数对象
 * 
 * @param {Array<String>} options.members - 好友ID列表  
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function deleteFriend(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.members) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'members 不能为空');
	}

	request(Api.Friend.deleteFriend, 'POST', {
		members: options.members
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, null);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 * 
 * 更新好友资料
 * 
 * @param {Object} options - 参数对象
 * 
 * @param {String} options.userId - 好友ID  
 * @param {String} options.remark - 好友备注  
 * @param {String} options.extend - 自定义扩展字段  
 * 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 */
function updateFriend(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.userId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'userId 不能为空');
	}

	if (!options.remark && !options.extend) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, '请至少传入一个参数更新');
	}

	request(Api.Friend.updateFriend, 'POST', {
		userId: options.userId,
		remark: options.remark ? options.remark : null,
		extend: options.extend ? options.extend : null,
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, null);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

export {
	getFriendList,
	handleFriendListChanged,
	handleFriendApplyListChanged,
	getFriendApplyList,
	setApplyListRead,
	addFriend,
	deleteFriend,
	updateFriend,
	acceptApply,
	refuseApply
}
