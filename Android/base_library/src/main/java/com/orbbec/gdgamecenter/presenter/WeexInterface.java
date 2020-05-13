package com.orbbec.gdgamecenter.presenter;

import com.orbbec.gdgamecenter.listener.AppInfoLister;

/**
 * @author tanzhuohui
 * @date 2018/10/29
 */
public interface WeexInterface {
    /**
     * android to week 下载进度
     * @param progess 下载进度
     */
    void loading(String packageName , int progess);

    /**
     * 点击keyDown
     * @param keyCode  键值
     */
    void keyDown(int keyCode);

    /**
     * 应用安装
     * @param packageName 安装的应用包名
     * @param result 安装结果
     */
    void intstalled(String packageName , int result);

    /**
     * 开始下载
     * @param packageName 要下载的包名
     * @param url 要下载的地址
     */
    void startDownload(String packageName , String url);

    /**
     * 卸载应用
     * @param packageName 要卸载的应用
     */
    void uninstall(String packageName);

    /**
     * 点击打开应用
     * @param packageName 要打开的应用的包名
     */
    void startApp(String packageName);

    /**
     * 退出应用
     */
    void finish();

    /**
     * 获取应用是否安装
     * @param packageName 要查询的应用包名
     * @return true 安装  |  false 没安装
     */
    boolean getgetAppInstalled(String packageName);

    /**
     * 获取本地奥比游戏
     */
    void getLocalOrbbecApp(AppInfoLister appInfoLister);

    /**
     * 获取应用是否安装 如果是 返回版本号 否则返回0
     * @param packageName 要查询的应用包名
     * @return int 版本号
     */
    int getInstalledAppVersion(String packageName);

    /**
     * 返回卸载成功的回调
     */
    void onUninstallSuccess(boolean action);

    /**
     * 根据本地包名提供信息
     */
    void getLocalAppInfo(String packageName, AppInfoLister appInfoLister);

    /**
     * 返回联网状态
     */
    boolean getConnection();

    /**
     * 返回现在列表
     */
    void getDownloadList();

    /**
     * 获取是否使用摄像头
     */
    boolean useCamera();

    /**
     * 静默安装
     */
    void silentDownload(String packageName, String url);

    /**
     * 静默卸载
     */
    void silentUninstall(String packageName);
}
