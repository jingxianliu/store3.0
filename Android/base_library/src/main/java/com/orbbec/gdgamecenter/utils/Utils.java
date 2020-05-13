package com.orbbec.gdgamecenter.utils;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.StatFs;
import android.support.annotation.RequiresApi;
import android.text.TextUtils;
import android.util.Log;
import com.orbbec.utils.ApkUtils;
import com.orbbec.gdgamecenter.WXApplication;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.security.MessageDigest;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;


/**
 * @author chaijingjing
 * @date 2018/6/5
 */
public class Utils {

    /**
     * 静默安装
     */
    public static String SILENT_INSTALL = "SILENT_INSTALL";

    /**
     * 静默卸載
     */
    public static String SILENT_UNINSTALL = "SILENT_UNINSTALL";

    public static <T> T checkNotNull(T reference) {
        if (reference == null) {
            throw new NullPointerException();
        } else {
            return reference;
        }
    }

    /**
     * 根据手机的分辨率从 dp 的单位 转成为 px(像素)
     */
    public static int dip2px(Context context, float dpValue) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dpValue * scale + 0.5f);
    }

    /**
     * 根据手机的分辨率从 px(像素) 的单位 转成为 dp
     */
    public static int px2dip(Context context, float pxValue) {
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (pxValue / scale + 0.5f);
    }

    /**
     * 判断是不是需要静默安装
     */
    public static boolean isSilentInstall(Context context) {

        return getApplicationMetaData(context, SILENT_INSTALL);
    }

    /**
     * appliction MetaData读取
     */
    private static boolean getApplicationMetaData(Context context, String key) {
        ApplicationInfo info;
        try {
            info = context.getPackageManager().getApplicationInfo(
                    context.getPackageName(), PackageManager.GET_META_DATA);

            String msg = info.metaData.getString(key);
            return TextUtils.equals(msg, "yes");
        } catch (Exception e) {
// TODO Auto-generated catch block
            e.printStackTrace();
        }

        return false;
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    public static boolean hasEnoughMemory(String filePath, long length) {
        return !filePath.startsWith("/sdcard") && !filePath.startsWith("/mnt/sdcard") ? getSystemAvailableSize() > length : getSDAvailableSize() > length;
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private static long getSDAvailableSize() {
        return "mounted".equals(Environment.getExternalStorageState()) ? getAvailableSize(Environment.getExternalStorageDirectory().toString()) : 0L;
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private static long getSystemAvailableSize() {
        return getAvailableSize("/data");
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private static long getAvailableSize(String path) {
        StatFs fileStatFs = new StatFs(path);
        fileStatFs.restat(path);
        long availableSize = fileStatFs.getAvailableBlocksLong() * fileStatFs.getBlockSizeLong();
        long totalSize = fileStatFs.getBlockSizeLong() * fileStatFs.getBlockCountLong();
        return availableSize - (totalSize / 10);
    }

    public static PackageInfo getPackageInfo(Context context, String packageName) {
        PackageInfo packageInfo = null;
        try {
            packageInfo = context.getPackageManager().getPackageInfo(packageName, 0);
        } catch (PackageManager.NameNotFoundException e) {
        }

        return packageInfo;
    }

    public static String getMAC() {
        byte[] mac = null;
        StringBuffer sb = new StringBuffer();
        try {
            Enumeration<NetworkInterface> netInterfaces = NetworkInterface.getNetworkInterfaces();
            while (netInterfaces.hasMoreElements()) {
                NetworkInterface ni = netInterfaces.nextElement();
                Enumeration<InetAddress> address = ni.getInetAddresses();


                if ("eth0".equals(ni.getName())) {
                    mac = ni.getHardwareAddress();
                    break;
                }

                //优先获取有线，没有有线拿无线
                if ("wlan0".equals(ni.getName())) {
                    mac = ni.getHardwareAddress();
                    continue;
                }
                // TODO: 2017/1/19 研究下逻辑
                while (address.hasMoreElements()) {
                    InetAddress ip = address.nextElement();

                    if (ip.isAnyLocalAddress() || !(ip instanceof Inet4Address) || ip.isLoopbackAddress()) {
                        continue;
                    }
                    if (ip.isSiteLocalAddress()) {
                        mac = ni.getHardwareAddress();
                    } else if (!ip.isLinkLocalAddress()) {
                        mac = ni.getHardwareAddress();
                        break;
                    }
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }

        if (mac != null) {
            String str_mac = toHardwareAddress(mac);
            return str_mac;
        } else {
            return "";
        }
    }

    private static String toHardwareAddress(byte[] hardAddr) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < hardAddr.length; i++) {
            builder.append(parseByte(hardAddr[i]));
        }
        String mac = builder.substring(0, builder.length() - 1);
        return mac;
    }

    private static String parseByte(byte b) {
        String s = "0" + Integer.toHexString(b) + ":";
        return s.substring(s.length() - 3);
    }


    public static boolean checkMD5(String locaFilePath, String md5) {
        InputStream fis;
        byte[] buffer = new byte[1024];
        int numRead = 0;
        MessageDigest md;
        try {
            fis = new FileInputStream(locaFilePath);
            md = MessageDigest.getInstance("MD5");
            while ((numRead = fis.read(buffer)) > 0) {
                md.update(buffer, 0, numRead);
            }
            fis.close();
            String hexString = toHexString(md.digest());
            hexString = hexString.toLowerCase();
            LogUtils.d("orbbec", "md5:" + hexString + "/" + TextUtils.equals(hexString, md5.toLowerCase()));
            if (TextUtils.equals(hexString, md5.toLowerCase())) {
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            System.out.println("error");
            return false;
        }
    }

    private static String toHexString(byte[] b) {
        char HEX_DIGITS[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'A', 'B', 'C', 'D', 'E', 'F'};
        StringBuilder sb = new StringBuilder(b.length * 2);
        for (int i = 0; i < b.length; i++) {
            sb.append(HEX_DIGITS[(b[i] & 0xf0) >>> 4]);
            sb.append(HEX_DIGITS[b[i] & 0x0f]);
        }
        return sb.toString();
    }


    public static String getApkStorePath(Context context) {
        File sdcard = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        //String cache = context.getApplicationContext().getCacheDir().getAbsolutePath();
        String cache = context.getApplicationContext().getExternalCacheDir().getAbsolutePath();
        String storePath;
        if (!sdcard.exists()) {
            sdcard.mkdirs();
        }
        if (sdcard.exists()) {
            boolean canWrite = sdcard.canWrite();
            boolean canRead = sdcard.canRead();
            if (canWrite && canRead) {
                storePath = sdcard.getAbsolutePath() + "/orbbec/";
            } else {
                storePath = cache + "/";
            }
        } else {
            storePath = cache + "/";
        }

        return storePath;
    }


    public static void delectVideoOldFile(String path) {
        File fileDir = new File(path);
        if (fileDir.exists()) {
            File[] files = fileDir.listFiles();
            for (int i = 0; i < files.length; i++) {
                files[i].delete();
            }
        }

    }

    /**
     * 将毫秒转换为00:00格式的字符串
     *
     * @param time
     * @return
     */
    public static String formatLongToTimeStr(int time) {
        int minute = 0;
        int second = 0;
        String tmp;
        minute = time / 1000 / 60;
        tmp = String.valueOf(minute).length() == 2 ? minute + "" : "0" + minute + ":";
        second = time / 1000 % 60;
        tmp += String.valueOf(second).length() == 2 ? second + "" : "0" + second;
        return tmp;
    }

    /**
     * 获取当前应用程序的包名
     *
     * @param context 上下文对象
     * @return 返回包名
     */
    public static String getAppProcessName(Context context) {
        //当前应用pid
        int pid = android.os.Process.myPid();
        //任务管理类
        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        //遍历所有应用
        List<ActivityManager.RunningAppProcessInfo> infos = manager.getRunningAppProcesses();
        for (ActivityManager.RunningAppProcessInfo info : infos) {
            if (info.pid == pid)//得到当前应用
                return info.processName;//返回包名
        }
        return "";
    }

    /**
     * 隐藏虚拟按键，并且全屏
     */
    public static void hideBottomUIMenu(Activity context) {
        /*// 隐藏 system ui
        View decorView = context.getWindow().getDecorView();
        int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | SYSTEM_UI_FLAG_IMMERSIVE;
        decorView.setSystemUiVisibility(uiOptions);*/
    }


    public static String getOTTCountFJ(Context context) {
        String username = "";
        try {
            Uri uri = Uri.parse("content://stbconfig/authentication/username");
            Cursor mCursor = context.getContentResolver().query(uri, null, null, null, null);
            if (mCursor != null) {
                while (mCursor.moveToNext()) {
                    String value = mCursor.getString(mCursor.getColumnIndex("value"));
                    if (value != null && value != "") {
                        username = value;
                        break;
                    }
                }
                mCursor.close();
            }
        } catch (Exception e) {
        }
        return username;
    }


    public static boolean getDevInstall(Context context) {
        UsbManager manager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
        HashMap<String, UsbDevice> deviceList = manager.getDeviceList();
        Iterator<UsbDevice> iterator = deviceList.values().iterator();
        while (iterator.hasNext()) {
            UsbDevice device = (UsbDevice) iterator.next();
            int vendorId = device.getVendorId();
            int productId = device.getProductId();
            if (((vendorId != 0x1D27) || ((productId != 0x0600) && (productId != 0x0601))) &&
                    ((vendorId != 0x2BC5) || (productId != 0x0401 && productId != 0x0402 && productId != 0x0403 && productId != 0x0404 && productId != 0x0405 && productId == 0x060F))) {
                iterator.remove();
            }
        }

        if (!deviceList.isEmpty()) {
            return true;
        } else {
            return false;
        }

    }


    public static String getDevInfo(Context context) {
        UsbManager manager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
        HashMap<String, UsbDevice> deviceList = manager.getDeviceList();
        Iterator<UsbDevice> iterator = deviceList.values().iterator();
        String deviceName = null;
        while (iterator.hasNext()) {
            UsbDevice device = (UsbDevice) iterator.next();
            int vendorId = device.getVendorId();
            int productId = device.getProductId();

            if (((vendorId != 0x1D27) || ((productId != 0x0600) && (productId != 0x0601))) &&
                    ((vendorId != 0x2BC5) || (productId != 0x0401 && productId != 0x0402 && productId != 0x0403 && productId != 0x0404 && productId != 0x0405))) {
                iterator.remove();
            } else {
                deviceName = device.getDeviceName();
                break;
            }

        }

        return deviceName;

    }


    /**
     * 跳转天津联通商城
     *
     * @param context
     * @param contentId
     */
    public static void jumpTJLT(Context context, String contentId) {
        try {
            LogUtils.d("jumpTJLT", "contentId:" + contentId);
            Intent intent = new Intent();
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra("showType", 2);
            intent.putExtra("contentId", contentId);
            ComponentName cn = new ComponentName("com.huawei.dsm", "com.huawei.dsm.activity.HomeActivity");
            intent.setComponent(cn);
            context.startActivity(intent);
        } catch (Exception e) {
            LogUtils.e("tzh", "jumpTJLT: 获取应用信息失败！");
        }

    }


    /**
     * 取消游戏图标，只能大厅启动
     *
     * @param context
     * @param packageName
     */
    public static void launcherOrbbec(Context context, String packageName) {
        try {
            Intent launchIntent = new Intent();
            launchIntent.putExtra(LAUNCHER_PACKAGE_NAME, "com.orbbec.gdgamecenter");
            launchIntent.setAction(packageName);
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(launchIntent);
        } catch (Exception e) {
            //OBToast(context, "启动失败");
            ApkUtils.runPackage(context, packageName);
        }

    }

    private static final String LAUNCHER_PACKAGE_NAME = "launcher_package_name";


    public static HashMap<String, UsbDevice> getDevList(Context context) {
        UsbManager manager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
        HashMap<String, UsbDevice> deviceList = manager.getDeviceList();
        Iterator<UsbDevice> iterator = deviceList.values().iterator();
        while (iterator.hasNext()) {
            UsbDevice device = iterator.next();
            int vendorId = device.getVendorId();
            int productId = device.getProductId();

            if ((vendorId == 0x1D27 && (productId == 0x05FC || productId != 0x0601)) ||
                    (vendorId == 0x2BC5 && ((productId >= 0x0401 && productId <= 0x04FF) || productId == 0x060F))
                    ) {
                continue;
            } else {
                iterator.remove();
            }
        }

        return deviceList;
    }
    /**
     * 获取AndroidManifest中的meda_data中的值
     * @param name name
     * @return value
     */
    public static String getMedaData(String name , Context mContext){
        if(mContext == null){
            mContext = WXApplication.getContext();
        }
        String value = "";
        ApplicationInfo info = null;
        try {
            info = mContext.getPackageManager()
                    .getApplicationInfo(WXApplication.getContext().getPackageName() , PackageManager.GET_META_DATA);
            value = info.metaData.getString(name);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return value;
    }

    public static int getMedaDataInt(String name , Context mContext){
        if(mContext == null){
            mContext = WXApplication.getContext();
        }
        int value = -1;
        ApplicationInfo info = null;
        try {
            info = mContext.getPackageManager()
                    .getApplicationInfo(WXApplication.getContext().getPackageName() , PackageManager.GET_META_DATA);
            value = info.metaData.getInt(name);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return value;
    }
}
