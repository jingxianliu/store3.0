package com.orbbec.gdgamecenter.baminsdk;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import com.orbbec.gdgamecenter.utils.ActivityHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;

public class HomeKeyEventBroadCastReceiver extends BroadcastReceiver {
    static final String SYSTEM_REASON = "reason";
    static final String SYSTEM_HOME_KEY = "homekey";
    static final String SYSTEM_RECENT_APPS = "recentapps";

    static final String ACTION_SKYWORTH_HOTKEY = "com.android.sky.SendHotKey";

    HomeKeyListener m_Listener = null;

    public static HomeKeyEventBroadCastReceiver CreateHomeKeyEventBroadCastReceiver(Context context, HomeKeyListener listener) {
        if (context == null)
            return null;

        HomeKeyEventBroadCastReceiver receiver = new HomeKeyEventBroadCastReceiver();

        context.registerReceiver(receiver, new IntentFilter(Intent.ACTION_CLOSE_SYSTEM_DIALOGS));
        context.registerReceiver(receiver, new IntentFilter("android.intent.action.HOME_KEY_PRESSED"));
        context.registerReceiver(receiver, new IntentFilter(ACTION_SKYWORTH_HOTKEY));

        receiver.m_Listener = listener;

        return receiver;
    }

    @Override
    public void onReceive(Context context, Intent intent){
        String action = intent.getAction();
        if (action.equals("android.intent.action.HOME_KEY_PRESSED")){
            LogUtils.d(Constants.TAG, "HomeKeyReceiver deal with HOME_KEY_PRESSED");
            if (m_Listener != null)
                m_Listener.onHomeKeyDown();
        }
        else if(action.equals(Intent.ACTION_CLOSE_SYSTEM_DIALOGS)){
            String reason = intent.getStringExtra(SYSTEM_REASON);

            if (reason != null){
                if (reason.equals(SYSTEM_HOME_KEY)){
                    LogUtils.d("HomeKeyReceiver", "deal with home key ACTION_CLOSE_SYSTEM_DIALOGS");

                    if (m_Listener != null)
                        m_Listener.onHomeKeyDown();
                }
                else if (reason.equals(SYSTEM_RECENT_APPS)){
                    LogUtils.d("HomeKeyReceiver", "deal with long home key ACTION_CLOSE_SYSTEM_DIALOGS");

                    if (m_Listener != null)
                        m_Listener.onLongHomeKeyDown();
                }
            }
        }
        LogUtils.d("FujianBaminSDK", "onReceive:systemExit ");
        ActivityHelper.getInstance().exit();
        Intent startintent = new Intent(context,com.orbbec.gdgamecenter.baminsdk.HomeKeyService.class);
        context.stopService(startintent);
        System.exit(0);
    }
}
