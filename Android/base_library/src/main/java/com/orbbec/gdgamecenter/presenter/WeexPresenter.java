package com.orbbec.gdgamecenter.presenter;

import android.content.Context;
import android.content.Intent;
import android.content.pm.IPackageStatsObserver;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageStats;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.hardware.usb.UsbDevice;
import android.net.Uri;
import android.os.RemoteException;
import android.text.format.Formatter;
import android.util.Base64;
import android.util.Log;

import com.orbbec.gdgamecenter.utils.CountlyHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.utils.ApkUtils;
import com.orbbec.utils.NetUtils;
import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.network.download.DefaultDownloadViewHolder;
import com.orbbec.gdgamecenter.network.download.DownloadInfo;
import com.orbbec.gdgamecenter.network.download.DownloadManager;
import com.orbbec.gdgamecenter.listener.AppInfoLister;
import com.orbbec.gdgamecenter.utils.ActivityHelper;
import com.orbbec.gdgamecenter.utils.InstallAppHelper;
import com.orbbec.gdgamecenter.utils.Utils;
import com.taobao.weex.WXSDKInstance;

import org.json.JSONObject;
import org.xutils.ex.DbException;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author tanzhuohui
 * @date 2018/10/29
 */
public class WeexPresenter implements WeexInterface {
    private WXSDKInstance mInstance;
    protected Context mContext;
    private int mAppAmount = 0;


    public WeexPresenter(Context context, WXSDKInstance instance) {
            this.mContext = context;
            this.mInstance = instance;
        InstallAppHelper.getInstance().setmPresenter(this);
    }

    @Override
    public void loading(String packageName , int progress) {
        Map<String, Object> params = new HashMap<>();
        params.put("progress",packageName+":"+progress);
        params.put("list",DownloadManager.getInstance().getDownloadListPackageName());
       // Log.e("dxm", "loading: "+DownloadManager.getInstance().getDownloadListPackageName().toString());
        mInstance.fireGlobalEventCallback("loading", params);

    }

    @Override
    public void onUninstallSuccess(boolean action){
        Map<String, Object> params = new HashMap<>();
        params.put("packageAction",action);
        LogUtils.e("dxm", "onUninstallSuccess: "+mInstance+params);
        mInstance.fireGlobalEventCallback("uninstall", params);
    }

    @Override
    public void keyDown(int keyCode) {
        Map<String, Object> params = new HashMap<>();
        params.put("keyDown", keyCode);
        mInstance.fireGlobalEventCallback("keyDown", params);
    }

    @Override
    public void intstalled(String packageInfo, int result) {
        Map<String, Object> params = new HashMap<>();
        params.put("packageInfo", packageInfo);
        LogUtils.e("dxm", "intstalled: ");
        mInstance.fireGlobalEventCallback("finishedInstall", params);
    }

    @Override
    public void startDownload(String packageName, String url) {
      //  CountlyHelper.sendCountlyDownloadEvent("sometest",packageName);
        String saveFile = url.substring(url.lastIndexOf("/") + 1);
        String savePath = Utils.getApkStorePath(WXApplication.getContext()) + saveFile + ".apk";
        DownloadInfo downloadInfo = new DownloadInfo();
        downloadInfo.setLabel(packageName);
        downloadInfo.setFileSavePath(savePath);
        downloadInfo.setUrl(url);
        downloadInfo.setAutoRename(false);
        downloadInfo.setAutoResume(true);
        try {
            DownloadManager.getInstance().startDownload(mContext , url, packageName, savePath, true, false,
                    new DefaultDownloadViewHolder(this, null, downloadInfo));
        } catch (DbException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void uninstall(String packageName) {
        LogUtils.d("tzh", "uninstall: " + packageName);
        Intent intent = new Intent("android.intent.action.DELETE", Uri.parse("package:" + packageName));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        WXApplication.getContext().startActivity(intent);
        WXApplication.isUninstall = true;
    }

    @Override
    public void startApp(String packageName) {
        ApkUtils.runPackage(WXApplication.getContext(), packageName);
    }

    @Override
    public void finish() {
        WXApplication.isExit = true;
        ActivityHelper.getInstance().exit();
    }

    @Override
    public boolean getgetAppInstalled(String packageName) {
        PackageManager pm = mContext.getPackageManager();
        Intent launchPackage = null;
        launchPackage = pm.getLaunchIntentForPackage(packageName);
        LogUtils.d("tzh", "getgetAppInstalled: " + (launchPackage != null));
        return launchPackage != null;
    }

    @Override
    public void getLocalOrbbecApp(AppInfoLister appInfoLister) {
        PackageManager pm = mContext.getPackageManager();
        List<PackageInfo> packageInfoList = pm.getInstalledPackages(0);
        Map infoMap = new HashMap<>();
        List<Map> infoList = new ArrayList<>();
        List<PackageInfo> packageInfos = new ArrayList<>();
        for (int i = 0; i < packageInfoList.size(); i++) {
            PackageInfo packageInfo = packageInfoList.get(i);
            if (packageInfo.packageName.toLowerCase().contains("orbbec")) {
                packageInfos.add(packageInfo);
            } else {
                continue;
            }
        }

        mAppAmount = packageInfos.size();

        for (int i = 0; i < packageInfos.size(); i++) {
            PackageInfo packageInfo = packageInfos.get(i);
            Map info = new HashMap<>();
            info.put("packageName", packageInfo.packageName);
            info.put("versionCode", packageInfo.versionCode);
            info.put("versionName", packageInfo.versionName);
            info.put("ApplicationName", pm.getApplicationLabel(packageInfo.applicationInfo).toString());
            Bitmap icon = ((BitmapDrawable)packageInfo.applicationInfo.loadIcon(pm)).getBitmap();
            info.put("ApplicationIcon", convertIconToString(icon));
            AppInfo tmpInfo = new AppInfo();
            tmpInfo.packageName = packageInfo.packageName;
            try {
                queryPacakgeSize(info, infoList, infoMap, tmpInfo, appInfoLister);

            } catch (Exception e) {
                tmpInfo.appSize = "invalid";
                e.printStackTrace();
            }
        }
    }

    @Override
    public void getLocalAppInfo(String name, AppInfoLister appInfoLister){
        PackageManager pm = mContext.getPackageManager();
        List<PackageInfo> packageInfoList = pm.getInstalledPackages(0);
        Map infoMap = new HashMap<>();
        List<Map> infoList = new ArrayList<>();
        List<PackageInfo> packageInfos = new ArrayList<>();
        for (int i = 0; i < packageInfoList.size(); i++) {
            PackageInfo packageInfo = packageInfoList.get(i);
            if (packageInfo.packageName.equals(name)) {
                packageInfos.add(packageInfo);
                break;
            } else {
                continue;
            }
        }
        mAppAmount = packageInfos.size();
        for (int i = 0; i < packageInfos.size(); i++) {
            PackageInfo packageInfo = packageInfos.get(i);
            Map info = new HashMap<>();
            info.put("packageName", packageInfo.packageName);
            info.put("versionCode", packageInfo.versionCode);
            info.put("versionName", packageInfo.versionName);
            info.put("ApplicationName", pm.getApplicationLabel(packageInfo.applicationInfo).toString());
            Bitmap icon = ((BitmapDrawable)packageInfo.applicationInfo.loadIcon(pm)).getBitmap();
            info.put("ApplicationIcon", convertIconToString(icon));
            AppInfo tmpInfo = new AppInfo();
            tmpInfo.packageName = packageInfo.packageName;
            try {
                queryPacakgeSize(info, infoList, infoMap, tmpInfo, appInfoLister);
            } catch (Exception e) {
                tmpInfo.appSize = "invalid";
                e.printStackTrace();
            }
        }
    }

    /**
     * 图片转成string
     *
     * @param bitmap
     * @return
     */
    private static String convertIconToString(Bitmap bitmap)
    {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();// outputstream
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);
        byte[] appicon = baos.toByteArray();// 转为byte数组
        return "data:image/png;base64,"+Base64.encodeToString(appicon, Base64.DEFAULT);

    }
    @Override
    public int getInstalledAppVersion(String name) {
        PackageManager pm = mContext.getPackageManager();
        try {
            PackageInfo info = pm.getPackageInfo(name, 0);
            return info.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            return 0;
        }

    }

    /**
     * 获取应用的大小
     *
     * @param
     * @return
     */

    public class AppInfo {
        public String appSize;
        public String packageName;
    }


    /**
     * 获取应用的大小
     *
     * @param appInfo
     * @return
     */
    private void queryPacakgeSize(final Map info, final List infoList, final Map infoMap, final AppInfo appInfo, final AppInfoLister lister) throws Exception {

        if (appInfo.packageName != null) {
            // getPackageSizeInfo是PackageManager中的一个private方法，所以需要通过反射的机制来调用
            Method method = PackageManager.class.getMethod("getPackageSizeInfo",
                    String.class, IPackageStatsObserver.class);
            // 调用 getPackageSizeInfo 方法，需要两个参数：1、需要检测的应用包名；2、回调
            method.invoke(mContext.getPackageManager(), appInfo.packageName,
                    new IPackageStatsObserver.Stub() {
                        @Override
                        public void onGetStatsCompleted(PackageStats pStats, boolean succeeded) throws RemoteException {
                            // 从pStats中提取各个所需数据
                            String size = Formatter.formatFileSize(mContext, pStats.cacheSize + pStats.dataSize + pStats.codeSize);
                     //       Log.d("person_center_btn_bg", "size:" + size + appInfo.packageName);
                            appInfo.appSize = size;
                      //      Log.e("person_center_btn_bg", "size:" + appInfo.appSize);
                            info.put("packageSize", size);
                            infoList.add(info);
                            infoMap.put("packages", infoList);
                            if (infoList.size() == mAppAmount) {
                                JSONObject jsonObject = new JSONObject(infoMap);
                                String s = jsonObject.toString();
                                lister.getAppInfo(s);
                            }
                        }
                    });
        }


    }

    /**
     * 获取联网状态
     */
    @Override
    public boolean getConnection(){
        return NetUtils.networkCanUse(mContext);
    }

    /**
     * 发送下载包名列表
     */
    @Override
    public void getDownloadList(){
        Map<String, Object> params = new HashMap<>();
        params.put("downloadList", DownloadManager.getInstance().getDownloadListPackageName());
        LogUtils.e("dxm", "downloadlist: "+params);
        mInstance.fireGlobalEventCallback("download", params);
    }

    /**
     * 查找摄像头
     */
    @Override
    public boolean useCamera(){
        HashMap<String, UsbDevice> devList = Utils.getDevList(mContext);
        return !devList.isEmpty();
    }

    @Override
    public void silentDownload(String packageName, String url) {
    }

    @Override
    public void silentUninstall(String packageName) {

    }

    public Context getContext() {
        return mContext;
    }
}

