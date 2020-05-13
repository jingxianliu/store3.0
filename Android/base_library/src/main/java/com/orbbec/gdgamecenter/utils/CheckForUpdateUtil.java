package com.orbbec.gdgamecenter.utils;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.text.TextUtils;

import com.taobao.weex.WXEnvironment;
import com.taobao.weex.WXSDKManager;
import com.taobao.weex.adapter.IWXHttpAdapter;
import com.taobao.weex.common.WXRequest;
import com.taobao.weex.common.WXResponse;
import com.taobao.weex.utils.WXLogUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;


public class CheckForUpdateUtil {
    public static void checkForUpdate(final Context context) {
        PackageManager pm = context.getPackageManager();
        try {
            PackageInfo info = pm.getPackageInfo(context.getPackageName(), 0);
            if (info != null) {
                final int versionCode = info.versionCode;
                final String packageName = info.packageName;
                String updateUrl = "http://dotwe.org/release/latest?v=" + versionCode;
                WXRequest request = new WXRequest();
                request.method = "GET";
                request.url = updateUrl;
                WXLogUtils.d("Update", "check for update: " + versionCode);
                WXSDKManager.getInstance().getIWXHttpAdapter().sendRequest(request, new IWXHttpAdapter.OnHttpListener() {
                    @Override
                    public void onHttpStart() {

                    }

                    @Override
                    public void onHeadersReceived(int statusCode, Map<String, List<String>> headers) {

                    }

                    @Override
                    public void onHttpUploadProgress(int uploadProgress) {

                    }

                    @Override
                    public void onHttpResponseProgress(int loadedLength) {

                    }

                    @Override
                    public void onHttpFinish(final WXResponse response) {
                        if (!response.statusCode.equals("200")) {
                            WXLogUtils.e("Update", "failed: " + response.statusCode);
                            return;
                        }
                        WXSDKManager.getInstance().getWXRenderManager().postOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                String s = new String(response.originalData);
                                if (!TextUtils.isEmpty(s)) {
                                    try {
                                        WXLogUtils.d("Update", s);
                                        JSONObject object = new JSONObject(s);
                                        JSONObject params = object.optJSONObject("params");
                                        if (params != null) {
                                            String newVersionCode = params.optString("versionCode","latest");
                                            boolean hasUpdate = versionCode < Integer.parseInt(newVersionCode);
                                            if (hasUpdate) {
                                                String updateDate = params.optString("updateDate", "");
                                                final String updateUrl = params.optString("updateUrl", "");

                                                String updateDescription = params.optString("updateDescription", null);
                                                //UpdateService.startDownload(packageName,updateUrl);

                                            }
                                        }
                                    } catch (JSONException e) {
                                        e.printStackTrace();
                                    }
                                }
                            }
                        }, 0);
                    }
                });
            }
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }

    private static String getMsg(String v, String date, String desc) {
        StringBuilder sb = new StringBuilder();
//        sb.append(getStringRes(R.string.update_version)).append(v).append("\n")
//                .append(getStringRes(R.string.update_date)).append(date).append("\n")
//                .append(getStringRes(R.string.update_desc)).append(desc);
        return sb.toString();
    }

    public static String getStringRes(int id) {
        if (WXEnvironment.getApplication() != null) {
            return WXEnvironment.getApplication().getString(id);
        }
        return "";
    }
}
