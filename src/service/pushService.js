import {
	instance
} from '../yeim-uni-sdk';

import log from '../func/log';
import {
	Api,
	request
} from '../func/request';

/**
 * 检测设备通知权限及跳转系统设置通知页面
 */
function setPushPermissions() {
	if (instance.systemInfo.uniPlatform == 'app' && instance.systemInfo.osName ==
		'android') { // 判断是Android
		var main = plus.android.runtimeMainActivity();
		var pkName = main.getPackageName();
		var uid = main.getApplicationInfo().plusGetAttribute('uid');
		var NotificationManagerCompat = plus.android.importClass('android.support.v4.app.NotificationManagerCompat');
		//android.support.v4升级为androidx
		if (NotificationManagerCompat == null) {
			NotificationManagerCompat = plus.android.importClass('androidx.core.app.NotificationManagerCompat');
		}
		var areNotificationsEnabled = NotificationManagerCompat.from(main).areNotificationsEnabled();

		// 未开通‘允许通知’权限，则弹窗提醒开通，并点击确认后，跳转到系统设置页面进行设置  
		var firstFlag = uni.getStorageSync('first_flag') || false;
		if (!areNotificationsEnabled && !firstFlag) {
			uni.setStorageSync('first_flag', true);
			uni.showModal({
				title: '通知权限开启提醒',
				content: '您还没有开启通知权限，无法接受到消息通知，请前往设置！',
				showCancel: false,
				confirmText: '去设置',
				success: function(res) {
					if (res.confirm) {
						var Intent = plus.android.importClass('android.content.Intent');
						var Build = plus.android.importClass("android.os.Build");
						//android 8.0引导  
						if (Build.VERSION.SDK_INT >= 26) {
							var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
							intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
						} else if (Build.VERSION.SDK_INT >= 21) { //android 5.0-7.0  
							var intent = new Intent('android.settings.APP_NOTIFICATION_SETTINGS');
							intent.putExtra('app_package', pkName);
							intent.putExtra('app_uid', uid);
						} else { //(<21)其他--跳转到该应用管理的详情页  
							intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
							var uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
							intent.setData(uri);
						}
						// 跳转到该应用的系统通知设置页  
						main.startActivity(intent);
					}
				}
			});
		}
	} else if (instance.systemInfo.uniPlatform == 'app' && instance.systemInfo.osName ==
		'ios') { // 判断是IOS
		var isOn = undefined;
		var types = 0;
		var app = plus.ios.invoke('UIApplication', 'sharedApplication');
		var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
		if (settings) {
			types = settings.plusGetAttribute('types');
			plus.ios.deleteObject(settings);
		} else {
			types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
		}
		plus.ios.deleteObject(app);
		isOn = (0 != types);
		if (isOn == false) {
			uni.showModal({
				title: '通知权限开启提醒',
				content: '您还没有开启通知权限，无法接受到消息通知，请前往设置！',
				showCancel: false,
				confirmText: '去设置',
				success: function(res) {
					if (res.confirm) {
						var app = plus.ios.invoke('UIApplication', 'sharedApplication');
						var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
						plus.ios.invoke(app, 'openURL:', setting);
						plus.ios.deleteObject(setting);
						plus.ios.deleteObject(app);
					}
				}
			});
		}
	}
}

/**
 * 
 * Android8.0
 * 创建推送渠道
 * 
 */
function createNotificationChannel() {
	if (instance.systemInfo.uniPlatform == 'app' && instance.systemInfo.osName ==
		'android' && instance.defaults.notification && instance.defaults.notification.oppoChannelId) {
		var Build = plus.android.importClass('android.os.Build');
		if (Build.VERSION.SDK_INT >= 26) {
			let oppoChannelId = instance.defaults.notification.oppoChannelId;
			let channelName = '聊天离线通知';
			let main = plus.android.runtimeMainActivity();
			let Context = plus.android.importClass('android.content.Context');
			let NotificationManager = plus.android.importClass('android.app.NotificationManager');
			let nManager = main.getSystemService(Context.NOTIFICATION_SERVICE);
			let channel = nManager.getNotificationChannel(oppoChannelId);
			let NotificationChannel = plus.android.importClass('android.app.NotificationChannel');
			let Notification = plus.android.importClass('android.app.Notification');
			if (channel) {
				nManager.deleteNotificationChannel(channel);
			}
			//OPPO创建本地通道
			if (!channel || channel == null || channel == 'null' || channel == undefined) {
				let channel = new NotificationChannel(oppoChannelId, channelName, NotificationManager
					.IMPORTANCE_HIGH);
				channel.setDescription('用于用户离线时推送消息通知');
				channel.enableVibration(true);
				channel.enableLights(true);
				channel.setBypassDnd(true);
				channel.setLockscreenVisibility(Notification.VISIBILITY_SECRET);
				nManager.createNotificationChannel(channel);
			}
		}
	}
}

/**
 *  
 * 注册APP用户推送标识符
 * 将个推cid绑定到后端，用于离线推送消息通知
 * 
 */
function bindAppUserPushCID() {
	if (!instance.checkLogged() || instance.systemInfo.uniPlatform != 'app') {
		return;
	}
	plus.push.getClientInfoAsync((info) => {
		let clientId = info['clientid'];
		if (clientId) {
			request(Api.Push.bindClientId, 'GET', {
				clientId: clientId
			}).then(() => {
				log(0, "注册APP用户离线通知推送标识符成功，当前获取的cid为：" + clientId);
			}).catch((fail) => {
				log(1, "注册APP用户离线通知推送标识符异常：" + fail.message);
			})
		}
	});
}


export {
	setPushPermissions,
	createNotificationChannel,
	bindAppUserPushCID
}
