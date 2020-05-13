package com.orbbec.countly;

import android.content.Context;
import android.util.Log;

/**
 * @author tanzhuohui
 * @date 2018/12/18
 */
public class CrashHandler implements Thread.UncaughtExceptionHandler {
    private static final String TAG = "CrashHandler";
    private static final boolean DEBUG = true;

    //系统默认的异常处理器
    private Thread.UncaughtExceptionHandler mDefaultCrashHandler;
    private Context mContext;

    //单例模式
    private static CrashHandler sInstance = new CrashHandler();

    private CrashHandler() {
    }

    public static CrashHandler getInstance() {
        return sInstance;
    }

    public void init(Context context) {
        mDefaultCrashHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler(this);
        mContext = context.getApplicationContext();
    }

    /**
     * 这个是最关键的函数，当程序中有未被捕获的异常，系统将会自动调用#uncaughtException方法
     * thread为出现未捕获异常的线程，ex为未捕获的异常，有了这个ex，我们就可以得到异常信息。
     */
    @Override
    public void uncaughtException(Thread thread, Throwable ex) {

        //这里可以通过网络上传异常信息到服务器，便于开发人员分析日志从而解决bug
        CountlyUtils.getInstance().sendCrashes(Log.getStackTraceString(ex));
        ex.printStackTrace();
    }
}
