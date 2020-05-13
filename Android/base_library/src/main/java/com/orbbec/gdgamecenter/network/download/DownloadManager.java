package com.orbbec.gdgamecenter.network.download;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;
import android.widget.Toast;

import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.utils.InstallAppHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.StorageBlock;
import com.orbbec.gdgamecenter.utils.Utils;

import org.xutils.DbManager;
import org.xutils.common.Callback;
import org.xutils.common.task.PriorityExecutor;
import org.xutils.common.util.LogUtil;
import org.xutils.db.converter.ColumnConverterFactory;
import org.xutils.ex.DbException;
import org.xutils.http.RequestParams;
import org.xutils.x;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;

/**
 * Date: 13-11-10
 * Time: 下午8:10
 *
 * @author yh
 */
public class DownloadManager {

    static {
        // 注册DownloadState在数据库中的值类型映射
        ColumnConverterFactory.registerColumnConverter(DownloadState.class, new DownloadStateConverter());
    }

    protected static volatile DownloadManager instance;
    /**
     * 有效的值范围[1, 3], 设置为3时, 可能阻塞图片加载.
     */
    private final static int MAX_DOWNLOAD_THREAD = 1;

    protected final DbManager db;
    protected final Executor executor = new PriorityExecutor(MAX_DOWNLOAD_THREAD, true);
    protected final List<DownloadInfo> downloadInfoList = new ArrayList<DownloadInfo>();
    protected final List<DownloadInfo> installingList = new ArrayList<DownloadInfo>();
    protected final ConcurrentHashMap<DownloadInfo, DownloadCallback>
            callbackMap = new ConcurrentHashMap<DownloadInfo, DownloadCallback>(5);

    public DownloadManager() {
        DbManager.DaoConfig daoConfig = new DbManager.DaoConfig()
                .setDbName("download")
                .setDbVersion(1);
        db = x.getDb(daoConfig);
        try {
            List<DownloadInfo> infoList = db.selector(DownloadInfo.class).findAll();
            if (infoList != null) {
                for (DownloadInfo info : infoList) {
                    if (info.getState().value() < DownloadState.FINISHED.value()) {
                        info.setState(DownloadState.STOPPED);
                    }
                    // 屏蔽数据库中等待下载的数量。当进程意外被杀死，线程池等待线程丢失，导致下载的线程和等到的数目不一致。
                    /*downloadInfoList.add(info);*/
                }
            }
        } catch (DbException ex) {
            LogUtil.e(ex.getMessage(), ex);
        }
    }

    /**
     * package
     */
    public static DownloadManager getInstance() {

        if (instance == null) {
            throw new NullPointerException(InstallAppHelper.class.getName() + "did not initialization!");
        }
        return instance;
    }

    public static void initDownloadManager(){
        if (instance == null) {
            synchronized (DownloadManager.class) {
                if (instance == null) {
                    instance = new DownloadManager();
                }
            }
        }
    }



    public void updateDownloadInfo(DownloadInfo info) throws DbException {
        db.update(info);
    }

    public int getDownloadListCount() {
        return downloadInfoList.size();
    }

    public DownloadInfo getDownloadInfo(int index) {
        return downloadInfoList.get(index);
    }

    public DownloadInfo getDownLoadInfo(String packageName) {
        for (int i = 0; i < downloadInfoList.size(); i++) {
            DownloadInfo downloadInfo = getDownloadInfo(i);
            if (downloadInfo.getLabel().equals(packageName)) {
                return downloadInfo;
            }
        }

        return null;
    }

    public synchronized int queryStatus(String packageName) {
        for (int i = 0; i < downloadInfoList.size(); i++) {
            DownloadInfo downloadInfo = getDownloadInfo(i);
            if (downloadInfo.getLabel().equals(packageName)) {
                return downloadInfo.getState().value();
            }
        }
        return -1;
    }

    public synchronized void startDownload(Context context,String url, String label, String savePath,
                                           boolean autoResume, boolean autoRename,
                                           DownloadViewHolder viewHolder) throws DbException {

        String fileSavePath = new File(savePath).getAbsolutePath();
        //本地已有apk
        if(savePath.endsWith(".apk")&&queryDownloaded(context, label, savePath)){
//                InstallAppHelper.getInstance().offer(label, savePath);
                InstallAppHelper.getInstance().installApp(label, savePath);
        }else {
            long availableSDSize = StorageBlock.getAvailableSDSize(context);
            LogUtils.e("dxm", "installApp: "+"SD内存空间:"+availableSDSize +" 限制："+WXApplication.INSTALL_SPACE_SIZE);
            if (availableSDSize < WXApplication.INSTALL_SPACE_SIZE) {
                LogUtils.e("dxm", "installApp: "+"SD内存空间不足" );
                Toast.makeText(context,"下载失败: SD卡内存空间不足",Toast.LENGTH_LONG).show();
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

    public synchronized void startDownloadVideo(String url, String savePath) {
        RequestParams params = new RequestParams(url);
        params.setAutoResume(true);
        params.setAutoRename(false);
        params.setSaveFilePath(savePath);
        params.setExecutor(executor);
        params.setCancelFast(true);
        Callback.Cancelable cancelable = x.http().get(params, new Callback.CommonCallback<File>() {
            @Override
            public void onSuccess(File result) {
            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
            }

            @Override
            public void onCancelled(CancelledException cex) {

            }

            @Override
            public void onFinished() {
            }
        });
    }

    public void stopDownload(int index) {
        DownloadInfo downloadInfo = downloadInfoList.get(index);
        stopDownload(downloadInfo);
    }

    public void stopDownload(DownloadInfo downloadInfo) {
        Callback.Cancelable cancelable = callbackMap.get(downloadInfo);
        if (cancelable != null) {
            cancelable.cancel();
        }
    }

    public void stopAllDownload() {
        for (DownloadInfo downloadInfo : downloadInfoList) {
            Callback.Cancelable cancelable = callbackMap.get(downloadInfo);
            if (cancelable != null) {
                cancelable.cancel();
            }
        }
    }

    public void removeDownload(int index) throws DbException {
        DownloadInfo downloadInfo = downloadInfoList.get(index);
        db.delete(downloadInfo);
        stopDownload(downloadInfo);
        downloadInfoList.remove(index);
    }

    public void removeDownload(DownloadInfo downloadInfo) throws DbException {
        db.delete(downloadInfo);
        stopDownload(downloadInfo);
        downloadInfoList.remove(downloadInfo);
    }

    public boolean queryDownloaded(Context context, String label, String savePath) {
        File file = new File(savePath);
        if (file.exists()) {
            PackageManager pm = context.getPackageManager();
            try {
                PackageInfo packageArchiveInfo = pm.getPackageArchiveInfo(savePath, 0);
                if (label.equals(packageArchiveInfo.packageName)) {
                    return true;
                }
            } catch (Exception e) {
                // 信息获取异常
            }

        }
        return false;
    }

    public void addInstall(DownloadInfo downloadInfo){
        installingList.add(downloadInfo);
        LogUtils.d("tzh", "addInstall: " + downloadInfo.getLabel());
    }

    public void deleteInstall(String packageName){
        Iterator<DownloadInfo> iterator = installingList.iterator();
        while (iterator.hasNext()){
            DownloadInfo next = iterator.next();
            if(next.getLabel().equals(packageName)){
                iterator.remove();
                LogUtils.d("tzh", "deleteInstall: packageName  " + packageName);
            }
        }
    }

    public List<DownloadInfo> getInstallingList() {
        return installingList;
    }

    protected DownloadCallback newDownloadCallback(DownloadViewHolder viewHolder){
        return new DownloadCallback(viewHolder);
    }

    public List<String> getDownloadListPackageName(){
        List list = new ArrayList<String>();
        for(DownloadInfo info:downloadInfoList){
            list.add(info.getLabel());
        }
        return list;
    }
}
