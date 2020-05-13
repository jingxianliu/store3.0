package com.orbbec.gdgamecenter;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

import com.bumptech.glide.Glide;
import com.orbbec.gdgamecenter.adapter.GlideAdapter;
import com.orbbec.gdgamecenter.component.NativeVideo;
import com.orbbec.gdgamecenter.component.SimpleVideo;
import com.orbbec.gdgamecenter.component.gsyvideoviews.GsySimpleVideo;
import com.orbbec.gdgamecenter.data.source.bean.GDGameCenterInfo;
import com.orbbec.gdgamecenter.interfaces.BaminInterface;
import com.orbbec.gdgamecenter.network.download.DownloadManager;
import com.orbbec.gdgamecenter.module.MyModule;
import com.orbbec.gdgamecenter.utils.CountlyHelper;
import com.orbbec.gdgamecenter.utils.InstallAppHelper;
import com.orbbec.gdgamecenter.utils.Utils;
//import com.taobao.gcanvas.bridges.weex.GCanvasWeexModule;
//import com.taobao.gcanvas.bridges.weex.WXGCanvasWeexComponent;
import com.taobao.weex.InitConfig;
import com.taobao.weex.WXEnvironment;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.WXSDKManager;
import com.taobao.weex.common.WXException;

import org.xutils.x;

//import io.vov.vitamio.Vitamio;
import ly.count.android.sdk.Countly;

/**
 * @author tanzhuohui
 * @date 2018/10/22
 */
public class WXApplication extends Application implements BaminInterface {
    public static final boolean LOG_DEBUG = false;
    private static WXApplication mInstall;
    public static  int INSTALL_SPACE_SIZE = 200;
    public boolean isFeasibility = true;
    private static GDGameCenterInfo sGDGameCenterInfo;
   // private static WXSDKInstance mInstance;
    public static boolean COUNTLY_SWITCH = false;
    public static boolean COUNTLY_INITED = false;
    private static Context mContext;
    public static boolean isInstallActivity = false;
    public static boolean isExit = false;
    public static boolean isUninstall = false;
    public static boolean isStartOrbbecGame = false;


    @Override
    public void onCreate() {
        super.onCreate();
        mInstall = this;
        mContext = getApplicationContext();
        initXUtils();
        initHelper();
        WXEnvironment.addCustomOptions("com.orbbec.gdgamecenter" , "testDemo");
        INSTALL_SPACE_SIZE = Utils.getMedaDataInt("INSTALL_SPACE_SIZE",this);
        WXSDKEngine.initialize(this , new InitConfig.Builder().setImgAdapter(new GlideAdapter(Glide.with(this))).build());
//        Vitamio.isInitialized(mContext);
//        Log.e("dxm", "createVideoView: "+Vitamio.isInitialized(mContext) );
        initWeex();
    }

    protected void initWeex(){
        Log.d("WXApplication", "initWeex: base");
        try {
            WXSDKEngine.registerModule("myModule", MyModule.class);
            WXSDKEngine.registerComponent("simpleVideo", GsySimpleVideo.class);
            WXSDKEngine.registerComponent("nativeVideo", NativeVideo.class);
//            WXSDKEngine.registerModule("gcanvas",GCanvasWeexModule.class);
//            WXSDKEngine.registerComponent("gcanvas",WXGCanvasWeexComponent.class);
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

    private void initXUtils() {
        x.Ext.init(this);
        if (LOG_DEBUG) {
            // 调试开启
            x.Ext.setDebug(true);
        }
    }

    public static WXApplication getContext(){
        return mInstall;
    }
    protected void initHelper() {
        InstallAppHelper.initInstallAppHelper(this);
        DownloadManager.initDownloadManager();
    }

//    @NonNull
//    public static WXSDKInstance getWXSDKInstance(){
//        return mInstance;
//    }
    public void setInfo(GDGameCenterInfo info) {
        sGDGameCenterInfo = info;
    }

    public GDGameCenterInfo getInfo() {
        return sGDGameCenterInfo;
    }

    @Override
    public void initBamin() {

    }

    @Override
    public void startBamin() {

    }

    @Override
    public void endBamin() {

    }

    public static Context getApplication(){
        return mContext;
    }

}
