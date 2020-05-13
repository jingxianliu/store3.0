package com.orbbec.gdgamecenter.activity;

import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.orbbec.gdgamecenter.FJYDApplication;
import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.baminsdk.Constants;
import com.orbbec.gdgamecenter.interfaces.BaminInterface;
import com.orbbec.gdgamecenter.utils.LogUtils;

import java.util.List;

import static com.orbbec.gdgamecenter.WXApplication.getContext;

/**
 * @author Altair
 * @date 2019/1/9
 */
public class LaunchActivity extends HomeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onStart() {
        super.onStart();
        ((BaminInterface) getApplication()).startBamin();
    }

    @Override
    protected void onResume() {
        FJYDApplication.isInstallActivity = false;
        LogUtils.d("isInstallActivity", "onResume:00000000 " + WXApplication.isInstallActivity);
        super.onResume();
    }

    @Override
    protected void onPause() {
        LogUtils.d("FujianBaminSDK", "onPause: ");
        super.onPause();
    }

    private void LoginOut() {
        LogUtils.d(Constants.TAG, "Instance = " + com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance);
        com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance.GamePlayEnd();
    }

    @Override
    protected void onStop() {
        LogUtils.d("FujianBaminSDK", "onStop: ");
        super.onStop();
        ActivityManager am = (ActivityManager) getApplication().getSystemService(ACTIVITY_SERVICE);
        String packageName = am.getRecentTasks(10, 0).get(0).baseIntent.getComponent().getPackageName();
        LogUtils.d("FujianBaminSDK", "onStop: " + packageName + "     isActive: " + isActive + "    " + isAppIsInBackground());
        if ((packageName != null && !packageName.equals(getPackageName())) && !WXApplication.isUninstall) {
            ((BaminInterface) getContext().getApplicationContext()).endBamin();
        }else if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT_WATCH) {
             if (isAppIsInBackground() && !WXApplication.isUninstall) {
                 ((BaminInterface) getContext().getApplicationContext()).endBamin();
             }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    private boolean isAppIsInBackground() {
        boolean isInBackground = true;
        ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT_WATCH) {
            List<ActivityManager.RunningAppProcessInfo> runningProcesses = am.getRunningAppProcesses();
            for (ActivityManager.RunningAppProcessInfo processInfo : runningProcesses) {
                //前台程序
                if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                    for (String activeProcess : processInfo.pkgList) {
                        if (activeProcess.equals(getPackageName())) {
                            isInBackground = false;
                        }
                    }
                }
            }
        } else {
            List<ActivityManager.RunningTaskInfo> taskInfo = am.getRunningTasks(1);
            ComponentName componentInfo = taskInfo.get(0).topActivity;
            if (componentInfo.getPackageName().equals(getPackageName())) {
                isInBackground = false;
            }
        }

        return isInBackground;
    }
}
