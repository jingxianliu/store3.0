package com.orbbec.gdgamecenter.adapter;

import com.orbbec.gdgamecenter.presenter.WeexPresenter;

/**
 * @author Altair
 * @date 2018/12/6
 */
public class DownloadProgressAdapter {
    private static WeexPresenter weexPresenter;

    public static void setPresenter(WeexPresenter presenter){
        weexPresenter = presenter;
    }

    public static void sendProgress(String packageName , int progress){
        if(weexPresenter!=null){
            weexPresenter.loading(packageName,progress);
        }
    }
}