package com.orbbec.gdgamecenter.network;

import android.content.SharedPreferences;
import android.text.TextUtils;

import com.orbbec.gdgamecenter.utils.Config;
import com.orbbec.utils.NetUtils;

import org.xutils.common.Callback;
import org.xutils.http.HttpMethod;
import org.xutils.http.RequestParams;
import org.xutils.x;

import static android.content.Context.MODE_PRIVATE;

/**
 * @author jjchai
 * @date 2017/1/10
 */

public class ServerHelper {

    public static void request(HttpMethod method, RequestParams params, Callback.CommonCallback callback) {
        boolean connected = NetUtils.networkCanUse(x.app().getApplicationContext());
        if (connected) {
            switch (method) {
                case GET:
                    x.http().get(params, callback);
                    break;
                case POST:
                    x.http().post(params, callback);
                    break;
                default:
                    x.http().request(method, params, callback);
                    break;
            }
        } else {
            callback.onCancelled(new Callback.CancelledException("network is not connected!"));
        }
    }

    public static void requestColumnsData(String code, Callback.CommonCallback callback) {
        if (TextUtils.isEmpty(code)) {
            SharedPreferences sp = x.app().getApplicationContext().getSharedPreferences(Config.SP_NAME, MODE_PRIVATE);
            String spCode = sp.getString(Config.APP_CODE, "");
            if (TextUtils.isEmpty(spCode)) {
                code = "439c165a-9854-35d1-b31b-ce312602291f";
            } else {
                code = spCode;
            }
        }

        //门户439c165a-9854-35d1-b31b-ce312602291f
        requestData(ServerConstants.BASE_COLUMNS + "/" + code + ServerConstants.PORTAL_POSITION, callback);

    }

    public static void requestColumnsContentsData(String code, Callback.CommonCallback callback) {
        requestData(ServerConstants.BASE_COLUMNS_POSITION + "/" + code + ServerConstants.COLUMNS_POSITION + ServerConstants.COLUMNS_PARMAR, callback);

    }

    public static void requestNoticesData(Callback.CommonCallback callback) {
        requestData(ServerConstants.BASE_ANNOUNCEMENT, callback);

    }

    public static void requestAdsData(Callback.CommonCallback callback) {
        requestData(ServerConstants.BASE_AD, callback);

    }

    public static void requestAppData(String packageName, Callback.CommonCallback callback) {
        requestData(ServerConstants.GET_APP_URL + "/" + packageName, callback);

    }


    private static void requestData(String url, Callback.CommonCallback callback) {
        RequestParams requestParams = new RequestParams(url);
        requestParams.setMethod(HttpMethod.GET);
        request(HttpMethod.GET, requestParams, callback);
    }

    public static void requestGdGameCenterInfo(Callback.CommonCallback callback) {
        requestData(ServerConstants.PORTAL_URL, callback);
    }

    public static void requestAllAppInfo(String code, Callback.CommonCallback callback) {
        if (TextUtils.isEmpty(code)) {
            SharedPreferences sp = x.app().getApplicationContext().getSharedPreferences(Config.SP_NAME, MODE_PRIVATE);
            String spCode = sp.getString(Config.APP_CODE, "");
            if (TextUtils.isEmpty(spCode)) {
                code = "439c165a-9854-35d1-b31b-ce312602291f";
            } else {
                code = spCode;
            }


        }
        requestData(ServerConstants.BASE_ALL_APP_INFO + "/" + code + ServerConstants.TEMP_ALL_APP_INFO, callback);
    }


    public static void requestExitAppInfo(String code, int count, Callback.CommonCallback callback) {
        requestData(ServerConstants.BASE_ALL_APP_INFO + "/" + code + ServerConstants.TEMP_PART_APP_INFO + count, callback);
    }

    public static void requestImgInfo(Callback.CommonCallback callback) {
        requestData(ServerConstants.GET_RECOMMEND_URL, callback);
    }

    public static void requestAppKey(String url, Callback.CommonCallback callback) {
        requestData(url, callback);
    }
}
