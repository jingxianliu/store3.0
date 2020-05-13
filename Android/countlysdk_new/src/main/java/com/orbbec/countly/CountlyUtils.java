package com.orbbec.countly;

import android.content.Context;
import android.text.TextUtils;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import ly.count.android.sdk.Countly;
import ly.count.android.sdk.CrashDetails;
import ly.count.android.sdk.DeviceInfo;

/**
 * @author tanzhuohui
 * @date 2018/12/17
 */
public class CountlyUtils {
    private static final String TAG = "countly_new";
    private String obsense;
    private String appKey;
    private String userName;
    private Context context;
    private boolean isFrist = true;

    public void setObsense(String obsense) {
        this.obsense = obsense;
    }

    public void setAppKey(String appKey) {
        this.appKey = appKey;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public void setChannel(String ch) {
        if (TextUtils.isEmpty(ch)) {
            return;
        }
        DeviceInfo.setChannel(ch);
    }

    private static class Instance {
        public static CountlyUtils utils = new CountlyUtils();
    }

    public static CountlyUtils getInstance() {
        return Instance.utils;
    }

    /**
     * 启动接口
     */
    public void sendBegin() {
        if (isFrist) {
            String data = "app_key=" + appKey
                    + "&ott_username=" + userName
                    + "&begin_session=" + "1"
                    + "&timestamp=" + Countly.currentTimestampMs()
                    + "&sdk_version=" + Countly.COUNTLY_SDK_VERSION_STRING
                    + "&sdk_name=" + Countly.COUNTLY_SDK_NAME
                    + "&metrics=" + DeviceInfo.getMetrics(context);
            if (!TextUtils.isEmpty(obsense)) {
                data += "&obsense=" + obsense;
            }
            if(Countly.sharedInstance().isLoggingEnabled()) {
                Log.d(TAG, "sendBegin: " + data);
            }
            Executor.getInstance().sendMessages(Executor.BEGIN, data);
            sendHeart();
            isFrist = false;
        }
    }

    protected void sendBeginAgain() {
        String data = "app_key=" + appKey
                + "&ott_username=" + userName
                + "&begin_session=" + "1"
                + "&timestamp=" + Countly.currentTimestampMs()
                + "&sdk_version=" + Countly.COUNTLY_SDK_VERSION_STRING
                + "&sdk_name=" + Countly.COUNTLY_SDK_NAME
                + "&metrics=" + DeviceInfo.getMetrics(context);
        if (!TextUtils.isEmpty(obsense)) {
            data = data + "&obsense=" + obsense;
        }
        if(Countly.sharedInstance().isLoggingEnabled()) {
            Log.d(TAG, "sendBegin: " + data);
        }
        Executor.getInstance().sendMessages(Executor.BEGIN, data);
        sendHeart();
    }

    /**
     * 结束接口
     */
    public void sendEnd() {
        String data = "app_key=" + appKey
                + "&ott_username=" + userName
                + "&end_session=1"
                + "&timestamp=" + Countly.currentTimestampMs()
                + "&session_duration=60";
        if(Countly.sharedInstance().isLoggingEnabled()) {
            Log.d(TAG, "sendEnd: " + data);
        }
        isFrist = true;
        Executor.getInstance().sendMessages(Executor.END, data);
    }

    /**
     * 心跳接口
     */
    private void sendHeart() {
        String data = "app_key=" + appKey
                + "&ott_username=" + userName
                + "&timestamp=" + Countly.currentTimestampMs()
                + "&session_duration=60";
        Executor.getInstance().sendMessagesDelay(Executor.HEART, data, 60000);
    }

    /**
     * 奔溃接口
     * @param error
     */
    protected void sendCrashes(String error) {
        String data = "app_key=" + appKey
                + "&ott_username=" + userName
                + "&timestamp=" + Countly.currentTimestampMs()
                + "&sdk_version=" + Countly.COUNTLY_SDK_VERSION_STRING
                + "&sdk_name=" + Countly.COUNTLY_SDK_NAME
                + "&crash=" + CrashDetails.getCrashData(context, error, false);
        Executor.getInstance().sendMessages(Executor.CRASHES, data);
    }

    /**
     * 行为接口
     * @param operate  统计的参数名
     * @param packName 统计的参数值
     */
    public void sendOperate(String operate, String packName) {
        String data = "app_key=" + appKey
                + "&ott_username=" + userName;
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(operate, packName);
            String jsonOperate = jsonObject.toString();
            jsonOperate = java.net.URLEncoder.encode(jsonOperate, "UTF-8");
            data += "&operate=" + jsonOperate;
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        Executor.getInstance().sendMessages(Executor.OPERATE, data);
    }

    public void sendOperateDelay(String operate, String packName, int time) {
        String data = "app_key=" + appKey
                + "&ott_username=" + userName;
        try {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put(operate, packName);
            String jsonOperate = jsonObject.toString();
            jsonOperate = java.net.URLEncoder.encode(jsonOperate, "UTF-8");
            data += "&operate=" + jsonOperate;
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        Executor.getInstance().removeMessage(Executor.HELP);
        Executor.getInstance().sendMessagesDelay(Executor.HELP, data, time);
    }

    /**
     * 初始化
     * @param context 应用的application
     * @param channel 渠道号
     * @param hasObsense 是否有体感设备
     * @param userName 用户名
     */
    public void initCountly(Context context, String channel, boolean hasObsense, String userName) {
        if(TextUtils.isEmpty(channel)){
            Log.e(TAG, "CHANNEL must be not null");
            return;
        }
        //为应用设置异常处理器
        CrashHandler crashHandler = CrashHandler.getInstance();
        crashHandler.init(context);
        String obsense = "";
        if (hasObsense) {
            obsense = "astra_pro";
        }
        CountlyUtils.getInstance().setUserName(userName);
        if(channel.equals(CountlyParams.CHANNEL_JSYD[0])){
            CountlyUtils.getInstance().setChannel(channel);
            CountlyUtils.getInstance().setAppKey(CountlyParams.CHANNEL_JSYD[1]);
        }
        CountlyUtils.getInstance().setObsense(obsense);
        CountlyUtils.getInstance().setContext(context);
    }

    /**
     *统计自定义的事件
     * @param clickId 由web端创建
     */
    public void event(String clickId){
        String data = "app_key=" + appKey
                + "&ott_username=" + userName
                + "&eid=" + clickId;
        Executor.getInstance().sendMessages(Executor.EVENT, data);
    }

    /**
     * 计费事件
     * @param income 收入
     */
    public void pay(String income){
        String data = "app_key=" + appKey
                + "&ott_username=" + userName
                + "&income=" + income;
        Executor.getInstance().sendMessages(Executor.PAY, data);
    }
}
