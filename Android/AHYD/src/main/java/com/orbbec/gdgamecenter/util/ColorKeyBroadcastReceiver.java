package com.orbbec.gdgamecenter.util;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.orbbec.gdgamecenter.BuildConfig;
import com.orbbec.gdgamecenter.baminsdk.HomeKeyService;
import com.orbbec.gdgamecenter.utils.LogUtils;

/**
 * @author Altair
 * @date 2019/8/15
 */
public class ColorKeyBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
            try {

                LogUtils.d("FujianBaminSDK", "onReceive: ColorKeyDownExit");

                com.orbbec.gdgamecenter.baminsdk.HomeKeyService.Instance.quit();

            }catch (Exception ex){
                ex.printStackTrace();
            }
    }
}
