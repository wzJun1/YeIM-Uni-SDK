import {
	instance
} from "../yeim-uni-sdk";

import {
	successHandle,
	errHandle
} from '../func/callback';



/**
 * 更新用户资料
 * @param {Object} options
 */
function updateUserInfo(options) {
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

export {
	updateUserInfo
}
