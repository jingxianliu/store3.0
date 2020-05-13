package com.orbbec.gdgamecenter.utils;

/**
 * @author yh
 * @date 2018/6/7
 */

public interface Config {


    boolean LOG_DEBUG = true;

    boolean COUNTLY_SWITCH = true;

    /**
     * 数据类型
     */
    /**
     * 栏目
     */
    String TYPE_COLUMNS = "type_columns";

    /**
     * 广告
     */
    String TYPE_ADS = "type_ads";

    /**
     * 推荐位
     */
    String TYPE_COLUMNSCONTENT = "type_columnscontents";

    /**
     * 公告
     */
    String TYPE_NOTICES = "type_notices";

    /**
     * fragment的数据类型标识
     */
    String FRAGMENT_DATA_FLAG = "fragment_data_flag";
    String FRAGMENT_DATA_CODE = "fragment_data_code";
    String FRAGMENT_DATA_ID = "fragment_data_id";
    String FRAGMENT_DATA_TYPE = "fragment_data_type";
    String FRAGMENT_DATA_LINK = "fragment_data_link";


    /**
     * fragment类型
     */
    String FRAGMENT_RECOMMEND = "recommend";
    String FRAGMENT_COLUMN = "column";
    String FRAGMENT_PERSON_CENTER = "personal_center";
    String FRAGMENT_ACTIVE = "active";

    /**
     * 推荐位类型
     */
    String ITEM_IMG = "img";
    String ITEM_VOD = "vod";
    String ITEM_APP = "app";
    String ITEM_APPS = "apps";
    String ITEM_ACTIVE = "active";


    /**
     * 应用 起始段 100
     */
    /**
     * 应用下载
     */
    int DOWNLOAD_APP = 101;

    /**
     * 应用安装
     */
    int INSTALLED_APP = 102;
    /**
     * data存储已满
     */
    int DATA_STORAGE_FILL = 103;

    /**
     * sdcard存储已满
     */
    int SDCARD_STORAGE_FILL = 104;
    /**
     * 卸载应用
     */
    int REMOVE_APP = 105;
    /**
     * video下载完成
     */
    int VIDEO_DOWN_SUCCESS = 107;

    /**
     * video下载出错
     */
    int VIDEO_DOWN_ERROE = 108;
    /**
     * 获取焦点
     */
    int FOCUS_VIEW = 109;

    /**
     * 系统 起始段 200
     */
    /**
     * 时间变化
     */
    int TIME_CHANGED = 201;

    /**
     * 网络变化
     */
    int NETWORK_CHANGED = 202;

    /**
     * 存储已满
     */
    int FULL_STORED = 203;


    /**
     * 栏目图标映射
     * | 奥比体感乐园 439c165a-9854-35d1-b31b-ce312602291f |
     * | 推荐 495b1c02-8f5b-32ee-8058-dbd5410c4136 |
     * | 教育 69820b54-6ecf-3729-9eb9-1bde6443d978 |
     * | 亲子 5472c6ee-bda3-3676-8092-9d97b06b6c42 |
     * | 健康 013f2ca5-aabb-3996-8a7c-37cd44575e31 |
     * | 娱乐 e63405ff-658e-35f3-a248-1f13dae600a6 |
     * | 个人中心 c5230603-1c75-3709-adfe-46752a1042d7 |
     */
    String COLUMNS_REC = "495b1c02-8f5b-32ee-8058-dbd5410c4136";
    String COLUMNS_EDU = "69820b54-6ecf-3729-9eb9-1bde6443d978";
    String COLUMNS_CHI = "5472c6ee-bda3-3676-8092-9d97b06b6c42";
    String COLUMNS_FIT = "013f2ca5-aabb-3996-8a7c-37cd44575e31";
    String COLUMNS_AUM = "e63405ff-658e-35f3-a248-1f13dae600a6";

    String SP_NAME = "gd_cfg";
    String APP_CODE = "app_code";

    /**
     * 第三方启动类型
     */
    String ACTION_TYPE = "action_type";
    String ACTION_NAME = "actionName";
    String TYPE_APP = "action_app";
    String TYPE_POSTER = "action_poster";
    String TYPE_ACTIVITY = "action_activity";

    /**
     * 第三方启动类型为app的时候，携带的包名
     */
    String APP_PACKAGENAME = "app_packagename";

    /**
     *
     */
    String WEB_URL_DATA = "web_url_data";

    /**
     * 统计平台
     */
    //福建
    /*public static final String COUNTLY_SERVER_URL = "http://112.50.251.23:11095";

    public static final String COUNTLY_APP_KEY = "0f030ca6b46be056b81203743ca9974eec7d5c0b";*/

    //天津联通
    /*public static final String COUNTLY_SERVER_URL = "http://202.99.114.74:51823";

    public static final String COUNTLY_APP_KEY = "de393cb30b9d6a5e55d22e0d1275a19b92d8586f";*/

    //测试Countly2.0兼容性
    public static final String COUNTLY_SERVER_URL = "http://10.10.7.26:11096";

    public static final String COUNTLY_APP_KEY = "564422992bb3b635660ac4bc007bb02170acd681";
}
