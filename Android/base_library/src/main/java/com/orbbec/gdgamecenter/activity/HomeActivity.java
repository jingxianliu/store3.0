package com.orbbec.gdgamecenter.activity;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.adapter.DownloadProgressAdapter;
import com.orbbec.gdgamecenter.component.gsyvideoviews.GsySimpleVideo;
import com.orbbec.gdgamecenter.data.source.bean.GDGameCenterInfo;
import com.orbbec.gdgamecenter.library.R;
import com.orbbec.gdgamecenter.listener.PackageActionReceiver;
import com.orbbec.gdgamecenter.module.MyModule;
import com.orbbec.gdgamecenter.network.ServerConstants;
import com.orbbec.gdgamecenter.network.ServerHelper;
import com.orbbec.gdgamecenter.presenter.WeexPresenter;
import com.orbbec.gdgamecenter.utils.ActivityHelper;
import com.orbbec.gdgamecenter.utils.Config;
import com.orbbec.gdgamecenter.utils.CountlyHelper;
import com.orbbec.gdgamecenter.utils.InstallAppHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.UpdateService;
import com.orbbec.gdgamecenter.utils.Utils;
import com.orbbec.utils.ApkUtils;
import com.orbbec.utils.NetUtils;
import com.shuyu.gsyvideoplayer.GSYVideoManager;
import com.taobao.weex.IWXRenderListener;
import com.taobao.weex.WXEnvironment;
import com.taobao.weex.WXSDKEngine;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.common.WXException;
import com.taobao.weex.common.WXRenderStrategy;
import com.taobao.weex.utils.WXFileUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.Map;

public class HomeActivity extends AppCompatActivity {
    protected boolean isActive = false;
    public LinearLayout viewGroup;
    protected WXSDKInstance mInstance;
    protected WeexPresenter mPresenter;
    private static Handler mHandler;
    private final static String TAG = "Main";
    private PackageActionReceiver packageActionReceiver;
    private BroadcastReceiver networkStateChangeReceiver;
    private static String currentIp = "";
    private String directOpen = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
       // CountlyHelper.initCountly(this,CountlyHelper.CHANNEL_TEST);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        setContentView(R.layout.activity_main);
        ActivityHelper.getInstance().addActivity(this);
        if (this.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT) {
            LogUtils.d(TAG, "onCreate: 竖屏");
            //竖屏
        } else {
            LogUtils.d(TAG, "onCreate: 横屏");
            //横屏
        }
        if(!WXApplication.COUNTLY_INITED){
            initCountly();
        }
        viewGroup = findViewById(R.id.homeViewGroup);
        mInstance = new WXSDKInstance(this);
        mInstance.registerRenderListener(new IWXRenderListener() {
            @Override
            public void onViewCreated(WXSDKInstance instance, View view) {
                LogUtils.d(TAG, "onViewCreated: is Created");
                if(view.getParent() != null) {
                    ((ViewGroup)view.getParent()).removeView(view);
                }
                viewGroup.addView(view);

            }

            @Override
            public void onRenderSuccess(WXSDKInstance instance, int width, int height) {
                LogUtils.d(TAG, "onRenderSuccess: is Success");
            }

            @Override
            public void onRefreshSuccess(WXSDKInstance instance, int width, int height) {
                LogUtils.d(TAG, "onRefreshSuccess: is Success");
            }

            @Override
            public void onException(WXSDKInstance instance, String errCode, String msg) {
                LogUtils.d(TAG, "onException: " + msg + "    " + WXEnvironment.isCPUSupport());
            }
        });

        if (WXSDKEngine.isInitialized()) {
            //添加网络状态更改的广播
            networkStateChangeReceiver = new BroadcastReceiver() {
                @Override
                public void onReceive(Context context, Intent intent) {
                    //如果是在开启wifi连接和有网络状态下
                    if (ConnectivityManager.CONNECTIVITY_ACTION.equals(intent.getAction())) {
                        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
                        NetworkInfo info = intent.getParcelableExtra(ConnectivityManager.EXTRA_NETWORK_INFO);
                        if(info!=null){
                            if (NetworkInfo.State.CONNECTED == info.getState()) {
                                //连接状态 处理自己的业务逻辑
                                currentIp = "";
                            } else {
                                Toast.makeText(context, "网络连接失败", Toast.LENGTH_SHORT).show();
                            }
                        }

                    }
                }
            };
            IntentFilter filter=new IntentFilter();
            filter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);
            filter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION);
            filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
            registerReceiver(networkStateChangeReceiver, filter);
            renderIndexPage();
        } else {
            mHandler = new Handler() {
                @Override
                public void handleMessage(Message msg) {
                    if (msg.what == 0) {
                      //  LogUtils.i("dxm", "WXSDKEngine.isInitialized: " + WXSDKEngine.isInitialized());
                        if (WXSDKEngine.isInitialized()) {
                            renderIndexPage();
                        } else {
                            msg = mHandler.obtainMessage(0);
                            mHandler.sendMessageDelayed(msg, 100);
                        }
                    }
                }
            };
            Message msg = mHandler.obtainMessage(0);
            mHandler.sendMessageDelayed(msg, 100);
        }

        registerModules();

        registerCustomReceivers();
    }

    protected void registerModules() {
        mPresenter = new WeexPresenter(this , mInstance);

        try {
            WXSDKEngine.registerModule("myModule", MyModule.class);
            WXSDKEngine.registerComponent("simpleVideo", GsySimpleVideo.class);
            MyModule.setPresenter(mPresenter);
        } catch (WXException e) {
            e.printStackTrace();
        }
    }

    private void renderIndexPage(){
        renderPage(mInstance, getPackageName(), WXFileUtils.loadAsset("pages/index/entry.js", this));
    }



    @Override
    protected void onResume() {
        super.onResume();
        if(mInstance!=null){
            mInstance.onActivityResume();
        }
        if(TextUtils.isEmpty(directOpen)) {
            LogUtils.d(TAG, "onStart: isStartOrbbecGame = false");
            WXApplication.isStartOrbbecGame = false;
        }
        DownloadProgressAdapter.setPresenter(mPresenter);
        LogUtils.e(TAG, "onResume: " );
        mPresenter.getDownloadList();
        InstallAppHelper.getInstance().isCouldInstall = true;
        InstallAppHelper.getInstance().installApp(null);
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        //不响应按键抬起时的动作
        if(event.getAction() == KeyEvent.ACTION_DOWN && WXApplication.getContext().isFeasibility
                && (event.getKeyCode() == KeyEvent.KEYCODE_DPAD_CENTER ||
                event.getKeyCode() == KeyEvent.KEYCODE_DPAD_LEFT||
                event.getKeyCode()==KeyEvent.KEYCODE_DPAD_RIGHT ||
                event.getKeyCode()==KeyEvent.KEYCODE_DPAD_DOWN ||
                event.getKeyCode()==KeyEvent.KEYCODE_DPAD_UP ||
                event.getKeyCode()==KeyEvent.KEYCODE_ENTER ||
                event.getKeyCode()==KeyEvent.KEYCODE_BACK)){
            LogUtils.d("tzh", "onKeyDown: " + event.getKeyCode());
            mPresenter.keyDown(event.getKeyCode());
            return true;
        }
        LogUtils.d("tzh", "onKeyDown: " + event.getKeyCode());
        return super.dispatchKeyEvent(event);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if(mInstance!=null){
            mInstance.onActivityPause();
        }
        InstallAppHelper.getInstance().isCouldInstall = false;
        LogUtils.e(TAG, "onPause: ");
    }

    @Override
    protected void onStop() {
        super.onStop();
        if(mInstance!=null){
            mInstance.onActivityStop();
        }
        String bundleUrl = mInstance.getBundleUrl();
        Log.d("playing", "onStop: " + bundleUrl);
        GSYVideoManager instance = GSYVideoManager.instance();
        if(instance!=null && instance.getPlayer()!=null) {
            boolean playing = instance.getPlayer().isPlaying();
            if (playing) {
                if (bundleUrl.equals(getPackageName())) {
                    instance.pause();
                }
            }
        }
        CountlyHelper.onCountlyStop();
        LogUtils.e(TAG, "onStop: ");
        Glide.get(this).clearMemory();
    }

    @Override
    protected void onStart() {
        super.onStart();
        if(mInstance!=null){
            mInstance.onActivityStart();
        }
        if(TextUtils.isEmpty(directOpen)) {
            LogUtils.d(TAG, "onStart: isStartOrbbecGame = false");
            WXApplication.isStartOrbbecGame = false;
        }
        CountlyHelper.onCountlyStart(this);
        LogUtils.e(TAG, "onStart: ");
    }


    @Override
    protected void onDestroy() {
        LogUtils.e(TAG, "onDestroy: ");
        super.onDestroy();
        if(mInstance!=null){
            mInstance.onActivityDestroy();
        }
        if(packageActionReceiver != null){
            unregisterReceiver(packageActionReceiver);
        }

        if(networkStateChangeReceiver != null){
            unregisterReceiver(networkStateChangeReceiver);
        }
        String bundleUrl = mInstance.getBundleUrl();
        GSYVideoManager instance = GSYVideoManager.instance();
        if(instance!=null && instance.getPlayer()!=null) {
            boolean playing = instance.getPlayer().isPlaying();
            if (playing) {
                if (bundleUrl.equals(getPackageName())) {
                    Log.d("playing", "onDestroy: ");
                    GSYVideoManager.releaseAllVideos();
                }
            }
        }
    }




    private void renderPage(final WXSDKInstance instance, final String packageName, final String js) {
        //渲染页面
        String RenderPageUrl = "";
        Map<String, Object> options = new HashMap<>();
        GDGameCenterInfo info = WXApplication.getContext().getInfo();
        if(!NetUtils.networkCanUse(this)){
            RenderPageUrl = WXFileUtils.loadAsset("pages/error/entry.js", this);
            instance.render(packageName, RenderPageUrl, null, null, WXRenderStrategy.APPEND_ASYNC);
            return;
        }
        directOpen = getIntent().getStringExtra("app_packagename");
        String actionType = getIntent().getStringExtra("actionName");
        if(info != null){
            //如果已经获取了大厅信息则直接开始渲染
            if(directOpen!=null){
                directOpen = "/pages/appDetails/entry.js?packageName="+directOpen+"&isEPG=true";
                PackageManager pm = getPackageManager();
                PackageInfo info2 = null;
                String startAppPackageName = getIntent().getStringExtra("app_packagename");
                try {
                    LogUtils.d("FujianBaminSDK", "startAppPackageName: " + startAppPackageName);
                    info2 = pm.getPackageInfo(startAppPackageName, 0);
                } catch (PackageManager.NameNotFoundException e) {
                    LogUtils.e("tzh", "initType: "+ e.fillInStackTrace());
                }

                if(info2 != null) {
                    WXApplication.isStartOrbbecGame = true;
                    ApkUtils.runPackage(WXApplication.getContext(), startAppPackageName);
                    if (info.app.state == 0) {
                        //大厅信息显示为apk整包更新则直接获取本地的assets地址
                        RenderPageUrl = js;
                        instance.render(packageName, RenderPageUrl, null, null, WXRenderStrategy.APPEND_ASYNC);
                    } else {

                        //如果为js更新则直接拉线上最新的js
                        RenderPageUrl = ServerConstants.APP_HOST+info.app.zip_url+"/pages/index/entry.js";
                        instance.renderByUrl(packageName, RenderPageUrl, options, null, WXRenderStrategy.APPEND_ASYNC);
                    }
                }else {
                    RenderPageUrl = doRender(instance, packageName, options, info, directOpen);
                }
                return;
            }

            if(!TextUtils.isEmpty(actionType)){
                if(!isActive) {
                    String http = "http://112.50.251.23:10095/static/js/" + actionType + ".js?activeName=" + actionType + "&isEPG=true";
                    LogUtils.d("tzh", "renderPage: " + http);
                    isActive = true;
                    RenderPageUrl = http;
                    options.put(WXSDKInstance.BUNDLE_URL, RenderPageUrl);
                    instance.renderByUrl(packageName, http, null, null, WXRenderStrategy.APPEND_ASYNC);
                }
                return;
            }

            if(getIntent().getData()!=null )
            {
                LogUtils.e(TAG, "getData"+ getIntent().getData().toString() );

                if(getIntent().getData().toString().contains("active")){
                    try{
                        String[] arr = java.net.URLDecoder.decode(getIntent().getData().toString(), "UTF-8").split("=");
                        instance.renderByUrl(packageName, arr[1], options, null, WXRenderStrategy.APPEND_ASYNC);
                    }
                    catch (Exception e){
                        e.printStackTrace();
                    }
                  return;
                }
                //渲染详情页
                String navUrl = getIntent().getData().toString().substring(5);


                RenderPageUrl = doRender(instance, packageName, options, info, navUrl);
            }
            else {

                //渲染大厅页面
                if (info.app.state == 0) {
                    //大厅信息显示为apk整包更新则直接获取本地的assets地址
                    RenderPageUrl = js;
                    instance.render(packageName, RenderPageUrl, null, null, WXRenderStrategy.APPEND_ASYNC);
                } else {

                    //如果为js更新则直接拉线上最新的js
                    RenderPageUrl = ServerConstants.APP_HOST+info.app.zip_url+"/pages/index/entry.js";
                    instance.renderByUrl(packageName, RenderPageUrl, options, null, WXRenderStrategy.APPEND_ASYNC);
                }
            }
            LogUtils.e(TAG, "rendering: "+RenderPageUrl);
        }
        else {
            //重新获取大厅信息，成功后重新加载页面
            ServerHelper.requestGdGameCenterInfo(new Callback.CommonCallback<JSONObject>() {
                    @Override
                    public void onSuccess(JSONObject result) {
                        if (result != null) {
                            if (updateAppInfo(result)) {
                                return;
                            }
                            renderPage( instance, packageName, js);
                        }
                    }

                        @Override
                        public void onError(Throwable ex, boolean isOnCallback) {

                        }

                        @Override
                        public void onCancelled(CancelledException cex) {

                        }

                        @Override
                        public void onFinished() {

                        }
                    });
        }
    }

    @NonNull
    private String doRender(WXSDKInstance instance, String packageName, Map<String, Object> options, GDGameCenterInfo info, String navUrl) {
        String RenderPageUrl;
        if (info.app.state == 0) {
            RenderPageUrl = "file://assets"+navUrl;
            options.put(WXSDKInstance.BUNDLE_URL, RenderPageUrl);
            instance.renderByUrl(packageName, RenderPageUrl, options, null, WXRenderStrategy.APPEND_ASYNC);
            LogUtils.e(TAG, "rendering: "+ navUrl );
        }
        else {
            RenderPageUrl = ServerConstants.APP_HOST+info.app.zip_url+navUrl;
            options.put(WXSDKInstance.BUNDLE_URL, RenderPageUrl);
            instance.renderByUrl(packageName, RenderPageUrl, options, null, WXRenderStrategy.APPEND_ASYNC);
            LogUtils.e(TAG, "renderingp: "+ navUrl );
        }
        return RenderPageUrl;
    }

    private boolean updateAppInfo(JSONObject result) {
        try {
            JSONArray objects = result.optJSONArray("objects");
            JSONObject json = objects.getJSONObject(0);
            Type type = new TypeToken<GDGameCenterInfo>() {
            }.getType();
            Gson gson = new Gson();
            GDGameCenterInfo info = gson.fromJson(json.toString(), type);
            LogUtils.d("dxm", json.toString());
            SharedPreferences sp = getSharedPreferences(Config.SP_NAME, MODE_PRIVATE);
            sp.edit().putString(Config.APP_CODE, info.code).commit();
            WXApplication.getContext().setInfo(info);
            PackageManager pm = WXApplication.getContext().getPackageManager();
            try {
                PackageInfo packageInfo = pm.getPackageInfo(getPackageName(), 0);
                if (packageInfo.versionCode < (info.app.version_code)) {
                    UpdateService.startDownload(WXApplication.getContext(), info.app.package_name, ServerConstants.APP_HOST + info.app.app_url, info.app.state);
                }

            } catch (PackageManager.NameNotFoundException e) {
                e.printStackTrace();
                return true;
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return false;
    }

    private void registerCustomReceivers(){
        LogUtils.d(TAG, "registerCustomReceivers: ");
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_PACKAGE_REMOVED);
        intentFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
        intentFilter.addDataScheme("package");
        packageActionReceiver = new PackageActionReceiver();
        packageActionReceiver.setPresenter(this.mPresenter);
        registerReceiver(packageActionReceiver, intentFilter);
    }

    private void initCountly() {
        String channel = Utils.getMedaData("CHANNEL" , this);
        LogUtils.d("dxm", "initCountly: " + channel);
        CountlyHelper.initCountly(this, channel);
    }


    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        LogUtils.d("tzh", "onKeyDown1111111: "  + keyCode );
        return super.onKeyDown(keyCode, event);
    }
}