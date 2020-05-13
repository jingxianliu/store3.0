package com.orbbec.gdgamecenter;

import android.content.Context;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import com.istv.ystframework.client.InstallClient;
import com.orbbec.gdgamecenter.activity.LaunchActivity;
import com.orbbec.gdgamecenter.network.download.DefaultDownloadViewHolder;
import com.orbbec.gdgamecenter.network.download.DownloadCallback;
import com.orbbec.gdgamecenter.network.download.DownloadInfo;
import com.orbbec.gdgamecenter.network.download.DownloadManager;
import com.orbbec.gdgamecenter.network.download.DownloadViewHolder;
import com.orbbec.gdgamecenter.utils.InstallAppHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.StorageBlock;

import org.xutils.common.Callback;
import org.xutils.ex.DbException;
import org.xutils.http.RequestParams;
import org.xutils.x;

import java.io.File;

/**
 * @author Altair
 * @date 2019/9/11
 */
public class AHDownloadManager extends DownloadManager {

    public static void initDownloadManager(){
        if (instance == null) {
            synchronized (AHDownloadManager.class) {
                if (instance == null) {
                    instance = new AHDownloadManager();
                }
            }
        }
    }
    @Override
    public synchronized void startDownload(final Context context, String url, String label, final String savePath, boolean autoResume, boolean autoRename, DownloadViewHolder viewHolder) throws DbException {
        String fileSavePath = new File(savePath).getAbsolutePath();
        //本地已有apk
        if(savePath.endsWith(".apk")&&queryDownloaded(context, label, savePath)){
//                InstallAppHelper.getInstance().offer(label, savePath);

            long availableInternalMemorySize = StorageBlock.getAvailableInternalMemorySize(context);
            if (availableInternalMemorySize > WXApplication.INSTALL_SPACE_SIZE) {
                toast("开始安装",context);
                new Thread(new Runnable() {
                    @Override
                    public void run() {
                        boolean ret = InstallClient.getInstance(context).installApk(savePath);
                        if(ret){
                            new File(savePath).delete();
                        }
                    }
                }).start();

            } else {
                toast("安装失败: 内存空间不足",context);
            }

        }else {
            long availableSDSize = StorageBlock.getAvailableSDSize(context);
            LogUtils.e("dxm", "installApp: "+"SD内存空间:"+availableSDSize +" 限制："+WXApplication.INSTALL_SPACE_SIZE);
            if (availableSDSize < WXApplication.INSTALL_SPACE_SIZE) {
                LogUtils.e("dxm", "installApp: "+"SD内存空间不足" );
                toast("下载失败: SD卡内存空间不足",context);
                return;
            }
            LogUtils.e("dxm", "startDownload: "+url );
            DownloadInfo downloadInfo = db.selector(DownloadInfo.class)
                    .where("label", "=", label)
                    .and("fileSavePath", "=", fileSavePath)
                    .findFirst();
            if (downloadInfo != null) {
                DownloadCallback callback = callbackMap.get(downloadInfo);
                if (callback != null) {
                    if (viewHolder == null) {
                        viewHolder = new DefaultDownloadViewHolder(null, null, downloadInfo);
                    }
                    if (callback.switchViewHolder(viewHolder)) {
                        return;
                    } else {
                        callback.cancel();
                    }
                }
            }

            // create download info
            if (downloadInfo == null) {
                downloadInfo = new DownloadInfo();
                downloadInfo.setUrl(url);
                downloadInfo.setAutoRename(autoRename);
                downloadInfo.setAutoResume(autoResume);
                downloadInfo.setLabel(label);
                downloadInfo.setFileSavePath(fileSavePath);
                db.saveBindingId(downloadInfo);
            }

            // start downloading
            if (viewHolder == null) {
                viewHolder = new DefaultDownloadViewHolder(null, null, downloadInfo);
            } else {
                viewHolder.update(downloadInfo);
            }
            DownloadCallback callback = newDownloadCallback(viewHolder);
            callback.setDownloadManager(this);
            callback.switchViewHolder(viewHolder);
            RequestParams params = new RequestParams(url);
            params.setAutoResume(downloadInfo.isAutoResume());
            params.setAutoRename(downloadInfo.isAutoRename());
            params.setSaveFilePath(downloadInfo.getFileSavePath());
            params.setExecutor(executor);
            params.setCancelFast(true);
            Callback.Cancelable cancelable = x.http().get(params, callback);
            callback.setCancelable(cancelable);
            callbackMap.put(downloadInfo, callback);

            if (downloadInfoList.contains(downloadInfo)) {
                int index = downloadInfoList.indexOf(downloadInfo);
                downloadInfoList.remove(downloadInfo);
                downloadInfoList.add(index, downloadInfo);
            } else {
                downloadInfoList.add(downloadInfo);
            }
        }

    }

    private void toast(final String text, final Context context){
        ((AppCompatActivity)context).runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(context,text,Toast.LENGTH_SHORT).show();
            }
        });
    }
}
