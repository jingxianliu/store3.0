package com.orbbec.gdgamecenter;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import com.istv.ystframework.client.InstallClient;
import com.orbbec.gdgamecenter.listener.AppInfoLister;
import com.orbbec.gdgamecenter.network.download.DefaultDownloadViewHolder;
import com.orbbec.gdgamecenter.network.download.DownloadInfo;
import com.orbbec.gdgamecenter.network.download.DownloadManager;
import com.orbbec.gdgamecenter.presenter.WeexPresenter;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.Utils;
import com.taobao.weex.WXSDKInstance;

import org.xutils.ex.DbException;

/**
 * @author Altair
 * @date 2019/9/11
 */
public class AHPresenter extends WeexPresenter {


    public AHPresenter(Context context, WXSDKInstance instance) {
        super(context, instance);
    }

    @Override
    public void silentDownload(String packageName, String url) {
        LogUtils.d("AHPresenter", "silentDownload: ah");
        String saveFile = url.substring(url.lastIndexOf("/") + 1);
        String savePath = Utils.getApkStorePath(WXApplication.getContext()) + saveFile + ".apk";
        DownloadInfo downloadInfo = new DownloadInfo();
        downloadInfo.setLabel(packageName);
        downloadInfo.setFileSavePath(savePath);
        downloadInfo.setUrl(url);
        downloadInfo.setAutoRename(false);
        downloadInfo.setAutoResume(true);
        try {
            AHDownloadManager.getInstance().startDownload(mContext , url, packageName, savePath, true, false,
                    new AHDownloadViewHolder(this, null, downloadInfo, mContext));
        } catch (DbException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void silentUninstall(String packageName) {
        InstallClient.getInstance(mContext).uninstallApk(packageName);
    }

    @Override
    public void loading(String packageName, int progress) {
        super.loading(packageName, progress);
    }

    @Override
    public void onUninstallSuccess(boolean action) {
        super.onUninstallSuccess(action);
    }

    @Override
    public void keyDown(int keyCode) {
        super.keyDown(keyCode);
    }

    @Override
    public void intstalled(String packageInfo, int result) {
        super.intstalled(packageInfo, result);
    }

    @Override
    public void startDownload(String packageName, String url) {
        super.startDownload(packageName, url);
    }

    @Override
    public void uninstall(String packageName) {
        super.uninstall(packageName);
    }

    @Override
    public void startApp(String packageName) {
        super.startApp(packageName);
    }

    @Override
    public void finish() {
        super.finish();
    }

    @Override
    public boolean getgetAppInstalled(String packageName) {
        return super.getgetAppInstalled(packageName);
    }

    @Override
    public void getLocalOrbbecApp(AppInfoLister appInfoLister) {
        super.getLocalOrbbecApp(appInfoLister);
    }

    @Override
    public void getLocalAppInfo(String name, AppInfoLister appInfoLister) {
        super.getLocalAppInfo(name, appInfoLister);
    }

    @Override
    public int getInstalledAppVersion(String name) {
        return super.getInstalledAppVersion(name);
    }

    @Override
    public boolean getConnection() {
        return super.getConnection();
    }

    @Override
    public void getDownloadList() {
        super.getDownloadList();
    }

    @Override
    public boolean useCamera() {
        return super.useCamera();
    }

    @Override
    public Context getContext() {
        return super.getContext();
    }
}
