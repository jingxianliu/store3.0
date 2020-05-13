package com.orbbec.gdgamecenter;

import com.orbbec.gdgamecenter.module.MyModule;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.taobao.weex.annotation.JSMethod;

/**
 * @author Altair
 * @date 2019/9/11
 */
public class AHModule extends MyModule {

    @JSMethod(uiThread = false)
    @Override
    public void downLoad(String packageName, String url) {
        LogUtils.d("AHModule","silentDownload");
        sPresenter.silentDownload(packageName , url);
    }

    @JSMethod(uiThread = false)
    @Override
    public void uninstall(String packageName) {
        LogUtils.d("AHModule","silentUninstall");
        sPresenter.silentUninstall(packageName);
    }
}
