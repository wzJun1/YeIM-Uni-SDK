import {
	instance
} from "../yeim-uni-sdk";
/**
 * 日志输出
 *  logLevel
 *  0 普通日志，日志量较多，接入时建议使用
 *	1 关键性日志，日志量较少，生产环境时建议使用 
 *	2 无日志级别，SDK 将不打印任何日志
 * @param {Object} level
 * @param {Object} msg
 */
function log(level, msg) {
	if (instance.defaults.logLevel == 0) {
		console.log("【YeIMUniSDK Log】", msg)
	} else if (instance.defaults.logLevel == 2) {
		return;
	} else {
		if (level == 1) {
			console.log("【YeIMUniSDK Log】", msg)
		}
	}
}

export default log
