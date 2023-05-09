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
	getCache,
	setCache
} from '../func/storage';
import md5 from '../utils/md5';

/**
 *  
 * 获取用户信息 
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {String} options.userId - 用户ID      
 * @param {Boolean} options.cloud - 从云端获取    
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

	let key = `yeim:userList:${md5(instance.userId)}`;

	if (options.cloud) {
		request(Api.User.fetchUserInfoById, 'GET', {
			userId: options.userId
		}).then((result) => {
			//保存到本地
			let list = getCache(key);
			list = list ? list : [];
			list.push(result);
			setCache(key, list);
			successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
		}).catch((fail) => {
			errHandle(options, fail.code, fail.message);
			log(1, fail);
		});
	} else {
		//查询本地缓存 
		let list = getCache(key);
		list = list ? list : [];
		let index = list.findIndex(item => {
			return item.userId === options.userId;
		});
		if (index !== -1) {
			//返回本地缓存
			successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, list[index]);
			//从云端更新一次本地缓存
			request(Api.User.fetchUserInfoById, 'GET', {
				userId: options.userId
			}).then((result) => {
				let list = getCache(key);
				list = list ? list : [];
				list[index] = result;
				setCache(key, list);
			}).catch((fail) => {
				errHandle(options, fail.code, fail.message);
				log(1, fail);
			});
		} else {
			//本地没有缓存则从云端获取
			request(Api.User.fetchUserInfoById, 'GET', {
				userId: options.userId
			}).then((result) => {
				//保存到本地
				let list = getCache(key);
				list = list ? list : [];
				list.push(result);
				setCache(key, list);
				successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
			}).catch((fail) => {
				errHandle(options, fail.code, fail.message);
				log(1, fail);
			});
		}
	}

}

/**
 *  
 * 更新我的用户资料 
 * 
 * @param {Object} options - 参数对象     
 * 
 * @param {String} options.nickname - 昵称      
 * @param {String} options.avatarUrl - 头像地址  
 * @param {Number} options.gender - 性别，0=未知，1=男性，2=女性 
 * @param {Number} options.mobile - 电话
 * @param {String} options.email - 邮箱
 * @param {String} options.birthday - 生日
 * @param {String} options.motto - 个性签名
 * @param {String} options.extend - 用户自定义扩展字段 
 * @param {Number} options.addFriendType - 好友添加我的方式
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 */
function updateUserInfo(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (Object.keys(options).length <= 0) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, '请至少选择一个属性进行更新');
	}

	request(Api.User.updateUserInfo, 'POST', options).then(() => {
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
 * @param {Array<String>} options.members - 用户ID列表    
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