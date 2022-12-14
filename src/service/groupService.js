import {
	instance
} from "../yeim-uni-sdk";
import {
	YeIMUniSDKDefines
} from '../const/yeim-defines';
import {
	emit
} from '../func/event';
import log from '../func/log';
import md5 from '../utils/md5';
import {
	buildSuccessObject,
	buildErrObject,
	successHandle,
	errHandle
} from "../func/callback";

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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.name) {
		return errHandle(options, "name 不能为空");
	}

	if (!options.avatarUrl) {
		return errHandle(options, "avatarUrl 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/create",
		data: options,
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				//群组创建成功
				successHandle(options, "创建成功");
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
 * 解散群组 
 * 
 * 仅群主可操作
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
 * dissolveGroup({
       groupId: "",
       success: (result) => {},
       fail: (error) => {}
   });
 */
function dissolveGroup(options) {
	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/dissolve",
		data: {
			groupId: options.groupId
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "解散成功");
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
 * 转让群主 
 * 
 * 仅群主可操作
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", "userId":"转让用户ID", success: (result) => {}, fail: (error) => {} }
 * 
 * @param {String} options.groupId - 群ID    
 * @param {String} options.userId - 转让用户ID 
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	if (!options.userId) {
		return errHandle(options, "userId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/transferLeader",
		data: {
			groupId: options.groupId,
			userId: options.userId
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "转让成功");
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
 * 更新群组资料 
 * 
 * @param {Object} options - 参数对象    
 * 
 * { "groupId":"群ID", "name":"群名称","avatarUrl":"群头像", success: (result) => {}, fail: (error) => {} }
 *
 * @param {String} options.groupId - 群ID
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/edit",
		data: options,
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "更新成功");
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/get",
		data: {
			groupId: options.groupId
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功", res.data.data);
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
		return errHandle(options, "请登陆后再试");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/list",
		data: {},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功", res.data.data);
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
 * 用户申请入群 
 * 
 * IM内用户均可调用此接口申请进入传入的群组ID的群，根据群申请处理方式不同，可能直接进入，也可能等待审核
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
 * joinGroup({
       groupId: "",
       success: (result) => {},
       fail: (error) => {}
   });
 */
function joinGroup(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/add",
		data: {
			groupId: options.groupId,
			members: [
				instance.userId
			]
		},
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {

				let group = res.data.data.group;
				let successList = res.data.data.successList;
				let ignoreList = res.data.data.ignoreList;

				if (ignoreList.indexOf(instance.userId) != -1) {
					return errHandle(options, "已在当前群组，请勿重复加入");
				}

				let success = false;
				if (successList.indexOf(instance.userId) != -1) {
					success = true;
				}

				if (!success) {
					return errHandle(options, "申请入群失败");
				}

				//自由加入，无需申请
				if (group.joinMode == YeIMUniSDKDefines.GROUP.JOINMODE.FREE) {
					successHandle(options, "成功加入群组");
				} else if (group.joinMode == YeIMUniSDKDefines.GROUP.JOINMODE.CHECK) {
					successHandle(options, "已发送入群申请，请等待审核");
				} else {
					//可有可无
				}

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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/leave",
		data: {
			groupId: options.groupId
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "退出成功");
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	if (!options.members || options.members.length <= 0) {
		return errHandle(options, "members 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/add",
		data: {
			groupId: options.groupId,
			members: options.members
		},
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功", res.data.data);
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	if (!options.members || options.members.length <= 0) {
		return errHandle(options, "members 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/delete",
		data: {
			groupId: options.groupId,
			members: options.members
		},
		method: 'POST',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功");
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/list",
		data: {
			groupId: options.groupId
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功", res.data.data);
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/set/adminstrator",
		data: {
			groupId: options.groupId,
			userId: options.userId,
			isAdmin: isAdmin === 1 ? isAdmin : 0
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功");
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/set/adminstrator",
		data: {
			groupId: options.groupId,
			userId: options.userId,
			isAdmin: options.isAdmin === 1 ? options.isAdmin : 0
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功");
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.id) {
		return errHandle(options, "id 不能为空");
	}

	if (!options.status) {
		return errHandle(options, "status 不能为空");
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/apply/change",
		data: {
			id: options.id,
			status: options.status
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功");
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
		return errHandle(options, "请登陆后再试");
	}

	if (!options.groupId) {
		return errHandle(options, "groupId 不能为空");
	}

	if (!options.userId) {
		return errHandle(options, "userId 不能为空");
	}

	if (!options.time) {
		options.time = 0;
	}

	uni.request({
		url: instance.defaults.baseURL + "/group/user/set/mute",
		data: {
			groupId: options.groupId,
			userId: options.userId,
			time: options.time
		},
		method: 'GET',
		header: {
			'token': instance.token
		},
		success: (res) => {
			if (res.data.code == 200) {
				successHandle(options, "接口调用成功");
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
