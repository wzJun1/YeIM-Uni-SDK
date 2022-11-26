# YeIM-Uni-SDK 即时通讯JSSDK

`此为社区开源项目，用于学习交流使用，禁止用于非法途径。如作他用所造成的一切法律责任均不由作者承担。`

私有化部署的精简即时通讯SDK，需要搭配后端使用，地址：[YeIM-Uni-Server](https://github.com/wzJun1/YeIM-Uni-Server)

目前仅支持私聊，后续功能待更新

### 反馈与共建

- 普通交流QQ群：[391276294](https://qm.qq.com/cgi-bin/qm/qr?k=hEQnVRj3c1B0gDpD2QJrD7UIfWMzCUuM&jump_from=webapi&authKey=kbrD7NHXGIPaiVb2puw+vJeRCIQSXVhIci7eFvFLBH/UjGt+hrdOk4upK731S+1+)

## 使用方式

### 1. 启动后端

下载后端源码：[YeIM-Uni-Server](https://github.com/wzJun1/YeIM-Uni-Server) [https://github.com/wzJun1/YeIM-Uni-Server](https://github.com/wzJun1/YeIM-Uni-Server)

创建数据库，导入源码中的：database.sql，修改application.properties中配置MySQL、Redis、Storage相关参数

导入项目到IntelliJ IDEA进行开发测试

注：1.0.2版本升级后加入媒体消息，接入COS（腾讯云对象存储及腾讯云万象媒体处理服务），以后会对接本地和更多公有云对象存储（不限于阿里云七牛云等）。COS配置Storage，修改application.properties，请根据自行创建的bucket配置。

### 1.1 注册用户

成功启动后端之后，无报错，可进行postman接口调试。

注册用户接口：http://你的本地地址:10010/user/register  接口方法：UserController -> register

使用post json调用，传递参数：userId，nickname，avatarUrl

userId：你自己系统的用户ID
nickname：用户昵称
avatarUrl：用户头像地址
 
<img src="https://qn.repository.zhi7v.com/images/iShot_2022-11-20_22.29.48.png" width="400" />

### 1.2 换取登陆token

获取登陆token接口：http://你的本地地址:10010/user/token/get  接口方法：UserController -> getToken

使用post json调用，传递参数：userId，timestamp，sign

userId：用户ID
timestamp：过期时间
sign：md5(userId+timestamp+secretKey)

注：secretKey在[YeIM-Uni-Server](https://github.com/wzJun1/YeIM-Uni-Server) -> application.properties 中可自行配置

<img src="https://qn.repository.zhi7v.com/images/iShot_2022-11-20_22.36.19.png" width="400" />

### 2. 安装YeIM-Uni-SDK

```shell
npm i yeim-uni-sdk
```

或者

[插件市场](https://ext.dcloud.net.cn/plugin?id=10148)导入到HbuilderX

### 2.1 前端 main.js 初始化

```javascript
//导入sdk
import {
	YeIMUniSDK,
	YeIMUniSDKDefines
} from './uni_modules/wzJun1-YeIM-Uni-SDK/js_sdk/yeim-uni-sdk.min.js'

//初始化YeIMUniSDK
uni.$YeIMUniSDKDefines = YeIMUniSDKDefines; // 预定义常量
uni.$YeIM = YeIMUniSDK.init({
	baseURL: 'http://192.168.110.101:10010', // YeIMServer http url
	socketURL: 'ws://192.168.110.101:10010/im', // YeIMServer socket url
	/**
	 * 	日志等级
	 *  0 普通日志，日志量较多，接入时建议使用
	 *	1 关键性日志，日志量较少，生产环境时建议使用 
	 *	2 无日志级别，SDK 将不打印任何日志
	 */
	logLevel: 0, // 日志等级，
	reConnectInterval: 3000, // 重连时间间隔
	reConnectTotal: 0, // 最大重连次数，0不限制一直重连 
	heartInterval: 30000, //心跳时间间隔(默认30s)
});
```

### 2.2 设置监听

```javascript
	//设置监听，建议具名函数
	uni.$YeIM.addEventListener(uni.$YeIMUniSDKDefines.EVENT.CONVERSATION_LIST_CHANGED, (list) => {
		console.log("监听会话列表更新:")
		console.log(list) 
	})
	
	uni.$YeIM.addEventListener(uni.$YeIMUniSDKDefines.EVENT.MESSAGE_RECEIVED, (list) => {
		console.log("收到消息:")
		console.log(list) 
	})
	
	uni.$YeIM.addEventListener(uni.$YeIMUniSDKDefines.EVENT.NET_CHANGED, (res) => {
		console.log("网络状态变化:" + res)
	})
	
	uni.$YeIM.addEventListener(uni.$YeIMUniSDKDefines.EVENT.KICKED_OUT, () => {
		console.log("用户被踢下线")
	})
	
	//移除监听
	uni.$YeIM.addEventListener(uni.$YeIMUniSDKDefines.EVENT.NET_CHANGED, this.netChanged)
	uni.$YeIM.removeEventListener(uni.$YeIMUniSDKDefines.EVENT.NET_CHANGED, this.netChanged)
```

### 2.3 通过token登陆

```javascript
	uni.$YeIM.connect({
		userId: "用户ID",
		token: "上述说明中通过http接口换取到的token",
		success: (response) => {
			if (response.code === 200) {
				uni.showToast({
					title: "登录成功"
				})
				//TODO 存到状态
			} else {
				uni.showToast({
					icon: "error",
					title: "登录失败：" + response.code
				})
			}
		},
		fail: (err) => {
			console.log(err);
		}
	});
	
	//修改用户资料 
	uni.$YeIM.updateUserInfo({
		nickname: "",
		avatarUrl: "",
		success: (response) => {
			console.log(response);
		},
		fail: (err) => {
			console.log(err);
		}
	});
```

 

### 2.4 发送消息

```javascript
	//创建文字消息
	let message = uni.$YeIM.createTextMessage({
		toId: '接收者用户ID',
		conversationType: uni.$YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE,
		body: {
			text: "你好"
		}
	}); 
	
	//创建图片消息（注：图片、语音、视频等媒体消息，需后端接入COS（腾讯云对象存储及腾讯云万象媒体处理服务））
	let message = uni.$YeIM.createImageMessage({
		toId: '接收者用户ID',
		conversationType: uni.$YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE,
		body: {
			file: {
				tempFilePath: '本地图片临时路径',
				width: '图片宽度',
				height: '图片高度',
			}
		},
		onProgress: (progress) => {
			console.log('上传进度' + progress.progress);
			console.log('已经上传的数据长度' + progress.totalBytesSent);
			console.log('预期需要上传的数据总长度' + progress.totalBytesExpectedToSend);
		}
	});
	
	//创建语音消息（注：图片、语音、视频等媒体消息，需后端接入COS（腾讯云对象存储及腾讯云万象媒体处理服务））
	let message = uni.$YeIM.createAudioMessage({
		toId: '接收者用户ID',
		conversationType: uni.$YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE,
		body: {
			file: {
				tempFilePath: '', // 本地录音文件
				duration: 0, // 录音时长
			}
		},
		onProgress: (progress) => {
			console.log('上传进度' + progress.progress);
			console.log('已经上传的数据长度' + progress.totalBytesSent);
			console.log('预期需要上传的数据总长度' + progress.totalBytesExpectedToSend);
		}
	});
	
	//创建小视频消息（注：图片、语音、视频等媒体消息，需后端接入COS（腾讯云对象存储及腾讯云万象媒体处理服务））
	let message = uni.$YeIM.createVideoMessage({
		toId: '接收者用户ID',
		conversationType: uni.$YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE,
		body: {
			file: {
				tempFilePath: '本地小视频文件临时路径',
				width: '视频宽度',
				height: '视频高度',
				duration: 1 // 视频时长，秒
			}
		},
		onProgress: (progress) => {
			console.log(progress)
			console.log('上传进度' + progress.progress);
			console.log('已经上传的数据长度' + progress.totalBytesSent);
			console.log('预期需要上传的数据总长度' + progress.totalBytesExpectedToSend);
		}
	});
	
	//创建自定义消息
	// let message = uni.$YeIM.createCustomMessage({
	// 	toId: '接收者用户ID',
	// 	conversationType: uni.$YeIMUniSDKDefines.CONVERSATION_TYPE.PRIVATE,
	// 	body: "自定义消息对象"
	// }); 
	
	
	//发送消息
	uni.$YeIM.sendMessage({
		message: message,
		success: (res) => {
			console.log(res)
		},
		fail: (err) => {
			console.log(err)
		}
	});
```

### 2.5 获取会话列表

```javascript
	uni.$YeIM.getConversationList({
		page: 1, //页码
		limit: 20, //每页数量
		success: (res) => {
			console.log(res)  
		},
		fail: (err) => {
			console.log(err)
		}
	});
```

### 2.6 获取历史消息记录

```javascript
	uni.$YeIM.getMessageList({
		page: 1,
		conversationId: "会话ID",
		success: (res) => {
			console.log(res)  
		},
		fail: (err) => {
			console.log(err)
		}
	});
```

 