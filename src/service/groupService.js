import {
	instance
} from '../yeim-uni-sdk';
import {
	YeIMUniSDKDefines
} from '../const/yeim-defines';
import log from '../func/log';
import {
	successHandle,
	errHandle
} from '../func/callback';
import {
	Api,
	request
} from '../func/request';
import {
	YeIMUniSDKStatusCode
} from '../const/yeim-status-code';

/**
 *  
 * 创建群组 
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "name":"群名称","avatarUrl":"群头像", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.name - 群名称   
 * @param {String} options.avatarUrl - 群头像  
 * @param {String} [options.groupId] - 群ID，未填写时系统自动生成
 * @param {YeIMUniSDKDefines.GROUP.JOINMODE} [options.joinMode] - 群申请处理方式
 * @param {String} [options.introduction] - 群简介
 * @param {String} [options.notification] - 群公告
 * @param {Array<String>} [options.members] - 创建群聊初始化成员（用户ID数组）  
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * createGroup({
       name: "",
       avatarUrl: "", 
       success: (result) => {},
       fail: (error) => {}
   });
 */

function createGroup(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.name) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'name 不能为空');
	}

	if (!options.avatarUrl) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'avatarUrl 不能为空');
	}

	request(Api.Group.create, 'POST', options).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 解散群组 
 * 
 * 仅群主可操作
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} [options.groupId] - 群ID    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * dissolveGroup({
       groupId: "",
       success: (result) => {},
       fail: (error) => {}
   });
 */
function dissolveGroup(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.dissolve, 'GET', {
		groupId: options.groupId
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 转让群主 
 * 
 * 仅群主可操作
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", "userId":"转让用户ID", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} [options.groupId] - 群ID    
 * @param {String} [options.userId] - 转让用户ID 
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * transferLeader({
       groupId: "",
       userId: "",
       success: (result) => {},
       fail: (error) => {}
   });
 */
function transferLeader(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	if (!options.userId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'userId 不能为空');
	}

	request(Api.Group.transferLeader, 'GET', {
		groupId: options.groupId,
		userId: options.userId
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});
}

/**
 *  
 * 更新群组资料 
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", "name":"群名称","avatarUrl":"群头像", success: (result) => {}, fail: (error) => {} }
 *
 * @param {String} [options.groupId] - 群ID
 * @param {String} [options.name] - 群名称   
 * @param {String} [options.avatarUrl] - 群头像  
 * @param {YeIMUniSDKDefines.GROUP.JOINMODE} [options.joinMode] - 群申请处理方式
 * @param {String} [options.introduction] - 群简介
 * @param {String} [options.notification] - 群公告
 * @param {Number} [options.isMute] - 全体禁言 0,1
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
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
function updateGroup(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.update, 'POST', options).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 通过群ID获取群组资料
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example 
 * getGroup({
       groupId: "",
       success: (result) => {},
       fail: (error) => {}
   });
 */
function getGroup(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.fetchGroupInfoById, 'GET', {
		groupId: options.groupId
	}).then((result) => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 获取我的群组列表
 * 
 * @param {Object} options - 参数对象    
 *  
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example 
 * getGroupList({
       success: (result) => {},
       fail: (error) => {}
   });
 */
function getGroupList(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	request(Api.Group.list, 'GET', {}).then((result) => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 用户申请入群 
 * 
 * IM内用户均可调用此接口申请进入传入的群组ID的群，根据群申请处理方式不同，可能直接进入，也可能等待审核
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId": "群ID", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * joinGroup({
       groupId: "",
       success: (result) => {},
       fail: (error) => {}
   });
 */
function joinGroup(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.addUser, 'POST', {
		groupId: options.groupId,
		members: [
			instance.userId
		]
	}).then((result) => {

		//群组信息
		let group = result.group;
		//操作成功的用户ID列表
		let successList = result.successList;
		//忽略了的用户ID列表
		let ignoreList = result.ignoreList;

		//添加的用户重复加入
		if (ignoreList.indexOf(instance.userId) != -1) {
			return errHandle(options, YeIMUniSDKStatusCode.GROUP_APPLY_REPEAT.code, YeIMUniSDKStatusCode
				.GROUP_APPLY_REPEAT.describe);
		}

		//判断成功列表中是否包含当前申请的用户
		let success = false;
		if (successList.indexOf(instance.userId) != -1) {
			success = true;
		}

		//申请入群的接口异常
		if (!success) {
			return errHandle(options, YeIMUniSDKStatusCode.GROUP_APPLY_ERROR.code, YeIMUniSDKStatusCode
				.GROUP_APPLY_ERROR.describe);
		}

		//自由加入，无需申请
		if (group.joinMode == YeIMUniSDKDefines.GROUP.JOINMODE.FREE) {
			successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.code, '成功加入群组');
		} else if (group.joinMode == YeIMUniSDKDefines.GROUP.JOINMODE.CHECK) {
			successHandle(options, YeIMUniSDKStatusCode.GROUP_APPLY_WAIT.code, YeIMUniSDKStatusCode
				.GROUP_APPLY_WAIT.describe);
		} else {
			return errHandle(options, YeIMUniSDKStatusCode.NORMAL_ERROR.code, YeIMUniSDKStatusCode
				.NORMAL_ERROR.describe);
		}

	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});
}

/**
 *  
 * 退出群组  
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * leaveGroup({
       groupId: "",
       success: (result) => {},
       fail: (error) => {}
   });
 */
function leaveGroup(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.leave, 'GET', {
		groupId: options.groupId
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 添加群成员  
 * 
 * 不限权限，IM内用户均可调用此接口，但根据群申请处理方式不同，可能直接进入，也可能等待审核
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", "members": ["user1", "user2"], success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID    
 * @param {Array<String>} options.members - 用户ID列表   
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * addGroupUsers({
       groupId: "",
       members: ["user1", "user2"],
       success: (result) => {},
       fail: (error) => {}
   });
 */
function addGroupUsers(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	if (!options.members || options.members.length <= 0) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'members 不能为空');
	}

	request(Api.Group.addUser, 'POST', {
		groupId: options.groupId,
		members: options.members
	}).then((result) => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 移除群成员  
 * 
 * 仅群主可使用此接口
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", "members": ["user1", "user2"], success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID    
 * @param {Array<String>} options.members - 用户ID列表   
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * removeGroupUsers({
       groupId: "",
       members: ["user1", "user2"],
       success: (result) => {},
       fail: (error) => {}
   });
 */
function removeGroupUsers(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	if (!options.members || options.members.length <= 0) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'members 不能为空');
	}

	request(Api.Group.remove, 'POST', {
		groupId: options.groupId,
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
 * 获取群成员列表 
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", success: (result) => {}, fail: (error) => {}  }
 * 
 * @param {String} options.groupId - 群ID  
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * getGroupUserList({
       groupId: "group_1",
       success: (result) => {},
       fail: (error) => {}
   });
 */

function getGroupUserList(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.memberList, 'GET', {
		groupId: options.groupId
	}).then((result) => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 设置群管理员
 * 
 * 仅群主可操作此接口 
 * 
 * @param {Object} options - 参数对象 
 * 
 * { "groupId":"群ID","userId":"要设置的用户ID","isAdmin":"是否设置管理员，0=取消，1=设置", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID  
 * @param {String} options.userId - 要设置的用户ID  
 * @param {Number} options.isAdmin - 是否设置管理员，0=取消，1=设置  
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
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
function setAdminstrator(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.adminstrator, 'GET', {
		groupId: options.groupId,
		userId: options.userId,
		isAdmin: isAdmin === 1 ? isAdmin : 0
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 获取群组用户入群申请列表
 * 
 * 群主或管理员调用此接口可获取名下所有群组入群申请列表 
 * 
 * @param {Object} options - 参数对象    
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * getGroupApplyList({
       success: (result) => {},
       fail: (error) => {}
   });
 */

function getGroupApplyList(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	request(Api.Group.applyList, 'GET', {}).then((result) => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe, result);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 处理群组用户入群申请
 * 
 * 申请记录所在的群组中群主或管理员可调用此接口处理申请 
 * 
 * @param {Object} options - 参数对象    
 * @param {Number} options.id - 申请记录的ID  
 * @param {YeIMUniSDKDefines.GROUP.APPLYSTATUS} options.status - 处理结果  
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
 * 
 * @example  
 * handleApply({
       id: 5, //申请记录的ID  
       status: YeIMUniSDKDefines.GROUP.APPLYSTATUS.AGREE, //同意
       success: (result) => {},
       fail: (error) => {}
   });
 */

function handleApply(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.id) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'id 不能为空');
	}

	if (!options.status) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'status 不能为空');
	}

	request(Api.Group.handleApply, 'GET', {
		id: options.id,
		status: options.status
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

/**
 *  
 * 禁言群成员
 * 
 * 群组中群主或管理员可调用此接口禁言群成员，每次设置的分钟数均从操作时间开始算起，设置0则取消禁言
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID","userId":"禁言用户ID","time":"禁言分钟数", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID  
 * @param {String} options.userId - 禁言用户ID  
 * @param {Number} options.time - 禁言分钟数  
 * @param {(result)=>{}} [options.success] - 成功回调
 * @param {(error)=>{}} [options.fail] - 失败回调 
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

function setMute(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, YeIMUniSDKStatusCode.LOGIN_EXPIRE.code, YeIMUniSDKStatusCode.LOGIN_EXPIRE.describe);
	}

	if (!options.groupId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'groupId 不能为空');
	}

	if (!options.userId) {
		return errHandle(options, YeIMUniSDKStatusCode.PARAMS_ERROR.code, 'userId 不能为空');
	}

	if (!options.time) {
		options.time = 0;
	}

	request(Api.Group.setMute, 'GET', {
		groupId: options.groupId,
		userId: options.userId,
		time: options.time
	}).then(() => {
		successHandle(options, YeIMUniSDKStatusCode.NORMAL_SUCCESS.describe);
	}).catch((fail) => {
		errHandle(options, fail.code, fail.message);
		log(1, fail);
	});

}

export {
	createGroup,
	dissolveGroup,
	getGroup,
	getGroupList,
	transferLeader,
	updateGroup,
	joinGroup,
	leaveGroup,
	addGroupUsers,
	getGroupUserList,
	removeGroupUsers,
	setAdminstrator,
	getGroupApplyList,
	handleApply,
	setMute
}
