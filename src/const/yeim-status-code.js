//客户端状态码

var YeIMUniSDKStatusCode = {
	NORMAL_SUCCESS: {
		code: 200,
		describe: '接口调用成功' //接口调用成功的统一状态码
	},
	NORMAL_ERROR: {
		code: 500,
		describe: '未知错误' //未知错误的统一状态码
	},
	SDK_PARAMS_ERROR: {
		code: 9001,
		describe: 'YeIMUniSDK 初始化失败，请检查参数是否存在异常'
	},
	CONNECT_ERROR: {
		code: 10001,
		describe: '聊天服务网络连接错误'
	},
	NO_USERID: {
		code: 10002,
		describe: '用户验证失败，请检查userId、token'
	},
	LOGIN_EXPIRE: {
		code: 10003,
		describe: '用户登录状态过期，请重新登录'
	},
	NO_CONVERSATION: {
		code: 10004,
		describe: '未找到此会话'
	},
	PARAMS_ERROR: {
		code: 10008,
		describe: '请求参数错误'
	},
	LOGIN_ERROR: {
		code: 10103,
		describe: '用户登录失败，请稍后再试'
	},
	GROUP_APPLY_REPEAT: {
		code: 10251,
		describe: '此用户已在当前群组，请勿重复加入'
	},
	GROUP_APPLY_ERROR: {
		code: 10252,
		describe: '申请入群异常，请稍后重试'
	},
	GROUP_APPLY_WAIT: {
		code: 10253,
		describe: '已发送入群申请，请等待审核'
	},
	UPLOAD_ERROR: {
		code: 10300,
		describe: '本地上传失败，请检查配置'
	},
	DOWNLOAD_ERROR: {
		code: 10301,
		describe: '文件下载失败'
	},
	COS_UPLOAD_ERROR: {
		code: 10302,
		describe: '腾讯云COS上传文件失败，请检查配置是否填写正确'
	},
	COS_DOWNLOAD_ERROR_1: {
		code: 10303,
		describe: '腾讯云媒体截图接口：下载视频缩略图失败，请检查网络或开启万象功能'
	},
	OSS_UPLOAD_ERROR: {
		code: 10304,
		describe: '阿里云OSS上传文件失败，请检查配置是否填写正确'
	},
};

export {
	YeIMUniSDKStatusCode
};
