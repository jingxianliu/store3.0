package com.orbbec.gdgamecenter.listener;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.presenter.WeexPresenter;
import com.orbbec.gdgamecenter.utils.LogUtils;

import static com.orbbec.gdgamecenter.utils.InstallAppHelper.SUCCESS;

/**
 * @author Altair
 * @date 2018/11/30
 */
public class PackageActionReceiver extends BroadcastReceiver {

    private WeexPresenter mPresenter;

    @Override
    public void onReceive(Context context, Intent intent) {
        String packageAdded = Intent.ACTION_PACKAGE_ADDED;
        String packageRemoved = Intent.ACTION_PACKAGE_REMOVED;
        //接收安装广播 || 接收卸载广播
        if (packageRemoved.equals(intent.getAction())) {
            WXApplication.isUninstall = false;
            WXApplication.isInstallActivity = false;
            if(mPresenter!=null){
                mPresenter.onUninstallSuccess(true);
            }
        }

        if (packageAdded.equals(intent.getAction())) {
            WXApplication.isInstallActivity = false;
            WXApplication.isStartOrbbecGame = true;
            String packageName = intent.getData().getSchemeSpecificPart();

            final String[] finalResult = {""};
                final Thread thread = new Thread();
                mPresenter.getLocalAppInfo(packageName, new AppInfoLister() {
                    @Override
                    public void getAppInfo(String result) {
                        finalResult[0] = result;
                        synchronized (thread) {
                            thread.notify();
                        }
                    }
                });
                try {
                    synchronized (thread) {
                        thread.wait();
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();

                }
                mPresenter.intstalled(finalResult[0], SUCCESS);
//            LogUtils.d("dxm","installed "+finalResult[0]);
        }

    }

    public void setPresenter(WeexPresenter presenter){
        this.mPresenter = presenter;
    }
}
