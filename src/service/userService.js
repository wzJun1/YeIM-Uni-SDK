import {
	instance
} from "../yeim-uni-sdk";

import {
	successHandle,
	errHandle
} from '../func/callback';

/**
 *  
 * 获取用户信息 
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {String} options.userId - 用户ID      
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function getUserInfo(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.userId) {
		return errHandle(options, "userId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/user/info",
		data: {
			userId: options.userId
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			successHandle(options, "接口调用成功", res.data.data);
		},
		fail: (err) => {
			errHandle(options, err);
			log(1, err);
		}
	});

}
/**
 *  
 * 更新我的用户资料 
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {String} options.nickname - 昵称      
 * @param {String} options.avatarUrl - 头像地址      
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function updateUserInfo(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.nickname) {
		return errHandle(options, "nickname 不能为空");
	}
	if (!options.avatarUrl) {
		return errHandle(options, "avatarUrl 不能为空");
	}
	uni.request({
		url: instance.defaults.baseURL + "/user/update",
		data: {
			nickname: options.nickname,
			avatarUrl: options.avatarUrl
		},
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			successHandle(options, "接口调用成功");
		},
		fail: (err) => {
			errHandle(options, err);
			log(1, err);
		}
	});
}

/**
 *  
 * 获取黑名单列表 
 * 
 * @param {Object} options - 参数对象     
 *    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function getBlackUserList(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	uni.request({
		url: instance.defaults.baseURL + "/user/black/list",
		data: {},
		method: 'GET',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "获取成功", res.data.data);
			} else {
				errHandle(options, res.data.message);
			}
		},
		fail: (err) => {
			errHandle(options, err);
		}
	});
}

/**
 *  
 * 添加用户到黑名单 
 *  
 * 
 * @param {Object} options - 参数对象    
 * 
 * {"members": ["user1", "user2"], success: (result) => {}, fail: (error) => {} }

 * 
 * @param {String} options.members - 用户ID列表    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * addToBlackUserList({
       members: ["user1", "user2"],
       success: (result) => {},
       fail: (error) => {}
   });
 */
function addToBlackUserList(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.members || options.members.length == 0) {
		return errHandle(options, "members 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/user/black/add",
		data: {
			members: options.members
		},
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "添加成功");
			} else {
				errHandle(options, res.data.message);
			}
		},
		fail: (err) => {
			errHandle(options, err);
		}
	});
}

/**
 *  
 * 移除黑名单
 *  
 * 
 * @param {Object} options - 参数对象    
 * 
 * {"members": ["user1", "user2"], success: (result) => {}, fail: (error) => {} }

 * 
 * @param {String} options.members - 用户ID列表    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * removeFromBlacklist({
       members: ["user1", "user2"],
       success: (result) => {},
       fail: (error) => {}
   });
 */
function removeFromBlacklist(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.members || options.members.length == 0) {
		return errHandle(options, "members 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/user/black/remove",
		data: {
			members: options.members
		},
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "移除成功");
			} else {
				errHandle(options, res.data.message);
			}
		},
		fail: (err) => {
			errHandle(options, err);
		}
	});
}

export {
	getUserInfo,
	updateUserInfo,
	getBlackUserList,
	addToBlackUserList,
	removeFromBlacklist
}
