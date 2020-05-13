package com.orbbec.gdgamecenter.network.download;

import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.UpdateService;
import com.orbbec.utils.XLog;
import com.orbbec.gdgamecenter.adapter.DownloadProgressAdapter;
import com.orbbec.gdgamecenter.presenter.WeexPresenter;
import com.orbbec.gdgamecenter.utils.InstallAppHelper;

import org.xutils.common.Callback;
import org.xutils.ex.DbException;
import org.xutils.x;

import java.io.File;

/**
 * @author wyouflf
 * @date 15/11/11
 */
public class DefaultDownloadViewHolder extends DownloadViewHolder {

    private final String TAG = "DefaultDownload";
    private boolean isUpdateLoading = true;
    protected WeexPresenter mPresenter;
    private String packageName = "";

    public DefaultDownloadViewHolder(WeexPresenter presenter , View view, DownloadInfo downloadInfo) {
        super(view, downloadInfo);
        this.mPresenter = presenter;
        this.packageName = downloadInfo.getLabel();
        XLog.i(TAG, "new download { " + downloadInfo.getLabel() + " } size = " + downloadInfo.getFileLength());
    }

    public void setUpdateLoading(boolean updateLoading) {
        isUpdateLoading = updateLoading;
    }

    public boolean getUpdateLoading() {
        return isUpdateLoading;
    }

    @Override
    public void onWaiting() {
        XLog.i(TAG, "onWaiting { " + downloadInfo.getLabel() + " } size = " + downloadInfo.getFileLength());
    }

    @Override
    public void onStarted() {
        XLog.i(TAG, "onStarted { " + downloadInfo.getLabel() + " } size = " + downloadInfo.getFileLength());
    }

    @Override
    public void onLoading(long total, long current) {
        int progress = (int) (current * 100 / total);
        if(mPresenter != null) {
          //  sPresenter.loading(packageName , progress);
            DownloadProgressAdapter.sendProgress(packageName , progress);
        }
        LogUtils.d(TAG, "onLoading: " + progress);
    }

    @Override
    public void onSuccess(File result) {
        XLog.i(TAG, "onSuccess { " + downloadInfo.getLabel() + " } size = " + downloadInfo.getFileLength());
        String name = result.getName();
        if (name.endsWith(".apk")) {
            requestInstall(downloadInfo.getLabel(), downloadInfo.getFileSavePath() , downloadInfo);
        }
        else{
            try{
             //   UpdateService.unZipFile(downloadInfo.getFileSavePath(),"s");
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        try {
            DownloadManager.getInstance().removeDownload(downloadInfo);
        } catch (DbException e) {
//            e.printStackTrace();
        }
    }

    @Override
    public void onError(Throwable ex, boolean isOnCallback) {
        Toast.makeText(x.app(), "下载失败", Toast.LENGTH_LONG).show();
        XLog.i(TAG, "onError { " + downloadInfo.getLabel() + " } size = " + downloadInfo.getFileLength() + ex.toString());
        try {
            DownloadManager.getInstance().removeDownload(downloadInfo);
        } catch (DbException e) {
//            e.printStackTrace();
        }
    }

    @Override
    public void onCancelled(Callback.CancelledException cex) {
        XLog.i(TAG, "onError { " + downloadInfo.getLabel() + " } size = " + downloadInfo.getFileLength());
        try {
            DownloadManager.getInstance().removeDownload(downloadInfo);
        } catch (DbException e) {
//            e.printStackTrace();
        }
    }


    private void requestInstall(String packageName, String savePath , DownloadInfo downloadInfo) {
        InstallAppHelper.getInstance().offer(packageName, savePath);
        if (InstallAppHelper.getInstance().isCouldInstall) {
            InstallAppHelper.getInstance().installApp(downloadInfo);
        }
    }
}
