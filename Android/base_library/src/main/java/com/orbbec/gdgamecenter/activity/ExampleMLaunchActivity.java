package com.orbbec.gdgamecenter.activity;

import android.os.Bundle;

import com.orbbec.gdgamecenter.library.R;

/**
 * @author Altair
 * @date 2018/12/7
 */
public class ExampleMLaunchActivity extends MLaunchActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mLauncherDevID = R.drawable.launcher_dev;
        mLaunch_default = R.drawable.launch_default;
        mHomeActvityClass = HomeActivity.class;
        super.onCreate(savedInstanceState);
    }
}
