package com.orbbec.gdgamecenter;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import com.knowyou_jni.single.SDKUtil;
import com.orbbec.countly.CountlyParams;
import com.orbbec.countly.CountlyUtils;
import com.orbbec.gdgamecenter.baminsdk.Constants;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.Utils;

import java.util.HashMap;

import ly.count.android.sdk.Countly;
/**
 * @author Altair
 * @date 2019/1/9
 */
public class FJYDApplication extends WXApplication{

    private boolean isStart = false;
    private int result_num = 0;
    private Context context;

    @Override
    public void onCreate(){
        super.onCreate();
        context = getApplicationContext();
//        CountlyUtils.getInstance().initCountly(context, CountlyParams.CHANNEL_JSYD[0], Utils.getDevInstall(context), Utils.getMAC());
//        CountlyUtils.getInstance().sendBegin();

        initBamin();
        if(com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance == null){
            Intent startintent = new Intent(this,com.orbbec.gdgamecenter.baminsdk.HomeKeyService.class);
            this.startService(startintent);
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
            HashMap loginMap = new HashMap();
            loginMap.put("USER_LOGIN", "1");
            loginMap.put("USER_ID", Utils.getOTTCountFJ(this));
            loginMap.put("APP_NAME", Constants.APP_NAME);
            loginMap.put("APP_TYPE", Constants.APP_TYPE);
            loginMap.put("USER_ORDER", "未订购");
            if(Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
                result_num = SDKUtil.getInstance().ky_trackCustom(loginMap);
                LogUtils.d("baminResult", "startBamin   " + result_num);
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

        result_num =  SDKUtil.getInstance().ky_initWithAppKey(this,
                "6afec671a0214fbea87d7fe6bd830ac2", getAppVersion(this)) ;
        if (result_num == 0){
            LogUtils.d("FujianBaminSDK", "成功");
        }else if (result_num == -1){
            LogUtils.d("FujianBaminSDK", "AppKey不合法");
        }else if (result_num == -4){
            LogUtils.d("FujianBaminSDK", "App的软件版本号错误");
        }
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


}
