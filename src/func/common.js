
/**
 * 
 * 判断链接是否为h5 object url
 * 
 * @param {*} url 
 * @returns 
 */
function isBlobURL(url) {
    return url.startsWith('blob:');
}

/**
 * 
 * 判断是否为网络链接
 * 
 * @param {*} url 
 * @returns 
 */
function isHttpURL(url) {
    return url.startsWith('http:') || url.startsWith('https:') || url.startsWith('ftp:');
}

export {
    isBlobURL,
    isHttpURL
}
