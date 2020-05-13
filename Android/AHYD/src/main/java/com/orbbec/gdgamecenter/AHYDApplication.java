package com.orbbec.gdgamecenter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;


import com.istv.ystframework.client.InstallClient;
import com.orbbec.countly.CountlyParams;
import com.orbbec.countly.CountlyUtils;
import com.orbbec.gdgamecenter.baminsdk.Constants;
import com.orbbec.gdgamecenter.component.NativeVideo;
import com.orbbec.gdgamecenter.component.gsyvideoviews.GsySimpleVideo;
import com.orbbec.gdgamecenter.module.MyModule;
import com.orbbec.gdgamecenter.network.download.DownloadManager;
import com.orbbec.gdgamecenter.utils.InstallAppHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.Utils;
//import com.taobao.gcanvas.bridges.weex.GCanvasWeexModule;
//import com.taobao.gcanvas.bridges.weex.WXGCanvasWeexComponent;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.WXSDKManager;
import com.taobao.weex.common.WXException;

import java.util.HashMap;

import ly.count.android.sdk.Countly;
/**
 * @author Altair
 * @date 2019/1/9
 */
public class AHYDApplication extends WXApplication{

    private boolean isStart = false;
    private int result_num = 0;
    private Context context;

    @Override
    public void onCreate(){
        super.onCreate();
        context = getApplicationContext();
        InstallClient.getInstance(context).init();
//        CountlyUtils.getInstance().initCountly(context, CountlyParams.CHANNEL_JSYD[0], Utils.getDevInstall(context), Utils.getMAC());
//        CountlyUtils.getInstance().sendBegin();

        initBamin();
        if(com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance == null){
            Intent startintent = new Intent(this,com.orbbec.gdgamecenter.baminsdk.HomeKeyService.class);
            this.startService(startintent);
        }
    }

    @Override
    protected void initWeex() {
        try {
            WXSDKEngine.registerModule("myModule", AHModule.class);
            WXSDKEngine.registerComponent("simpleVideo", GsySimpleVideo.class);
            WXSDKEngine.registerComponent("nativeVideo", NativeVideo.class);
//            WXSDKEngine.registerModule("gcanvas", GCanvasWeexModule.class);
//            WXSDKEngine.registerComponent("gcanvas", WXGCanvasWeexComponent.class);
            registerActivityLifecycleCallbacks(new ActivityLifecycleCallbacks() {
                @Override
                public void onActivityCreated(Activity activity, Bundle bundle) {

                }

                @Override
                public void onActivityStarted(Activity activity) {

                }

                @Override
                public void onActivityResumed(Activity activity) {

                }

                @Override
                public void onActivityPaused(Activity activity) {

                }

                @Override
                public void onActivityStopped(Activity activity) {

                }

                @Override
                public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {

                }

                @Override
                public void onActivityDestroyed(Activity activity) {
                    // The demo code of calling 'notifyTrimMemory()'
                    if (false) {
                        // We assume that the application is on an idle time.
                        WXSDKManager.getInstance().notifyTrimMemory();
                    }
                    // The demo code of calling 'notifySerializeCodeCache()'
                    if (false) {
                        WXSDKManager.getInstance().notifySerializeCodeCache();
                    }
                }
            });
            //    mInstance = new WXSDKInstance(getApplicationContext());
        } catch (WXException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void initBamin() {
        super.initBamin();
        if(Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            initSdkUtil();
        }
    }

    @Override
    public void startBamin() {
        super.startBamin();
        LogUtils.d("FujianBaminSDK", "startBamin: + begin " + isStart);
        if(!isStart) {
            if(com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance == null){
                Intent startintent = new Intent(this,com.orbbec.gdgamecenter.baminsdk.HomeKeyService.class);
                this.startService(startintent);
            }
            isStart = true;
        }
    }

    private void LoginOut(){
        LogUtils.d(Constants.TAG, "Instance = " +  com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance);
        com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance.GamePlayEnd();
    }

    @Override
    public void endBamin() {
        super.endBamin();
        LogUtils.d("FujianBaminSDK", "endBamin: 1111 " + isStart);
        if(isStart && com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance != null) {
            isStart = false;
            LoginOut();
        }
    }

    private void initSdkUtil(){
        String appVersion = getAppVersion(this);
        LogUtils.d(Constants.TAG, "initSdkUtil: " + appVersion);
    }


    private String getAppVersion(final Context context) {
        String result = Countly.DEFAULT_APP_VERSION;
        try {
            result = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            if (Countly.sharedInstance().isLoggingEnabled()) {
                LogUtils.i(Countly.TAG, "No app version found");
            }
        }
        return result;
    }

    @Override
    protected void initHelper() {
            InstallAppHelper.initInstallAppHelper(this);
            AHDownloadManager.initDownloadManager();
    }
}
