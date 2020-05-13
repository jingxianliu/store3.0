package com.orbbec.gdgamecenter.component.gsyvideoviews;

import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.orbbec.gdgamecenter.library.R;
import com.shuyu.gsyvideoplayer.GSYVideoManager;
import com.shuyu.gsyvideoplayer.listener.VideoAllCallBack;
import com.shuyu.gsyvideoplayer.utils.GSYVideoType;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.dom.WXDomObject;
import com.taobao.weex.ui.component.WXComponent;
import com.taobao.weex.ui.component.WXComponentProp;
import com.taobao.weex.ui.component.WXVContainer;

/**
 * @author tanzhuohui
 * @date 2019/8/13
 */
public class GsySimpleVideo extends WXComponent<RelativeLayout> {
    private GsySimpleVideoView view;
    private static final String TAG = "GSYSIMPLEVIDEO";
    private String videoPath ;
    private boolean mAutoplay = true;
    public GsySimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent, String instanceId, boolean isLazy) {
        super(instance, dom, parent, instanceId, isLazy);
    }

    public GsySimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent, boolean isLazy) {
        super(instance, dom, parent, isLazy);
    }

    public GsySimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent) {
        super(instance, dom, parent);
    }

    public GsySimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent, int type) {
        super(instance, dom, parent, type);
    }


    @Override
    protected RelativeLayout initComponentHostView(@NonNull Context context) {
        GsySimpleVideoView.Wrapper video = new GsySimpleVideoView.Wrapper(context);
        view = video.createIfNotExist();
        view.setLooping(true);
        GSYVideoType.setShowType(GSYVideoType.SCREEN_MATCH_FULL);
        GSYVideoManager gsyVideoManager = (GSYVideoManager) view.getGSYVideoManager();
        gsyVideoManager.setVideoType(context.getApplicationContext(), GSYVideoType.IJKEXOPLAYER2);
        view.getTitleTextView().setVisibility(View.GONE);
        view.getBackButton().setVisibility(View.GONE);
        view.getStartButton().setVisibility(View.GONE);
        view.getStartButton().setAlpha(0);
        view.setBottomShowProgressBarDrawable(null , null);
        view.setBottomProgressBarDrawable(null);
        view.setDialogVolumeProgressBar(null);
        view.setDialogProgressBar(null);
        view.findViewById(R.id.layout_top).setBackgroundDrawable(null);
//        view.setVideoAllCallBack(videoAllCallBack);
        return video;
    }

    @WXComponentProp(name="setPath")
    public void setPath(String path){
        final WXSDKInstance instance = getInstance();
        if(path == null){
            return;
        }
        videoPath = path;
        Log.e(TAG, "SetPath ");
        view.setUp(videoPath , true , null);
        if(mAutoplay) {
            view.startPlayLogic();
        }

    }

    @WXComponentProp(name="setAutoplay")
    public void setAutoplay(boolean autoplay){
        mAutoplay = autoplay;
    }

    @JSMethod
    public void pause(){
        Log.e(TAG, "pause ");
        //view.stopPlayback();
        view.onVideoPause();
    }

    @JSMethod
    public void stop(){
        Log.e(TAG, "stop video ");
        //view.pause();
        view.onVideoPause();
    }


    @JSMethod
    public void setLooping(boolean looping){
        view.setLooping(looping);
    }

    @JSMethod
    public void reset(){
        Log.e(TAG, "reset ");
        // view.stopPlayback();
        view.onVideoReset();
    }

    @JSMethod
    public void zoom (){
        ViewGroup.LayoutParams  lp = view.getLayoutParams();
        lp.width *= 2;
        lp.height *= 2;
        view.setLayoutParams(lp);
    }

    @JSMethod
    public void restart(){
        Log.e(TAG, "restart ");
        // view.stopPlayback();
        view.onVideoReset();
        view.startPlayLogic();
    }


    @JSMethod
    public void setShowType(int showType){
        GSYVideoType.setShowType(showType);
    }

}
