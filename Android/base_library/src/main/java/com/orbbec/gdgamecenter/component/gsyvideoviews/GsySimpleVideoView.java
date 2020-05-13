package com.orbbec.gdgamecenter.component.gsyvideoviews;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.orbbec.gdgamecenter.component.SimpleVideoView;
import com.taobao.weex.utils.WXResourceUtils;

/**
 * @author tanzhuohui
 * @date 2019/8/13
 */
public class GsySimpleVideoView extends SampleVideo{
    private int videoWidth;
    private int videoHeight;

    public GsySimpleVideoView(Context context, Boolean fullFlag) {
        super(context, fullFlag);
    }

    public GsySimpleVideoView(Context context) {
        super(context);
    }

    public GsySimpleVideoView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public static class Wrapper extends RelativeLayout implements ViewTreeObserver.OnGlobalLayoutListener {
        private GsySimpleVideoView mVideoView;
        private Uri mUri;
        private String mUrl;
        public Wrapper(Context context) {
            super(context);
            init(context);
        }

        public Wrapper(Context context, AttributeSet attrs) {
            super(context, attrs);
            init(context);
        }

        public Wrapper(Context context, AttributeSet attrs, int defStyleAttr) {
            super(context, attrs, defStyleAttr);
            init(context);
        }

        private void init(Context context) {
//            setBackgroundColor(WXResourceUtils.getColor("#ee000000"));
//            FrameLayout.LayoutParams pLayoutParams =
//                    new FrameLayout.LayoutParams(LayoutParams.MATCH_PARENT,
//                            LayoutParams.MATCH_PARENT);
////            pLayoutParams.gravity = Gravity.CENTER;
//            this.setLayoutParams(pLayoutParams);
//
//            getViewTreeObserver().addOnGlobalLayoutListener(this);
        }


        /**
         * Create if not existed. Will cause request focus.
         *
         * @return
         */
        public
        @NonNull
        GsySimpleVideoView createIfNotExist() {
            if (mVideoView == null) {
                createVideoView();
            }
            return mVideoView;
        }


        public void setVideoURL(String url) {
            mUrl = url;
            if (mVideoView != null) {
                mVideoView.setUp(url , true , null);
            }
        }


        private synchronized void createVideoView() {
            if(mVideoView != null){
                return;
            }
            Context context = getContext();
            GsySimpleVideoView video = new GsySimpleVideoView(context);
            RelativeLayout.LayoutParams videoLayoutParams =
                    new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
            video.setLayoutParams(videoLayoutParams);
            video.invalidate();
            addView(video, 0);//first child
            mVideoView = video;

            if(mUrl != null) {
                setVideoURL(mUrl);
            }
        }

        @Override
        public void onGlobalLayout() {

        }

//        @SuppressLint("NewApi")
//        private void removeSelfFromViewTreeObserver() {
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
//                getViewTreeObserver().removeOnGlobalLayoutListener(this);
//            } else {
//                getViewTreeObserver().removeGlobalOnLayoutListener(this);
//            }
//        }
//
//
//        public boolean createVideoViewIfVisible(){
//            Rect visibleRect = new Rect();
//            if (mVideoView != null) {
//                return true;
//            } else if (getGlobalVisibleRect(visibleRect) && !visibleRect.isEmpty()) {
//                createVideoView();
//                return true;
//            }
//            return false;
//        }

//        @Override
//        public void onGlobalLayout() {
//            if(createVideoViewIfVisible()){
//                removeSelfFromViewTreeObserver();
//            }
//        }
    }
}
