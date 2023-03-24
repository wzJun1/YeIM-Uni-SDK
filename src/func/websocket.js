/*eslint-disable*/

import { instance } from "../yeim-uni-sdk";
import log from "./log";

export default class WebSocketUtil {

	socketTask = undefined;

	onMessageCallBack = [];

	constructor(url) {
		if (instance.uni) {
			this.socketTask = uni.connectSocket({
				url: url,
				success: () => { },
				fail: () => { },
				complete: () => { }
			});
		} else {
			this.socketTask = new WebSocket(url);
			this.socketTask.onmessage = (res) => {
				if (this.onMessageCallBack) {
					for (let index = 0; index < this.onMessageCallBack.length; index++) {
						this.onMessageCallBack[index](res);
					}
				}
			};
		}
	}
	onOpen(callback) {
		try {
			if (instance.uni) {
				this.socketTask.onOpen(callback);
			} else {
				this.socketTask.onopen = callback;
			}
		} catch (e) {
			log(0, e, true);
		}
	}
	onClose(callback) {
		try {
			if (instance.uni) {
				this.socketTask.onClose(callback);
			} else {
				this.socketTask.onclose = callback;
			}
		} catch (e) {
			log(0, e, true);
		}
	}
	onError(callback) {
		try {
			if (instance.uni) {
				this.socketTask.onError(callback);
			} else {
				this.socketTask.onerror = callback;
			}
		} catch (e) {
			log(0, e, true);
		}
	}
	onMessage(callback) {
		try {
			if (instance.uni) {
				this.socketTask.onMessage(callback);
			} else {
				this.onMessageCallBack.push(callback);
			}
		} catch (e) {
			log(0, e, true);
		}
	}
	send(str) {
		if (this.socketTask) {
			try {
				if (instance.uni) {
					this.socketTask.send({
						data: JSON.stringify(str)
					});
				} else {
					this.socketTask.send(JSON.stringify(str));
				}
			} catch (e) {
				log(0, e, true);
			}
		}
	}
	close() {
		try {
			this.socketTask.close();
		} catch (e) {
			log(0, e, true);
		}
	}
	destroy() {
		this.socketTask = undefined;
	}
}
