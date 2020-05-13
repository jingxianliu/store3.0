package com.orbbec.gdgamecenter.utils;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.support.annotation.RequiresApi;
import android.text.TextUtils;

import android.widget.Toast;
import com.orbbec.utils.PackageUtils;
import com.orbbec.utils.ShellUtils;
import com.orbbec.utils.XLog;
import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.network.download.DownloadInfo;
import com.orbbec.gdgamecenter.presenter.WeexPresenter;

import net.dlb.aidl.InstallService;


import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Queue;


/**
 * @author jjchai
 * @date 2016/5/6
 */
public class InstallAppHelper {

    private static final String TAG = "InstallAppHelper";

    public static final int STARTED = 0;
    public static final int SUCCESS = 1;
    public static final int FAILED = 2;

    protected static InstallAppHelper sInstance;
    protected final ServiceConnection mInstallConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            mInstallService = InstallService.Stub.asInterface(iBinder);
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {

        }
    };
    protected Context mContext;

    public volatile boolean isCouldInstall = false;

    private Queue<String> mWaitInstallQueue;
    protected volatile HashMap<String, InstallAppBean> mWaitInstallMap;
    protected volatile HashMap<String, InstallAppBean> mInstallingMap;
    private HashMap<String, Boolean> mAppTypeMap;

    private PackageBroadcast mPackageBroadcast;
    protected InstallService mInstallService;
    private WeexPresenter mPresenter;

    public static void initInstallAppHelper(Context context) {
        if (sInstance == null) {
            synchronized (InstallAppHelper.class) {
                if (sInstance == null) {
                    sInstance = new InstallAppHelper(context);
                }
            }
        }
    }

    public void setmPresenter(WeexPresenter mPresenter) {
        this.mPresenter = mPresenter;
    }

    public static InstallAppHelper getInstance() {
        if (sInstance == null) {
            throw new NullPointerException(InstallAppHelper.class.getName() + "did not initialization!");
        }
        return sInstance;
    }

    public InstallAppHelper(Context context) {
        mContext = context.getApplicationContext();
        mWaitInstallQueue = new LinkedList<>();
        mWaitInstallMap = new HashMap<>();
        mInstallingMap = new HashMap<>();
        mAppTypeMap = new HashMap<>();

        mPackageBroadcast = new PackageBroadcast();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_PACKAGE_ADDED);
        intentFilter.addAction(Intent.ACTION_PACKAGE_REPLACED);
        intentFilter.addAction(Intent.ACTION_PACKAGE_REMOVED);
        intentFilter.addDataScheme("package");
        context.registerReceiver(mPackageBroadcast, intentFilter);
    }


    public synchronized boolean offer(String packageName, String filePath) {
        LogUtils.d(TAG, "offer() called with: packageName = [" + packageName + "], filePath = [" + filePath + "]");
//        if (mInstallingMap.containsKey(packageName)) {
//            return false;
//        }
        if (mWaitInstallQueue.contains(packageName)) {
            return false;
        }
        boolean offerSuccess = mWaitInstallQueue.offer(packageName);
        if (offerSuccess) {
            mWaitInstallMap.put(packageName, new InstallAppBean(packageName, filePath, queryAppType(packageName)));
        }
        return offerSuccess;
    }

    public synchronized InstallAppBean poll() {
        String element = mWaitInstallQueue.poll();
        InstallAppBean installAppBean = mWaitInstallMap.get(element);
        return installAppBean;
    }

    public synchronized String peek() {
        String element = mWaitInstallQueue.peek();
        return element;
    }

    public synchronized InstallAppBean getElementValue(String packageName) {
        InstallAppBean bean = mWaitInstallMap.get(packageName);
        if (bean == null) {
            bean = mInstallingMap.get(packageName);
        }
        return bean;
    }

    public synchronized boolean isInstallApp(String packageName) {
        InstallAppBean installAppBean = mInstallingMap.get(packageName);
        if (installAppBean == null) {
            return false;
        }
        return true;
    }

    public synchronized boolean remove(String packageName) {
        boolean success = mWaitInstallQueue.remove(packageName);
        if (success) {
            mWaitInstallMap.remove(packageName);
        }
        return success;
    }

    public synchronized void installApp(String packageName, String filePath) {
        offer(packageName, filePath);
        installApp(null);
    }

    public synchronized void installApp(final DownloadInfo downloadInfo) {
        try {
            wait(1000);
        }catch (InterruptedException e){
            e.printStackTrace();
        }
        final InstallAppBean bean = poll();
        if (bean == null) {
            LogUtils.i(TAG, "install app bean == null");
            return;
        }
        if (TextUtils.isEmpty(bean.packageName)) {
            LogUtils.i(TAG, "install app packageName == null");
            return;
        }
        if (TextUtils.isEmpty(bean.path)) {
            LogUtils.i(TAG, "install app path == null");
            return;
        }
        long availableInternalMemorySize = StorageBlock.getAvailableInternalMemorySize(mContext);
        long availableSDSize = StorageBlock.getAvailableSDSize(mContext);
        LogUtils.d(TAG, "install canSize:" + availableInternalMemorySize);
        if (availableInternalMemorySize > WXApplication.INSTALL_SPACE_SIZE) {
            new Thread(new Runnable() {
                @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
                @Override
                public void run() {
                    startInstallPackage(downloadInfo , bean);
                }
            }).start();
        } else {
            LogUtils.e(TAG, "installApp: "+"内存空间不足" );
            Toast.makeText(mContext,"安装失败: 内存空间不足",Toast.LENGTH_LONG).show();
        }
    }


    public int uninstallPackage(String packageName) {
        return -1;
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private int installPackage(final InstallAppBean bean) {
        String path = bean.path;
        mWaitInstallMap.remove(bean.packageName);
        File file = new File(path);
        if (!file.exists()) {
            return -1;
        }
        bean.result = STARTED;
        postInstallEvent(bean);
        String packageName = bean.packageName;

        int result;
        long length = file.length();

        boolean canReadable = file.canRead() || file.setReadable(true, false);
        LogUtils.d(TAG, "installPackage : " + packageName + " ; canReadable = " + canReadable);
        if (canReadable) {
            if (Utils.isSilentInstall(mContext)) {
                mInstallingMap.put(packageName, bean);
                if (Utils.hasEnoughMemory("/data", length)) {
                    result = execInstall(mContext, path, "-r -d -f");
                } else {
                    PackageInfo packageInfo = Utils.getPackageInfo(mContext, packageName);
                    if (packageInfo != null) {
                        if ((packageInfo.applicationInfo.flags & ApplicationInfo.FLAG_SYSTEM) > 0) {
                            result = FAILED;
                            // 处理静默安装结果
                            bean.result = result;
                            postInstallEvent(bean);
                            return result;
                        }
                    }
                    if (Utils.hasEnoughMemory("/sdcard", length)) {
                        result = execInstall(mContext, path, "-s -d -r");

                    } else {
                        LogUtils.e(TAG, "has not enough memory");
                        result = -1;
                    }
                }
                mInstallingMap.remove(packageName);
                LogUtils.d(TAG, "install code:" + result);
                if (result != SUCCESS) {
                    result = FAILED;
                }
                // 处理静默安装结果
                bean.result = result;
                postInstallEvent(bean);
            } else {
                WXApplication.isInstallActivity = true;
                result = installNomal(mContext, path) ? SUCCESS : FAILED;

               // sPresenter.intstalled(packageName ,result);
                // 请求安装失败，无法等待安装成功处理cursor，本次请求结束
                if (result == FAILED) {
                    bean.result = result;
                    postInstallEvent(bean);
                } else {
                    // 非静默安装请求成功，可能会安装成功，需要在安装广播中处理
                    mInstallingMap.put(packageName, bean);
                }
            }
        } else {
            result = FAILED;
            bean.result = result;
            postInstallEvent(bean);
        }
        return result;
    }

    private boolean installNomal(Context context, String filePath) {
        File file = new File(filePath);
        if (file != null && file.exists() && file.isFile() && file.length() > 0L) {
            try {
                if (!PackageUtils.installNormal(context, filePath)) {
                    Intent intentTmp = new Intent();
                    intentTmp.setClassName("com.android.packageinstaller", "com.android.packageinstaller.PackageInstallerActivity");
                    intentTmp.setDataAndType(Uri.parse("file://" + filePath), "application/vnd.android.package-archive");
                    intentTmp.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intentTmp);
                }
                return true;
            } catch (Exception e) {
                try {
                    Intent i = new Intent("android.intent.action.VIEW");
                    i.setDataAndType(Uri.parse("file://" + filePath), "application/vnd.android.package-archive");
                    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(i);
                    return true;
                } catch (Exception ex) {
                    return false;
                }


            }


        } else {
            Toast.makeText(context, "install file not find", Toast.LENGTH_SHORT).show();
            return false;
        }
    }

    public void postInstallEvent(InstallAppBean bean) {
        if (bean.result == SUCCESS) {
            // 执行安装，删除文件
            new File(bean.path).delete();
            mInstallingMap.remove(bean.packageName);
        }
        //不管安装成功与否都删除本地apk包，防止签名流程问题
        if (bean.result == FAILED) {
            // 执行安装，删除文件
            new File(bean.path).delete();
            mInstallingMap.remove(bean.packageName);
        }
    }

    public boolean contains(String packageName) {
        /*|| mInstallingMap.containsKey(packageName)*/
        return mWaitInstallMap.containsKey(packageName);
    }

    public void recordAppType(String packageName, boolean appType) {
        mAppTypeMap.put(packageName, appType);
    }

    public boolean queryAppType(String packageName) {
        Boolean type = mAppTypeMap.get(packageName);
        return (type == null ? false : type);
    }

    public void destroy() {
        try {
            mContext.unregisterReceiver(mPackageBroadcast);
        } catch (Exception e) {
        }
        mWaitInstallQueue.clear();
        mWaitInstallMap.clear();
        sInstance = null;
    }

    private int execInstall(Context context, String path, String args) {
        int result;
        LogUtils.v(TAG, "install running");
        Runtime localRT;
        localRT = Runtime.getRuntime();
        try {
            Process lp = localRT.exec("chmod -R 777 " + context.getApplicationContext().getFilesDir());

            if (path != null && path.length() != 0) {
                File file = new File(path);
                if (file != null && file.length() > 0L && file.exists() && file.isFile()) {
                    StringBuilder command = (new StringBuilder()).append("LD_LIBRARY_PATH=/vendor/lib:/system/lib pm install ").append(args == null ? "" : args).append(" ").append(path.replace(" ", "\\ "));
                    ShellUtils.CommandResult commandResult = ShellUtils.execCommand(command.toString(), false, true);
                    if (commandResult.successMsg == null || !commandResult.successMsg.contains("Success") && !commandResult.successMsg.contains("success")) {
                        LogUtils.e("PackageUtils", "installSilent successMsg:" + commandResult.successMsg + ", ErrorMsg:" + commandResult.errorMsg);
                        return commandResult.errorMsg == null ? -1000000 : (commandResult.errorMsg.contains("INSTALL_FAILED_ALREADY_EXISTS") ? -1 : (commandResult.errorMsg.contains("INSTALL_FAILED_INVALID_APK") ? -2 : (commandResult.errorMsg.contains("INSTALL_FAILED_INVALID_URI") ? -3 : (commandResult.errorMsg.contains("INSTALL_FAILED_INSUFFICIENT_STORAGE") ? -4 : (commandResult.errorMsg.contains("INSTALL_FAILED_DUPLICATE_PACKAGE") ? -5 : (commandResult.errorMsg.contains("INSTALL_FAILED_NO_SHARED_USER") ? -6 : (commandResult.errorMsg.contains("INSTALL_FAILED_UPDATE_INCOMPATIBLE") ? -7 : (commandResult.errorMsg.contains("INSTALL_FAILED_SHARED_USER_INCOMPATIBLE") ? -8 : (commandResult.errorMsg.contains("INSTALL_FAILED_MISSING_SHARED_LIBRARY") ? -9 : (commandResult.errorMsg.contains("INSTALL_FAILED_REPLACE_COULDNT_DELETE") ? -10 : (commandResult.errorMsg.contains("INSTALL_FAILED_DEXOPT") ? -11 : (commandResult.errorMsg.contains("INSTALL_FAILED_OLDER_SDK") ? -12 : (commandResult.errorMsg.contains("INSTALL_FAILED_CONFLICTING_PROVIDER") ? -13 : (commandResult.errorMsg.contains("INSTALL_FAILED_NEWER_SDK") ? -14 : (commandResult.errorMsg.contains("INSTALL_FAILED_TEST_ONLY") ? -15 : (commandResult.errorMsg.contains("INSTALL_FAILED_CPU_ABI_INCOMPATIBLE") ? -16 : (commandResult.errorMsg.contains("INSTALL_FAILED_MISSING_FEATURE") ? -17 : (commandResult.errorMsg.contains("INSTALL_FAILED_CONTAINER_ERROR") ? -18 : (commandResult.errorMsg.contains("INSTALL_FAILED_INVALID_INSTALL_LOCATION") ? -19 : (commandResult.errorMsg.contains("INSTALL_FAILED_MEDIA_UNAVAILABLE") ? -20 : (commandResult.errorMsg.contains("INSTALL_FAILED_VERIFICATION_TIMEOUT") ? -21 : (commandResult.errorMsg.contains("INSTALL_FAILED_VERIFICATION_FAILURE") ? -22 : (commandResult.errorMsg.contains("INSTALL_FAILED_PACKAGE_CHANGED") ? -23 : (commandResult.errorMsg.contains("INSTALL_FAILED_UID_CHANGED") ? -24 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_NOT_APK") ? -100 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_BAD_MANIFEST") ? -101 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_UNEXPECTED_EXCEPTION") ? -102 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_NO_CERTIFICATES") ? -103 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_INCONSISTENT_CERTIFICATES") ? -104 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_CERTIFICATE_ENCODING") ? -105 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_BAD_PACKAGE_NAME") ? -106 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_BAD_SHARED_USER_ID") ? -107 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_MANIFEST_MALFORMED") ? -108 : (commandResult.errorMsg.contains("INSTALL_PARSE_FAILED_MANIFEST_EMPTY") ? -109 : (commandResult.errorMsg.contains("INSTALL_FAILED_INTERNAL_ERROR") ? -110 : -1000000)))))))))))))))))))))))))))))))))));
                    } else {
                        result = 1;
                    }
                } else {
                    result = -3;
                }
            } else {
                result = -3;
            }
            //result = PackageUtils.installSilent(mContext, path, args);
        } catch (IOException e) {
            LogUtils.v(TAG, "chmod 777 failed ");
            result = -1;
        }
        LogUtils.v(TAG, "execInstall result = " + result);
        return result;
    }

    public static class InstallAppBean {

        final public String packageName;
        final public String path;
        final public boolean appType;
        public int result;

        public InstallAppBean(String packageName, String path, boolean appType) {
            this.packageName = packageName;
            this.path = path;
            this.appType = appType;
        }
    }

    private static class PackageBroadcast extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            if (intent.getData() == null) {
                return;
            }

            String packageName = intent.getData().getSchemeSpecificPart();
            XLog.d(TAG, "action = " + action + " ; packageName = " + packageName);
            if (action.equals(Intent.ACTION_PACKAGE_ADDED)) {
                InstallAppBean elementValue = InstallAppHelper.getInstance().getElementValue(packageName);
                if (elementValue != null) {
                    elementValue.result = InstallAppHelper.SUCCESS;
                    InstallAppHelper.getInstance().postInstallEvent(elementValue);
                    return;
                }
//                for (int i = 0; i < SoftManagerActivity.installingApp.size(); i++) {
//                    if(SoftManagerActivity.installingApp.get(i).getLabel().equals(packageName)){
//                        DownloadInfo remove = SoftManagerActivity.installingApp.remove(i);
//                        try {
//                            OrbbecApplication.db.delete(remove);
//                        } catch (DbException e) {
//                            e.printStackTrace();
//                        }
//                        break;
//                    }
//                }
//                Message message = new Message();
//                message.what = Config.INSTALLED_APP;
//                message.obj = elementValue;
//                EventBus.getDefault().post(message);
            } else if (action.equals(Intent.ACTION_PACKAGE_REPLACED)) {
            } else if (action.equals(Intent.ACTION_PACKAGE_REMOVED)) {
            } else {
                // nothing to do
            }
        }
    }

    protected void startInstallPackage(DownloadInfo info , InstallAppBean bean){
        int result = installPackage(bean);
        LogUtils.d(TAG, "installPackage result = " + result);
    }
}
