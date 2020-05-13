package com.orbbec.gdgamecenter.utils;

/**
 * @author Altair
 * @date 2018/12/25
 */
import android.app.Activity;
import android.content.Context;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.network.ServerHelper;

import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;

import java.util.HashMap;
import java.util.Map;

import ly.count.android.sdk.Countly;


public class CountlyHelper {

    private static boolean isError = false;
    private static HashMap<String, String> sHashMap;
    private static String APP_URL = "/app_list?package=";
    /**
     * 福建移动
     */
    public static final String FJYD = "http://112.50.251.23";
    public static final String CHANNEL_FJYD = "Fujianyidong";
    public static final String HOST_FJYD = FJYD + ":11095";
    public static final String APPKEY_FJYD = "0f030ca6b46be056b81203743ca9974eec7d5c0b";
    public static final String APPHOST_FJYD = FJYD + ":9998" + APP_URL;
    /**
     * 安徽移动
     */
    public static final String AHYD = "https://gwcountly.orbbec.me";
    public static final String CHANNEL_AHYD = "Anhuiyidong";
    public static final String HOST_AHYD = AHYD + "";
    public static final String APPKEY_AHYD = "0f030ca6b46be056b81203743ca9974eec7d5c0b";
    public static final String APPHOST_AHYD = AHYD + ":9998" + APP_URL;
    /**
     * 四川移动
     */
    public static final String SCYD = "";
    public static final String CHANNEL_SCYD = "Sichuanyidong";
    public static final String HOST_SCYD = SCYD + "";
    public static final String APPKEY_SCYD = "";
    public static final String APPHOST_SCYD = SCYD + ":9998" + APP_URL;
    /**
     * 湖南移动
     */
    public static final String HNYD = "http://111.23.12.43";
    public static final String CHANNEL_HNYD = "Hunanyidong";
    public static final String HOST_HNYD = HNYD + ":11095";
    public static final String APPKEY_HNYD = "8961bc6718c1a73899dddd97f1efe4beecbedf4e";
    public static final String APPHOST_HNYD = SCYD + ":9998" + APP_URL;
    /**
     * 江苏移动
     */
    public static final String JSYD = "";
    public static final String CHANNEL_JSYD = "Jiangsuyidong";
    public static final String HOST_JSYD = JSYD + "";
    public static final String APPKEY_JSYD = "";
    public static final String APPHOST_JSYD = JSYD + ":9998" + APP_URL;
    /**
     * 天津
     */
    public static final String TJYD = "http://202.99.114.74";
    public static final String CHANNEL_TJYD = "Tianjinliantong";
    public static final String HOST_TJYD = TJYD + ":51823";
    public static final String APPKEY_TJYD = "de393cb30b9d6a5e55d22e0d1275a19b92d8586f";
    public static final String APPHOST_TJYD = TJYD + ":9998" + APP_URL;
    /**
     * 广东移动
     */
    public static final String GDYD = "http://183.234.213.6";
    public static final String CHANNEL_GDYD = "Guangdongyidong";
    public static final String HOST_GDYD = GDYD + ":11095";
    public static final String APPKEY_GDYD = "762ad8e3530ad7de13cab51b7d1d79c352b0a355";
    public static final String APPHOST_GDYD = GDYD + ":9998" + APP_URL;
    /**
     * 广东电信
     */
    public static final String GDDX = "";
    public static final String CHANNEL_GDDX = "Guangdongdianxin";
    public static final String HOST_GDDX = GDDX + "";
    public static final String APPKEY_GDDX = "";
    public static final String APPHOST_GDDX = GDDX + ":9998" + APP_URL;
    /**
     * 贵州广电
     */
    public static final String GZGD = "";
    public static final String CHANNEL_GZGD = "Guizhouguangdian";
    public static final String HOST_GZGD = GZGD + "";
    public static final String APPKEY_GZGD = "";
    public static final String APPHOST_GZGD = GZGD + ":9998" + APP_URL;
    /**
     * 山东滨州
     */
    public static final String SDBZ = "";
    public static final String CHANNEL_SDBZ = "Shandongguangdian";
    public static final String HOST_SDBZ = SDBZ + "";
    public static final String APPKEY_SDBZ = "";
    public static final String APPHOST_SDBZ = SDBZ + ":9998" + APP_URL;
    /**
     * 测试
     */
    public static final String TEST = "http://10.10.7.26";
    public static final String CHANNEL_TEST = "CountlyTest";
    public static final String HOST_TEST = TEST + ":11096";
    public static final String APPKEY_TEST = "564422992bb3b635660ac4bc007bb02170acd681";
    public static final String APPHOST_TEST = TEST + ":9998" + APP_URL;

    /**
     * 四川移动一体机
     */
    public static final String SCYD_YTJ = "http://scytj.orbbec.me";
    public static final String CHANNEL_SCYD_YTJ = "SCYD_Persee";
    public static final String HOST_SCYD_YTJ = SCYD_YTJ + ":11095";
    public static final String APPKEY_SCYD_YTJ = "12c86744f8c878557da35e4b08f3cc6ff644ed7d";
    public static final String APPHOST_SCYD_YTJ = SCYD_YTJ + ":9998" + APP_URL;


    public static void init(Activity context) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        initCountly(context, null);
    }


    public static void initCountly(Activity context, String channel) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }

        if (sHashMap == null) {
            sHashMap = new HashMap<>();
        }
        if (!TextUtils.isEmpty(channel)) {
            chooseChannel(context, channel);
        } else {
            onCreateCountly(context, null, Config.COUNTLY_SERVER_URL, Config.COUNTLY_APP_KEY);
        }

    }

    private static void chooseChannel(Activity context, String channel) {
        switch (channel) {
            case CHANNEL_FJYD:
                onCreateCountly(context, channel, HOST_FJYD, APPKEY_FJYD);
                break;
            case CHANNEL_AHYD:
                onCreateCountly(context, channel, HOST_AHYD, APPKEY_AHYD);
                break;
            case CHANNEL_SCYD:
                onCreateCountly(context, channel, HOST_SCYD, APPKEY_SCYD);
                break;
            case CHANNEL_HNYD:
                onCreateCountly(context, channel, HOST_HNYD, APPKEY_HNYD);
                break;
            case CHANNEL_JSYD:
                onCreateCountly(context, channel, HOST_JSYD, APPKEY_JSYD);
                break;
            case CHANNEL_TJYD:
                onCreateCountly(context, channel, HOST_TJYD, APPKEY_TJYD);
                break;
            case CHANNEL_GDYD:
                onCreateCountly(context, channel, HOST_GDYD, APPKEY_GDYD);
                break;
            case CHANNEL_GDDX:
                onCreateCountly(context, channel, HOST_GDDX, APPKEY_GDDX);
                break;
            case CHANNEL_GZGD:
                onCreateCountly(context, channel, HOST_GZGD, APPKEY_GZGD);
                break;
            case CHANNEL_SDBZ:
                onCreateCountly(context, channel, HOST_SDBZ, APPKEY_SDBZ);
                break;

            case CHANNEL_TEST:
                onCreateCountly(context, CHANNEL_FJYD, HOST_TEST, APPKEY_TEST);
                break;

            case CHANNEL_SCYD_YTJ:
                onCreateCountly(context, channel, HOST_SCYD_YTJ, APPKEY_SCYD_YTJ);
                break;

            default:
                break;
        }

    }

    private static void onCreateCountly(Activity context, String channel, String host, String appKey) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }

        if (TextUtils.isEmpty(host)) {
            Toast.makeText(context, "Countly init error,host is null", Toast.LENGTH_SHORT).show();
            isError = true;
            return;
        }

        if (TextUtils.isEmpty(appKey)) {
            Toast.makeText(context, "Countly init error,appKey is null", Toast.LENGTH_SHORT).show();
            isError = true;
            return;
        }

        Countly.onCreate(context);
        Countly.setChannel(channel);
        if (channel.equals(CHANNEL_FJYD)) {
            String userName = Utils.getOTTCountFJ(context);
            LogUtils.d("CountlyHelper", "onCreateCountly: userName:  " + userName);
            Countly.setUserName(userName);
        }
        if (Utils.getDevInstall(context)) {
            Countly.sharedInstance().setObSense("astra_pro");
        }
        Countly.sharedInstance().setLoggingEnabled(WXApplication.LOG_DEBUG);
        Countly.sharedInstance().enableCrashReporting();
        Countly.sharedInstance().setViewTracking(true);
        Countly.sharedInstance().setAutoTrackingUseShortName(true);
        Countly.sharedInstance().init(context.getApplicationContext(), host, appKey);
    }


    public static void onCountlyStart(Activity activity) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        Countly.sharedInstance().onStart(activity);
    }

    public static void onCountlyStop() {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        Countly.sharedInstance().onStop();
    }


    /**
     * 发送更新的次数
     */
    public static void sendCountlyUpdateEvent(String name, String packageName) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        Map<String, String> segmentation = new HashMap<>();
        segmentation.put(name + "_update", "count");
        Countly.sharedInstance().recordEvent(packageName, segmentation, 1);
    }

    /**
     * 发送下载的次数 (包括首次下载和更新)
     */
    public static void sendCountlyOrbbecDownloadEvent(String packageName) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }

        if (TextUtils.isEmpty(packageName)) {
            return;
        }

        if (sHashMap == null) {
            return;
        }

        if (sHashMap.containsKey(packageName)) {
            Countly.sharedInstance().recordOrbbecEvent(Countly.EVENT_DOWNLOAD, sHashMap.get(packageName), 1);
        } else {
            switch (Countly.getChannel()) {
                case CHANNEL_FJYD:
                    sendCountlyGetPackName(APPHOST_FJYD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_AHYD:
                    sendCountlyGetPackName(APPHOST_AHYD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_SCYD:
                    sendCountlyGetPackName(APPHOST_SCYD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_HNYD:
                    sendCountlyGetPackName(APPHOST_HNYD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_JSYD:
                    sendCountlyGetPackName(APPHOST_JSYD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_TJYD:
                    sendCountlyGetPackName(APPHOST_TJYD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_GDYD:
                    sendCountlyGetPackName(APPHOST_GDYD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_GDDX:
                    sendCountlyGetPackName(APPHOST_GDDX, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_GZGD:
                    sendCountlyGetPackName(APPHOST_GZGD, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_SDBZ:
                    sendCountlyGetPackName(APPHOST_SDBZ, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_TEST:
                    sendCountlyGetPackName(APPHOST_TEST, packageName, Countly.EVENT_DOWNLOAD);
                    break;
                case CHANNEL_SCYD_YTJ:
                    sendCountlyGetPackName(APPHOST_SCYD_YTJ, packageName, Countly.EVENT_DOWNLOAD);
                    break;

                default:
                    break;
            }

        }


    }

    private static void sendCountlyGetPackName(String host, final String packageName, final int eventCode) {
        ServerHelper.requestAppKey(host + packageName, new Callback.CommonCallback<JSONObject>() {
            @Override
            public void onSuccess(JSONObject result) {
                try {
                    if (result.optInt("code") == 0) {
                        JSONObject data = result.getJSONObject("data");
                        String app_key = data.optString("app_key");
                        if (!TextUtils.isEmpty(app_key)) {
                            sHashMap.put(packageName, app_key);
                            Countly.sharedInstance().recordOrbbecEvent(eventCode, app_key, 1);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }


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

    /**
     * 发送首次下载的次数
     */
    public static void sendCountlyDownloadEvent(String name, String packageName) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        Map<String, String> segmentation = new HashMap<>();
        segmentation.put(name + "_download", "count");
        Countly.sharedInstance().recordEvent(packageName, segmentation, 1);
    }


    /**
     * 发送启动游戏的次数
     */
    public static void sendCountlyLaunchEvent(String name, String packageName) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        Map<String, String> segmentation = new HashMap<>();
        segmentation.put(name + "_launch", "count");
        Countly.sharedInstance().recordEvent(packageName, segmentation, 1);
    }


    /**
     * 发送点击的次数
     */
    public static void sendCountlyClickEvent(String name, String packageName) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        Map<String, String> segmentation = new HashMap<>();
        segmentation.put(name + "_clickview", "count");
        Countly.sharedInstance().recordEvent(packageName, segmentation, 1);
    }

    /**
     * 发送反馈
     */
    public static void sendCountlyFeedback(String packageName, int id, String content) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }
        Map<String, String> segmentation = new HashMap<>();
        segmentation.put("反馈" + id, content);
        Countly.sharedInstance().recordEvent(packageName, segmentation, 1);
    }

    /**
     * 发送点击的次数（只记录点击推荐位置跳入详情界面的情况）
     */
    public static void sendCountlyOrbbecClickEvent(final String packageName) {
        if (!WXApplication.COUNTLY_SWITCH) {
            return;
        }

        if (isError) {
            return;
        }

        if (sHashMap == null) {
            return;
        }

        if (sHashMap.containsKey(packageName)) {
            Countly.sharedInstance().recordOrbbecEvent(Countly.EVENT_CLICK, sHashMap.get(packageName), 1);
        } else {

            switch (Countly.getChannel()) {
                case CHANNEL_FJYD:
                    sendCountlyGetPackName(APPHOST_FJYD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_AHYD:
                    sendCountlyGetPackName(APPHOST_AHYD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_SCYD:
                    sendCountlyGetPackName(APPHOST_SCYD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_HNYD:
                    sendCountlyGetPackName(APPHOST_HNYD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_JSYD:
                    sendCountlyGetPackName(APPHOST_JSYD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_TJYD:
                    sendCountlyGetPackName(APPHOST_TJYD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_GDYD:
                    sendCountlyGetPackName(APPHOST_GDYD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_GDDX:
                    sendCountlyGetPackName(APPHOST_GDDX, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_GZGD:
                    sendCountlyGetPackName(APPHOST_GZGD, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_SDBZ:
                    sendCountlyGetPackName(APPHOST_SDBZ, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_TEST:
                    sendCountlyGetPackName(APPHOST_TEST, packageName, Countly.EVENT_CLICK);
                    break;
                case CHANNEL_SCYD_YTJ:
                    sendCountlyGetPackName(APPHOST_SCYD_YTJ, packageName, Countly.EVENT_CLICK);
                    break;
                default:
                    break;
            }

        }

    }

}
