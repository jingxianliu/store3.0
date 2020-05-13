package com.orbbec.gdgamecenter.activity;

import android.os.Bundle;

import com.orbbec.gdgamecenter.R;

/**
 * @author Altair
 * @date 2019/1/9
 */
public class WelcomeActivity extends MLaunchActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mLauncherDevID = R.drawable.laucher_dev_guangdong;
        mLaunch_default = R.drawable.launch_default;
        mHomeActvityClass = LaunchActivity.class;
        super.onCreate(savedInstanceState);
    }
}
