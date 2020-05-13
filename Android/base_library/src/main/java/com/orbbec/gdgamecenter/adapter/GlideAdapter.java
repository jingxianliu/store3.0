package com.orbbec.gdgamecenter.adapter;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.RequestManager;
import com.bumptech.glide.load.DecodeFormat;
import com.bumptech.glide.request.RequestOptions;
import com.taobao.weex.adapter.IWXImgLoaderAdapter;
import com.taobao.weex.common.WXImageStrategy;
import com.taobao.weex.dom.WXImageQuality;
import com.orbbec.gdgamecenter.library.R;

/**
 * @author Altair
 * @date 2018/12/4
 */
public class GlideAdapter implements IWXImgLoaderAdapter {


    private final RequestManager glide;
    public GlideAdapter(RequestManager glide){
        this.glide = glide;
    }
    @Override
    public void setImage( String url, ImageView view,
                         WXImageQuality quality, WXImageStrategy strategy) {
        RequestOptions requestOptions = new RequestOptions()
                .format(DecodeFormat.PREFER_RGB_565)
                .placeholder(new ColorDrawable(0x224367FF));
        loadImage(glide,url,view,requestOptions);
    }

    static void loadImage(RequestManager glide, String url, ImageView view, RequestOptions requestOptions) {
        glide.load(url).apply(requestOptions).into(view);
    }
}
