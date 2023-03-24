/*eslint-disable*/

import { instance } from "../yeim-uni-sdk"


/**
 * 从本地缓存中同步获取指定 key 对应的内容
 * 
 * @param {String} key - 缓存名称
 * @returns {Object}
 */
function getCache(key) {
    if (instance.uni) {
        return uni.getStorageSync(key);
    } else {
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    }
}

/**
 * 将 value 存储在本地缓存中指定的 key 中
 * 
 * @param {String} key - 缓存名称
 * @param {Object} value - 缓存值
 * @returns {void}
 */
function setCache(key, value) {
    if (instance.uni) {
        uni.setStorageSync(key, value);
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
}

/**
 * 从本地缓存中同步移除指定 key
 * 
 * @param {String} key - 缓存名称 
 * @returns {void}
 */
function removeCache(key) {
    if (instance.uni) {
        uni.removeStorageSync(key);
    } else {
        localStorage.removeItem(key);
    }
}

export {
    getCache,
    setCache,
    removeCache
}