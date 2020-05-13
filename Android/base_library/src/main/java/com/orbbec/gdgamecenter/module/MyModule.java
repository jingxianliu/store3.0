package com.orbbec.gdgamecenter.module;

import android.util.Log;

import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.listener.AppInfoLister;
import com.orbbec.gdgamecenter.presenter.WeexInterface;
import com.orbbec.gdgamecenter.presenter.WeexPresenter;
import com.orbbec.gdgamecenter.utils.LocalInfoUtil;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.common.WXModule;


/**
 * @author tanzhuohui
 * @date 2018/10/29
 */
public class MyModule extends WXModule {

    public static WeexPresenter sPresenter;

    public static void setPresenter(WeexPresenter presenter) {
        sPresenter = presenter;
    }

    /**
     *     run ui thread
     *     下载应用
     */
    @JSMethod(uiThread = false)
    public void downLoad(String packageName , String url) {
      sPresenter.startDownload(packageName , url);
    }


    /**
     * 卸载应用
     * @param packageName 要卸载的包名
     */
    @JSMethod(uiThread = false)
    public void uninstall(String packageName) {
        sPresenter.uninstall(packageName);
    }

    /**
     * 开启应用
     * @param packageName 要启动的应用的包名
     */
    @JSMethod(uiThread = true)
    public void startApp(String packageName){
        WXApplication.isStartOrbbecGame = true;
        sPresenter.startApp(packageName);
    }

    /**
     * 退出应用
     */
    @JSMethod(uiThread = true)
    public void finish(){
        sPresenter.finish();
    }

    /**
     * 获取应用是否安装
     * @param packageName 要查询的应用包名
     * @return true 安装  |  false 没安装
     */
    public boolean getAppInstalled(String packageName){
        return sPresenter.getgetAppInstalled(packageName);
    }

    /**
     * 获取应用是否安装 如果是 返回版本号 否则返回0
     * @param packageName 要查询的应用包名
     * @return int 版本号
     */
    @JSMethod(uiThread = false)
    public int getInstalledAppVersion(String packageName){
        LogUtils.d("insversion", "getInstalledAppVersion: " + sPresenter.getInstalledAppVersion(packageName));
        return sPresenter.getInstalledAppVersion(packageName);
    }

    /**
     * 获取本地安装了的奥比游戏
     * @return String Json形式的本地奥比应用信息
     */
    @JSMethod(uiThread = false)
    public String getLocalOrbbecApp(){
        long start = System.currentTimeMillis();
        final String[] finalResult = {""};
        final Thread thread = Thread.currentThread();
        sPresenter.getLocalOrbbecApp(new AppInfoLister(){
            @Override
            public void getAppInfo(String result) {
                finalResult[0] = result;
                synchronized (thread) {
                    thread.notify();
                }
            }
        });
        try {
            synchronized (thread) {
                thread.wait();
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
//        LogUtils.e("tzh", "getLocalOrbbecApp: "+finalResult[0] );
        LogUtils.d("queryTime",""+(System.currentTimeMillis()-start));
        return finalResult[0];
    }

    @JSMethod(uiThread = true)
    public void setKeyDownFeasibility(boolean isFeasibility){
        // TODO: 2018/11/22 方法
        WXApplication.getContext().isFeasibility = isFeasibility;
    }

    /**
     * 获取网络状态
     * @return bool 联网状态
     */
    @JSMethod(uiThread = false)
    public boolean getInternetStatus(){
        return sPresenter.getConnection();
    }


    /**
     * 获取用户信息
     * @return String 用户信息
     */
    @JSMethod(uiThread = false)
    public String getUserInfo(){
        return LocalInfoUtil.getLocalDeviceInfo();
    }

    /**
     * 获取用户信息
     * @return int 是否使用奥比摄像头
     */
    @JSMethod(uiThread = false)
    public int useCamera(){
        boolean b = sPresenter.useCamera();
        Log.d("GameCenterPlugin", "useCamera: " + b);
        if(b){
            return 0;
        }
        return 1;
    }
}
