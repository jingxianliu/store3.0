package com.orbbec.gdgamecenter.utils;

import android.content.Context;
import android.os.Environment;
import android.os.StatFs;
import android.os.storage.StorageManager;
import android.text.TextUtils;

import java.io.File;
import java.io.FileInputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.text.DecimalFormat;

/**
 * @author yh
 */
public class StorageBlock {

    private final String TAG = "StorageBlock";

    /**
     * 得到外部储存sdcard的状态
     */
    private String sdcard = Environment.getExternalStorageState();

    private String mPath;
    /**
     * 外部储存sdcard存在的情况
     */
    private String state = Environment.MEDIA_MOUNTED;

    private File file = Environment.getExternalStorageDirectory();

    public void setPath(String path) {
        this.mPath = path;
    }

    /**
     * SDCard 总容量大小
     *
     * @return MB
     */
    public long getTotalSize() {

        if (sdcard.equals(state)) {
            //获得sdcard上 block的总数
            StatFs statFs = new StatFs(file.getPath());
            long blockCount = statFs.getBlockCount();
            //获得sdcard上每个block 的大小
            long blockSize = statFs.getBlockSize();
            //计算标准大小使用：1024，当然使用1000也可以
            long bookTotalSize = blockCount * blockSize / 1000 / 1000;
            return bookTotalSize;

        } else {
            LogUtils.e(TAG, "sdcard is not mount");
            return -1;
        }

    }


    /**
     * 计算Sdcard的剩余大小
     *
     * @return MB
     */
    public long getAvailableSize() {
        if (sdcard.equals(state)) {
            //获得Sdcard上每个block的size
            StatFs statFs = new StatFs(file.getPath());
            long blockSize = statFs.getBlockSize();
            //获取可供程序使用的Block数量
            long blockavailable = statFs.getAvailableBlocks();
            //计算标准大小使用：1024，当然使用1000也可以
            long blockavailableTotal = blockSize * blockavailable / 1024 / 1024;
            return blockavailableTotal;
        } else {
            LogUtils.e(TAG, "sdcard is not mount");
            return -1;
        }
    }

    /**
     * sd卡剩余了空间
     *
     * @return 大小，M为单位
     */
    static public long getAvailableSDSize() {
        File path = Environment.getExternalStorageDirectory();
        StatFs stat = new StatFs(path.getPath());
        long blockSize = stat.getBlockSize();
        //获取可用区块数量
        long availableBlocks = stat.getAvailableBlocks();
        long totalSDSizeUser = availableBlocks * blockSize / 1024 / 1024;
        return totalSDSizeUser;
    }


    public long getPathAvailableSize() {
        if (!TextUtils.isEmpty(mPath)) {
            StatFs statFs = new StatFs(mPath);
            long blockSize = statFs.getBlockSize();
            //获取可供程序使用的Block数量
            long blockavailable = statFs.getAvailableBlocks();
            //计算标准大小使用：1024，当然使用1000也可以
            long blockavailableTotal = blockSize * blockavailable / 1024 / 1024;
            return blockavailableTotal;
        } else {
            LogUtils.e(TAG, "path is error");
            return -1;
        }
    }

    /**
     * 删除目录下所有文件
     */
    public void deleteAllFiles(File root) {
        File[] files = root.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory()) {
                    // 判断是否为文件夹
                    deleteAllFiles(f);
                    try {
                        f.delete();
                    } catch (Exception e) {
                    }
                } else {
                    if (f.exists()) {
                        // 判断是否存在
                        deleteAllFiles(f);
                        try {
                            f.delete();
                        } catch (Exception e) {
                        }
                    }
                }
            }
        }
    }

    /**
     * 删除文件
     */
    public void deleteFile(File f) {
        if (f.exists()) {
            // 判断是否存在
            try {
                f.delete();
            } catch (Exception e) {
            }
        }
    }


    /**
     * 获取手机内部空间总大小
     *
     * @return 大小，字节为单位
     */
    static public long getTotalInternalMemorySize() {
        //获取内部存储根目录
        File path = Environment.getDataDirectory();
        //系统的空间描述类
        StatFs stat = new StatFs(path.getPath());
        //每个区块占字节数
        long blockSize = stat.getBlockSize();
        //区块总数
        long totalBlocks = stat.getBlockCount();
        long totalSize = totalBlocks * blockSize / 1024 / 1024;
        return totalSize;
    }

    /**
     * 获取手机内部可用空间大小(data)
     *
     * @return 大小，字节为单位
     */
    static public long getAvailableInternalMemorySize(Context contenxt) {
        File dataFile = Environment.getDataDirectory();
        LogUtils.d("tzh", "getAvailableInternalMemorySize: " + dataFile.getAbsolutePath());
        long useStorage = getUseStorage(contenxt, dataFile);
        long freeStorage = dataFile.getUsableSpace() - useStorage;
        return freeStorage / 1024 / 1024;
        /* File sdFile = Environment.getDataDirectory();
        StatFs stat = new StatFs(sdFile.getPath());
        long blockSize = stat.getFreeBytes();
        //获取可用区块数量
        return blockSize / 1024 / 1024;*/
    }


    /**
     * sd卡剩余了空间
     *
     * @return 大小，M为单位
     */
    static public long getAvailableSDSize(Context contenxt) {
        File sdFile = Environment.getExternalStorageDirectory();
        LogUtils.d("tzh", "getAvailableSDSize: " + sdFile.getAbsolutePath());
        long useStorage = getUseStorage(contenxt, sdFile);
        long freeStorage = sdFile.getUsableSpace() - useStorage;
        return freeStorage / 1024 / 1024;
        /*File sdFile = Environment.getExternalStorageDirectory();
        StatFs stat = new StatFs(sdFile.getPath());
        long blockSize = stat.getFreeBytes();
        //获取可用区块数量
        return blockSize / 1024 / 1024;*/


    }

    static long getUseStorage(Context context, File file) {
        try {
            StorageManager mStorageManager = (StorageManager) context.getSystemService(Context.STORAGE_SERVICE);
            Class storageVolumeClazz = Class.forName("android.os.storage.StorageManager");

            Method getVolumeList = storageVolumeClazz.getMethod("getStorageFullBytes", File.class);
            long result = (long) getVolumeList.invoke(mStorageManager, file);

            return result;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }

        return 0;
    }



    /**
     * 调用此方法自动计算指定文件或指定文件夹的大小
     *
     * @param filePath 文件路径
     * @return 计算好的带B、KB、MB、GB的字符串
     */
    public static long getAutoFileOrFilesSize(String filePath) {
        File file = new File(filePath);
        long blockSize = 0;
        try {
            blockSize = getFileSize(file);

        } catch (Exception e) {
            e.printStackTrace();
            LogUtils.e("获取文件大小", "获取失败!");
        }
        return blockSize;
    }

    /**
     * 获取指定文件大小
     *
     * @param file
     * @return
     * @throws Exception
     */
    private static long getFileSize(File file) throws Exception {
        long size = 0;
        if (file.exists()) {
            FileInputStream fis = null;
            fis = new FileInputStream(file);
            size = fis.available();
        } else {
            LogUtils.d("GDGame", "文件不存在");

        }
        return size;
    }


    /**
     *  * 转换文件大小
     *  * @param fileS
     *  * @return
     *  
     */
    private static String FormetFileSize(long fileS) {
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        String wrongSize = "0";
        if (fileS == 0) {
            return wrongSize;
        }
        fileSizeString = df.format((double) fileS / 1048576);
        return fileSizeString;
    }


}
