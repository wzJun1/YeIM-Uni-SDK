import {
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
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.userId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'userId 不能为空');
	}

	request(Api.User.fetchUserInfoById, 'GET', {
		userId: options.userId
	}).then((result) => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
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
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.nickname) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'nickname 不能为空');
	}

	if (!options.avatarUrl) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'avatarUrl 不能为空');
	}

	request(Api.User.updateUserInfo, 'POST', {
		nickname: options.nickname,
		avatarUrl: options.avatarUrl
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
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
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	request(Api.User.getBlackUserList, 'GET', {}).then((result) => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
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
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.members || options.members.length == 0) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'members 不能为空');
	}

	request(Api.User.addToBlackUserList, 'POST', {
		members: options.members
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
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
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.members || options.members.length == 0) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'members 不能为空');
	}

	request(Api.User.removeFromBlacklist, 'POST', {
		members: options.members
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

export {
	getUserInfo,
	updateUserInfo,
	getBlackUserList,
	addToBlackUserList,
	removeFromBlacklist
}
