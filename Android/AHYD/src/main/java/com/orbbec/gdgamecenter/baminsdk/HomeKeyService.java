package com.orbbec.gdgamecenter.baminsdk;

import android.app.ActivityManager;
import android.app.Service;
import android.content.ComponentName;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;

import com.orbbec.gdgamecenter.AHYDApplication;
import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.interfaces.BaminInterface;
import com.orbbec.gdgamecenter.util.ColorKeyBroadcastReceiver;
import com.orbbec.gdgamecenter.utils.ActivityHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.Utils;

import java.util.HashMap;

public class HomeKeyService extends Service {
    private static final String TAG = "FujianBaminSDK";
    private static final String BROADCAST_ACTION_EXITTOEPG ="exitToEPG";
    private static final String BROADCAST_ACTION_GAMECENTER ="exitToGamecenter";
    public static com.orbbec.gdgamecenter.baminsdk.HomeKeyService Instance = null;

    private ColorKeyBroadcastReceiver mColorKeyBroadcastReceiver = null;
    private LocalBinder binder = new LocalBinder();
    HomeKeyEventBroadCastReceiver m_HomeKeyEventBroadCastReceiver;

    public class LocalBinder extends Binder {
        public HomeKeyService getService() {
            return HomeKeyService.this;
        }
    }

    @Override
    public IBinder onBind(Intent arg0){
        // TODO Auto-generated method stub
        return binder;
    }

    @Override
    public void onCreate(){
        if (AHYDApplication.getContext() == null){
            LogUtils.e(TAG, "UnityAdaptActivity.m_Instance == null, remove home key service!!");
            stopSelf();
            return;
        }
        mColorKeyBroadcastReceiver = new ColorKeyBroadcastReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BROADCAST_ACTION_EXITTOEPG);
        registerReceiver(mColorKeyBroadcastReceiver, intentFilter);

        if (Instance != null){
            LogUtils.d(TAG, "HomeKeyService has been created!");
            stopSelf();
            return;
        }

        super.onCreate();

        Instance = this;

        LogUtils.d(TAG, "home key service created!");

        m_HomeKeyEventBroadCastReceiver = HomeKeyEventBroadCastReceiver.CreateHomeKeyEventBroadCastReceiver(this,
                new HomeKeyListener() {
                    @Override
                    public void onHomeKeyDown() {
                        LogUtils.i(Constants.TAG, "FujianSDK homeKeyDown");
                        ((BaminInterface)getApplication()).endBamin();
                    }

                    @Override
                    public void onLongHomeKeyDown() {
                        LogUtils.i(Constants.TAG, "FujianSDK longHomeKeyDown");
                        ((BaminInterface)getApplication()).endBamin();
                    }
                });
    }

    public void GamePlayEnd() {
        LogUtils.i(Constants.TAG, "GamePlayEnd 1!");
        if(Instance == null){
            return;
        }
        LogUtils.i(Constants.TAG,"HomeKeyDown GamePlayEnd OTTUser " + Utils.getOTTCountFJ(this));

        ActivityManager am = (ActivityManager) getSystemService(ACTIVITY_SERVICE);
        ComponentName cn = am.getRunningTasks(1).get(0).topActivity;
        String packageName = cn.getPackageName();
        try {
            LogUtils.i("FujianBaminSDK", "GamePlayEnd: "+packageName + " Install:"+ AHYDApplication.isInstallActivity);
            if(packageName.toLowerCase().contains("orbbec")&&!packageName.equals(getPackageName())){
                LogUtils.i(Constants.TAG, "starting orbbec game");
                WXApplication.isStartOrbbecGame = true;
                quitBamin();
            }else if(AHYDApplication.isInstallActivity){
                quitBamin();
                LogUtils.i(Constants.TAG, "installing");
            } else {
                LogUtils.d(TAG, "GamePlayEnd: > 20 && start orbbec game  " + WXApplication.isStartOrbbecGame);
                if(Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT_WATCH && WXApplication.isStartOrbbecGame){
                    LogUtils.d(TAG, "GamePlayEnd: > 20 && start orbbec game");
                    WXApplication.isStartOrbbecGame = false;
                    WXApplication.isExit = false;
                    quitBamin();
                }else{
//                AHYDApplication.finishAll();
                    LogUtils.d(TAG, "GamePlayEnd: ");
                    WXApplication.isExit = true;
                    quitBamin();
                }
            }
        } catch (InterruptedException e) {
            // e.printStackTrace();
        } finally {

//            FJYDApplications.KillProcess();
        }
    }

    private void quitBamin() throws InterruptedException {
        Thread.sleep(2000);
        LogUtils.i(Constants.TAG, "Thread.sleep(2000)");
        LogUtils.i(Constants.TAG, "HomeKeyDown ky_quit");
        if(!WXApplication.isStartOrbbecGame) {
            Instance = null;
            stopSelf();
        }
        if(WXApplication.isExit){
            LogUtils.d(TAG, "finish: ");
            WXApplication.isExit = false;
            ActivityHelper.getInstance().exit();
            System.exit(0);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        LogUtils.d(TAG, "HomeKeyEventBroadCastReceiver unregister!");
        if (m_HomeKeyEventBroadCastReceiver != null) {
            unregisterReceiver(m_HomeKeyEventBroadCastReceiver);
            m_HomeKeyEventBroadCastReceiver = null;
        }
        if(mColorKeyBroadcastReceiver!=null){
            unregisterReceiver(mColorKeyBroadcastReceiver);
            mColorKeyBroadcastReceiver = null;
        }
    }

    public void quit() throws InterruptedException{
        WXApplication.isExit = true;
        WXApplication.isStartOrbbecGame = false;
        quitBamin();
    }

}