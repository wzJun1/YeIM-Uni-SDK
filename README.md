<p align="center">
    <strong><font size="6">YeIM-Uni-SDK</font></strong>
    <br>
    <br>
    <strong><font size="5">即时通讯JSSDK</font></strong> 
    <br>
    <br>
    <a target="_blank" href="https://wzjun1.netlify.app/ye_plugins/sdk/yeimunisdk">查看文档</a>
    | <a target="_blank" href="https://wzjun1.github.io/ye_plugins/sdk/yeimunisdk">备用文档</a> 
    <br>
    <img src="https://wzjun1.netlify.app/ye_plugins/code2.png" width="500"/>
</p>

`此为社区开源项目，用于学习交流使用，禁止用于非法途径。如作他用所造成的一切法律责任均不由作者承担。` 

- 注：不是聊天项目！不是聊天项目！不是聊天项目！只是SDK，通过使用SDK里的一系列接口可实现聊天，跟环信、融云、腾讯云即时通信等等类似的一种可实现聊天的IMSDK。

`YeIM-Uni-SDK`是可以`私有化部署`的`全开源`即时通讯`js-sdk`，仅需集成 SDK 即可轻松实现聊天能力，支持Web、[uni-app](https://uniapp.dcloud.net.cn/)接入使用，满足通信需要。

支持私聊和群聊，支持发送的消息类型：文字消息、图片消息、语音消息、视频消息、位置消息、自定义消息。

必须搭配[YeIM-Uni-Server](https://github.com/wzJun1/YeIM-Uni-Server)服务端，开箱即用。

## 支持哪些端？

`YeIM-Uni-SDK`由`JavaScript`构建，支持Web端、uni-app端的项目接入使用。

当项目在uni环境打包，SDK将使用`uni-app API`，否则使用JS相关API，详情可查看源码。

作为通用JSSDK，`YeIM-Uni-SDK`支持包括不限于H5（uni和非uni环境均可）、Android APP、iOS APP、微信小程序、字节小程序、支付宝小程序、百度小程序（仅限uni环境）等平台项目。

## 使用文档

<a target="_blank" href="https://wzjun1.netlify.app/ye_plugins/sdk/yeimunisdk">查看文档</a>
    | <a target="_blank" href="https://wzjun1.github.io/ye_plugins/sdk/yeimunisdk">备用文档</a> 

## 反馈与共建

- 普通交流QQ群：[391276294](https://qm.qq.com/cgi-bin/qm/qr?k=hEQnVRj3c1B0gDpD2QJrD7UIfWMzCUuM&jump_from=webapi&authKey=kbrD7NHXGIPaiVb2puw+vJeRCIQSXVhIci7eFvFLBH/UjGt+hrdOk4upK731S+1+)

## 源码编译

```shell
npm i
```

```shell
npm run build
```

## 基于YeIM-Uni-SDK的演示案例

### 代码

[下载基于YeIM-Uni-SDK的演示案例源码](https://ext.dcloud.net.cn/plugin?id=10266)

### Android App Demo

<img src="https://www.pgyer.com/app/qrcode/WYbc" width="250" height="250" />

### Electron 桌面端 Demo

[https://github.com/wzJun1/YeIM-Uni-SDK-Electron-Demo](https://github.com/wzJun1/YeIM-Uni-SDK-Electron-Demo)