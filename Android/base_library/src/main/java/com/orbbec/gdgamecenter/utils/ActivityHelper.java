package com.orbbec.gdgamecenter.utils;

import android.app.Activity;
import android.app.Application;
import android.util.Log;

import com.orbbec.countly.CountlyUtils;

import java.util.LinkedList;
import java.util.List;
import java.util.logging.Handler;

/**
 * @author Altair
 * @date 2018/11/22
 */
public class ActivityHelper extends Application {
    //运用list来保存们每一个activity是关键
    private List<Activity> mList = new LinkedList<Activity>();
    //为了实现每次使用该类时不创建新的对象而创建的静态对象
    private static ActivityHelper instance;
    //构造方法
    private ActivityHelper(){}
    //实例化一次
    public synchronized static ActivityHelper getInstance(){
        if (null == instance) {
            instance = new ActivityHelper();
        }
        return instance;
    }
    // 添加 Activity
    public void addActivity(Activity activity) {
        mList.add(activity);
        LogUtils.d("FujianBaminSDK", "addActivity: " + mList.size());
    }
    //关闭每一个list内的activity
    public void exit() {
        try {
            for (Activity activity:mList) {
                LogUtils.d("FujianBaminSDK", "exit: " + mList.size());
                if (activity != null) {
                    activity.finish();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            CountlyUtils.getInstance().sendEnd();
        }
    }
    //杀进程
    public void onLowMemory() {
        super.onLowMemory();
        System.gc();
    }
}
