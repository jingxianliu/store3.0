package com.orbbec.gdgamecenter;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.istv.ystframework.client.InstallClient;
import com.orbbec.gdgamecenter.activity.LaunchActivity;
import com.orbbec.gdgamecenter.network.download.DefaultDownloadViewHolder;
import com.orbbec.gdgamecenter.network.download.DownloadInfo;
import com.orbbec.gdgamecenter.network.download.DownloadManager;
import com.orbbec.gdgamecenter.presenter.WeexPresenter;
import com.orbbec.gdgamecenter.utils.StorageBlock;

import org.xutils.ex.DbException;

import java.io.File;

/**
 * @author Altair
 * @date 2019/9/11
 */
public class AHDownloadViewHolder extends DefaultDownloadViewHolder {
    private Context mContext;
    public AHDownloadViewHolder(WeexPresenter presenter, View view, DownloadInfo downloadInfo, Context context) {
        super(presenter, view, downloadInfo);
        mContext = context;
    }

    @Override
    public void onSuccess(final File result) {
        String name = result.getName();
        if (name.endsWith(".apk")) {
            long availableInternalMemorySize = StorageBlock.getAvailableInternalMemorySize(mContext);
            if (availableInternalMemorySize > WXApplication.INSTALL_SPACE_SIZE) {
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        boolean ret = InstallClient.getInstance(mContext).installApk(downloadInfo.getFileSavePath());
                        if(ret){
                            result.delete();
                        }
                    }
                }).start();

            } else {
                ((AppCompatActivity)mContext).runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(mContext,"安装失败: 内存空间不足",Toast.LENGTH_LONG).show();
                    }
                });
            }
        }
        try {
            DownloadManager.getInstance().removeDownload(downloadInfo);
        } catch (DbException e) {
            e.printStackTrace();
        }
    }
}
