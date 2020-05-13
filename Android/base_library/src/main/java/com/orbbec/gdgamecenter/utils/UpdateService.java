package com.orbbec.gdgamecenter.utils;

import android.content.Context;
import android.util.Log;

import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.network.download.DefaultDownloadViewHolder;
import com.orbbec.gdgamecenter.network.download.DownloadInfo;
import com.orbbec.gdgamecenter.network.download.DownloadManager;

import org.xutils.ex.DbException;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Enumeration;
import java.util.zip.ZipException;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;

/**
 * @author Altair
 * @date 2018/11/27
 */



public class UpdateService {

    private static final int FULL_UPDATE = 0;

    public static void startDownload(Context context, String packageName, String url, int state) {
        String saveFile = url.substring(url.lastIndexOf("/") + 1);
        String savePath ;
        if(state == FULL_UPDATE){
            LogUtils.d("dxm","here");
            savePath = Utils.getApkStorePath(WXApplication.getContext()) + saveFile + ".apk";
        }
        else {
            return;
        }
        DownloadInfo downloadInfo = new DownloadInfo();
        downloadInfo.setLabel(packageName);
        downloadInfo.setFileSavePath(savePath);
        downloadInfo.setUrl(url);
        downloadInfo.setAutoRename(false);
        downloadInfo.setAutoResume(true);
        try {
            DownloadManager.getInstance().startDownload(context,url, packageName, savePath, true, false,
                    new DefaultDownloadViewHolder(null, null, downloadInfo));
        } catch (DbException e) {
            e.printStackTrace();
        }
    }

    public static void unZipFile(String archive, String decompressDir)throws IOException, FileNotFoundException, ZipException
    {
        BufferedInputStream bi;
        ZipFile zf = new ZipFile(archive, "GBK");
        Enumeration e = zf.getEntries();
        while (e.hasMoreElements())
        {
            ZipEntry ze2 = (ZipEntry) e.nextElement();
            String entryName = ze2.getName();
            String path = decompressDir + "/" + entryName;
            if (ze2.isDirectory())
            {
                LogUtils.d("UpdateService", "creating path: "+entryName);
                File decompressDirFile = new File(path);
                if (!decompressDirFile.exists())
                {
                    decompressDirFile.mkdirs();
                }
            } else
            {
                LogUtils.d("UpdateService", "creating file: "+entryName);
                String fileDir = path.substring(0, path.lastIndexOf("/"));
                File fileDirFile = new File(fileDir);
                if (!fileDirFile.exists())
                {
                    fileDirFile.mkdirs();
                }
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(decompressDir + "/" + entryName));
                bi = new BufferedInputStream(zf.getInputStream(ze2));
                byte[] readContent = new byte[1024];
                int readCount = bi.read(readContent);
                while (readCount != -1)
                {
                    bos.write(readContent, 0, readCount);
                    readCount = bi.read(readContent);
                }
                bos.close();
            }
        }
        zf.close();
        //bIsUnzipFinsh = true;
    }
}
