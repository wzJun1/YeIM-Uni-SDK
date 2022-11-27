import {
	instance
} from "../yeim-uni-sdk";

import {
	successHandle,
	errHandle
} from '../func/callback';

import md5 from '../utils/md5';

import log from '../func/log';

import CryptoJS from '../utils/CryptoJS';


/**
 * 获取媒体上传参数
 */
async function getMediaUploadParams() {
	let [err, res] = await uni.request({
		url: instance.defaults.baseURL + "/upload/sign",
		data: {},
		method: 'GET',
		header: {
			'content-type': 'application/json',
			'token': instance.token
		}
	});
	if (!res || !res.data || !res.data.data) {
		log(1, "媒体上传参数获取失败！");
	} else {
		let data = res.data.data;
		instance.mediaUploadParams = data;
	}
}

/**
 * 生成腾讯云COS 对象存储 请求签名 Authorization
 * @url https://cloud.tencent.com/document/product/436/7778
 * 
 * @param {String} method @description 请求方法名称
 * @param {String} path @description url-param-list
 * @param {String} headers @description q-header-list
 */
async function buildCosAuthorization(method, path, headers) {
	let time = parseInt((new Date()).getTime() / 1000) - 1;
	if (!instance.mediaUploadParams || time > instance.mediaUploadParams.expireTime) {
		//过期，重新获取
		await getMediaUploadParams();
	}
	let nowTime = instance.mediaUploadParams.nowTime;
	let expireTime = instance.mediaUploadParams.expireTime;
	let qSignAlgorithm = "sha1";
	let qAk = instance.mediaUploadParams.secretId;
	let qSignTime = nowTime + ";" + expireTime;
	let qKeyTime = nowTime + ";" + expireTime;
	let signKey = instance.mediaUploadParams.signKey;
	let httpString = method + "\n" + path + "\n\n" + headers + "\n";
	let stringToSign = qSignAlgorithm + "\n" + qKeyTime + "\n" + CryptoJS.SHA1(httpString) + "\n";
	let signature = CryptoJS.HmacSHA1(stringToSign, signKey);
	let authorization = "q-sign-algorithm=" + qSignAlgorithm + "&q-ak=" + qAk +
		"&q-sign-time=" + qSignTime + "&q-key-time=" + qKeyTime + "&q-header-list=&q-url-param-list=&q-signature=" +
		signature;
	return authorization;
}

/**
 *
 * 通用上传接口
 * 外部暴露
 *
 * @param {Object} options
 * @param {String} options.filename @description 文件名称（需带后缀）
 * @param {String} options.filepath @description 本地文件临时路径
 * @param {Function} options.onProgress @description 上传进度回调
 */
function upload(options) {

	if (!instance.checkLogged()) {
		return errHandle(options, "请登陆后再试");
	}

	if (!instance.mediaUploadParams) {
		return log(1, "上传参数获取失败！");
	}

	let mediaUploadParams = instance.mediaUploadParams;
	let suffix = options.filename.substring(options.filename.lastIndexOf("."));
	let filename = md5((new Date()).getTime() + "_" + options.filename) + "_image" + suffix;

	let uploadUrl = "https://" + mediaUploadParams.bucket + ".cos." + mediaUploadParams.region + ".myqcloud.com";
	let resUrl = (mediaUploadParams.customDomain ? mediaUploadParams.customDomain : uploadUrl) + "/" + filename;

	//腾讯云COS对象存储
	if (mediaUploadParams.storage == "cos") {

		setTimeout(async () => {
			let authorization = await buildCosAuthorization('post', '/', '');
			let uploadTask = uni.uploadFile({
				url: uploadUrl,
				name: 'file',
				formData: {
					'key': filename,
					'success_action_status': 200,
					'Signature': authorization,
					'Content-Type': ''
				},
				header: {
					Authorization: authorization,
				},
				filePath: options.filepath,
				success: (res) => {
					successHandle(options, "success", {
						url: resUrl
					})
				},
				fail: (err) => {
					errHandle(options, err);
				}
			});
			if (options.onProgress !== undefined && typeof options.onProgress === "function") {
				uploadTask.onProgressUpdate((res) => {
					options.onProgress(res);
				});
			}
		}, 0);
	}
}

/**
 *
 * 上传图片
 * 外部暴露
 *
 * @param {Object} options
 * @param {String} options.filename @description 文件名称
 * @param {String} options.filepath @description 本地文件临时路径
 * @param {Function} options.onProgress @description 上传进度回调
 */
function uploadImage(options) {
	if (!instance.mediaUploadParams) {
		return log(1, "媒体上传参数获取失败！");
	}
	let mediaUploadParams = instance.mediaUploadParams;
	let suffix = options.filename.substring(options.filename.lastIndexOf("."));
	let filename = md5((new Date()).getTime() + "_" + options.filename) + "_image" + suffix;

	let uploadUrl = "https://" + mediaUploadParams.bucket + ".cos." + mediaUploadParams.region + ".myqcloud.com";
	let resUrl = (mediaUploadParams.customDomain ? mediaUploadParams.customDomain : uploadUrl) + "/" + filename;

	//腾讯云COS对象存储
	if (mediaUploadParams.storage == "cos") {

		setTimeout(async () => {
			let authorization = await buildCosAuthorization('post', '/', '');
			let uploadTask = uni.uploadFile({
				url: uploadUrl,
				name: 'file',
				formData: {
					'key': filename,
					'success_action_status': 200,
					'Signature': authorization,
					'Content-Type': ''
				},
				header: {
					Authorization: authorization,
				},
				filePath: options.filepath,
				success: (res) => {
					successHandle(options, "success", {
						url: resUrl
					})
				},
				fail: (err) => {
					errHandle(options, err);
				}
			});
			if (options.onProgress !== undefined && typeof options.onProgress === "function") {
				uploadTask.onProgressUpdate((res) => {
					options.onProgress(res);
				});
			}
		}, 0);
	}
}

/**
 * 上传音频
 *
 * @param {Object} options
 * @param {String} options.filename @description 文件名称
 * @param {String} options.filepath @description 本地文件临时路径
 * @param {Function} options.onProgress @description 上传进度回调
 */
function uploadAudio(options) {
	if (!instance.mediaUploadParams) {
		return log(1, "媒体上传参数获取失败！");
	}
	let mediaUploadParams = instance.mediaUploadParams;
	let suffix = options.filename.substring(options.filename.lastIndexOf("."));
	let filename = md5((new Date()).getTime() + "_" + options.filename) + "_audio" + suffix;

	let uploadUrl = "https://" + mediaUploadParams.bucket + ".cos." + mediaUploadParams.region + ".myqcloud.com";
	let resUrl = (mediaUploadParams.customDomain ? mediaUploadParams.customDomain : uploadUrl) + "/" + filename;

	//腾讯云COS对象存储
	if (mediaUploadParams.storage == "cos") {

		setTimeout(async () => {
			let authorization = await buildCosAuthorization('post', '/', '');
			let uploadTask = uni.uploadFile({
				url: uploadUrl,
				name: 'file',
				formData: {
					'key': filename,
					'success_action_status': 200,
					'Signature': authorization,
					'Content-Type': ''
				},
				header: {
					Authorization: authorization,
				},
				filePath: options.filepath,
				success: (res) => {
					successHandle(options, "success", {
						url: resUrl
					})
				},
				fail: (err) => {
					errHandle(options, err);
				}
			});
			if (options.onProgress !== undefined && typeof options.onProgress === "function") {
				uploadTask.onProgressUpdate((res) => {
					options.onProgress(res);
				});
			}
		}, 0);
	}
}


/**
 * 上传视频
 *
 * @param {Object} options
 * @param {String} options.filename @description 文件名称
 * @param {String} options.filepath @description 本地文件临时路径
 * @param {Function} options.onProgress @description 上传进度回调
 */
function uploadVideo(options) {
	if (!instance.mediaUploadParams) {
		return log(1, "媒体上传参数获取失败！");
	}
	let mediaUploadParams = instance.mediaUploadParams;
	let suffix = options.filename.substring(options.filename.lastIndexOf("."));
	let filename = md5((new Date()).getTime() + "_" + options.filename) + "_video" + suffix;
	//<BucketName-APPID>.cos.<Region>.myqcloud.com
	let uploadUrl = "https://" + mediaUploadParams.bucket + ".cos." + mediaUploadParams.region + ".myqcloud.com";
	let resUrl = (mediaUploadParams.customDomain ? mediaUploadParams.customDomain : uploadUrl) + "/" + filename;

	//腾讯云COS对象存储
	if (mediaUploadParams.storage == "cos") {
		setTimeout(async () => {
			let postAuthorization = await buildCosAuthorization('post', '/', '');
			let uploadTask = uni.uploadFile({
				url: uploadUrl,
				name: 'file',
				formData: {
					'key': filename,
					'success_action_status': 200,
					'Signature': postAuthorization,
					'Content-Type': ''
				},
				header: {
					Authorization: postAuthorization,
				},
				filePath: options.filepath,
				success: async () => {
					let getAuthorization = await buildCosAuthorization('get', "/" +
						filename, '');
					//下载视频缩略图，腾讯云COS 媒体截图接口：https://cloud.tencent.com/document/product/436/55671
					uni.downloadFile({
						url: uploadUrl + "/" + filename + "?ci-process=snapshot&time=1",
						header: {
							'Authorization': getAuthorization
						},
						success: (downloadRes) => {
							if (downloadRes.statusCode === 200) {
								uploadImage({
									filename: md5(filename + downloadRes
											.tempFilePath) +
										"_videoThumb.jpg",
									filepath: downloadRes.tempFilePath,
									success: (thumb) => {
										successHandle(options,
											"success", {
												videoUrl: resUrl,
												thumbnailUrl: thumb
													.data.url
											});
									},
									fail: (err) => {
										errHandle(options, err);
									}
								})
							} else {
								errHandle(options, "腾讯云媒体截图接口：下载视频缩略图失败");
							}
						},
						fail: (err) => {
							errHandle(options, "腾讯云媒体截图接口：下载视频缩略图失败");
						}
					});

				},
				fail: (err) => {
					errHandle(options, err);
				}
			});
			if (options.onProgress !== undefined && typeof options.onProgress === "function") {
				uploadTask.onProgressUpdate((res) => {
					options.onProgress(res);
				});
			}
		}, 0);
	}
}

export {
	getMediaUploadParams,
	upload,
	uploadImage,
	uploadAudio,
	uploadVideo
}
