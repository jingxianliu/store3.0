package com.orbbec.gdgamecenter.network;

import android.text.TextUtils;

import com.orbbec.gdgamecenter.utils.Utils;
import com.orbbec.utils.XLog;

import org.xutils.http.RequestParams;

/**
 * @author jjchai
 * @date 2016/11/16
 */

public class BaseRequestParams extends RequestParams {

    public BaseRequestParams(String url) {
        super(transformUrl(url)/*url*/);
    }

    private static String transformUrl(String url) {
        if (TextUtils.isEmpty(url)) {
            XLog.e("BaseRequestParams", "RequestParams url is null");
            throw new NullPointerException();
        }

        StringBuilder builder = new StringBuilder();
        builder.append(url);
        if (!url.contains("?")) {
            builder.append("?");
            builder.append("mac=");
            builder.append(Utils.getMAC());
        } else {
            builder.append("&");
            builder.append("mac=");
            builder.append(Utils.getMAC());
        }
        return builder.toString();
    }
}
