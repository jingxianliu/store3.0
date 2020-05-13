package com.orbbec.gdgamecenter.network;

import android.util.Log;

import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.gdgamecenter.utils.Utils;

/**
 * @author jjchai
 * @date 2017/1/10
 */

public final class ServerConstants {

    /**
     * 应用服务器
     */
    //阿里演示环境
    //public static String APP_HOST = "http://120.76.132.60:8001";
    //内网开发环境
    //public static String APP_HOST = "http://10.10.6.223:8001";
    //测试环境
//    public static String APP_HOST = "http://10.10.7.26:8001";
    //福建版本环境
    //public static String APP_HOST = "http://112.50.251.23:10091";
//    public static String APP_HOST = "http://112.50.251.23:10093";
    //滨州广电
    //public static String APP_HOST = "http://10.191.173.52:10091";
    //天津
    //public static String APP_HOST = "http://202.99.114.74:51821";
    //广东移动
//    public static String APP_HOST = "http://183.234.213.6:10091";
    //湖南移动
//    public static String APP_HOST = "http://111.23.12.43:10091";

    private static final String SERVICE_IP = "SERVICE_IP";
    public static String APP_HOST = "";
    static {
        APP_HOST =  Utils.getMedaData(SERVICE_IP , null);
        LogUtils.d("tzh", "static initializer: " + APP_HOST);
    }
    private static String TEMP_HOST = "/api/v1";

    /**
     * 类别
     */
    public static String APP_CLASSES_PORTAL = "/portal";
    public static String APP_CLASSES_COLUMNS = "/columns";
    public static String APP_CLASSES_AD = "/package";


    /**
     * 接口
     */
    public static final String MAIN_APP_DATA = "/main/data/";
    public static final String COLUMNS_POSITION = "/position";
    public static final String PORTAL_POSITION = "/columns";
    public static final String PACKAGE_AD = "/ad";
    public static final String PACKAGE_ANNOUNCEMENT = "/announcement";
    public static final String COLUMNS_PARMAR = "?results_per_page=0";


    /**
     * 门户
     */
    public static String PORTAL_URL = APP_HOST + TEMP_HOST + APP_CLASSES_PORTAL + "/com.orbbec.gdgamecenter";

    /**
     * 栏目
     */
    public static String BASE_COLUMNS = APP_HOST + TEMP_HOST + APP_CLASSES_PORTAL;
    /**
     * 推荐位
     */
    public static String BASE_COLUMNS_POSITION = APP_HOST + TEMP_HOST + APP_CLASSES_COLUMNS;

    /**
     * 广告
     */
    public static String BASE_AD = APP_HOST + TEMP_HOST + APP_CLASSES_AD + "/com.orbbec.gdgamecenter" + PACKAGE_AD;
    /**
     * 公告
     */
    public static String BASE_ANNOUNCEMENT = APP_HOST + TEMP_HOST + APP_CLASSES_AD + "/com.orbbec.gdgamecenter" + PACKAGE_ANNOUNCEMENT;
    /**
     * 所有发布app信息
     */
    public static String BASE_ALL_APP_INFO = APP_HOST + TEMP_HOST + APP_CLASSES_PORTAL;
    public static String TEMP_ALL_APP_INFO = "/app?results_per_page=0";
    public static String TEMP_PART_APP_INFO = "/apk?num_display=";

    /**
     * 获取单个app
     */
    //http://10.10.6.223:8001/api/v1/app/com.Orbbec.MagicSalad
    public static String GET_APP_URL = APP_HOST + TEMP_HOST + "/app";

    /**
     * 获取栏目中的推荐位单个信息
     */
//    public static String GET_RECOMMEND_URL = APP_HOST+TEMP_HOST+"/position/4df0202d-a7eb-3531-ad70-40ad896f2461";
    public static String GET_RECOMMEND_URL = APP_HOST + TEMP_HOST + "/position/69f18a0a-8751-4f8e-8226-234bc78ab935";

    /**
     * 统计服务器
     */
    public static String STATISTICS_HOST = "STATISTICS_HOST";

}
