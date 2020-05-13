package com.orbbec.gdgamecenter.component;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.VideoView;

import com.bumptech.glide.Glide;
import com.taobao.weex.utils.WXResourceUtils;

//import io.vov.vitamio.Vitamio;
//import io.vov.vitamio.provider.MediaStore;

/**
 * @author Altair
 * @date 2018/11/23
 */
public class  SimpleVideoView {

//    private int videoWidth;
//    private int videoHeight;
//
//    public SimpleVideoView(Context context) {
//        super(context);
//        setZOrderMediaOverlay(true);
//    }
//
//    public SimpleVideoView(Context context, AttributeSet attrs) {
//        super(context, attrs);
//        setZOrderMediaOverlay(true);
//    }
//
//    public SimpleVideoView(Context context, AttributeSet attrs, int defStyle) {
//        super(context, attrs, defStyle);
//        setZOrderMediaOverlay(true);
//    }
//
//    @Override
//    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
//        int width = getDefaultSize(videoWidth, widthMeasureSpec);
//        int height = getDefaultSize(videoHeight, heightMeasureSpec);
//        if (videoWidth > 0 && videoHeight > 0) {
//            if (videoWidth * height > width * videoHeight) {
//                height = width * videoHeight / videoWidth;
//            } else if (videoWidth * height < width * videoHeight) {
//                width = height * videoWidth / videoHeight;
//            }
//        }
//    //    Log.e("dxm", "onMeasure: width:"+MeasureSpec.getSize(widthMeasureSpec)+" height: "+MeasureSpec.getSize(heightMeasureSpec) );
//    //    Log.e("dxm", "onMeasure: widthMeasureSpec:"+MeasureSpec.getMode(widthMeasureSpec)+" heightMeasureSpec: "+MeasureSpec.getMode(heightMeasureSpec) );
//        setMeasuredDimension(width, height);
//    }
//
//    public int getVideoWidth() {
//        return videoWidth;
//    }
//
//    public void setVideoWidth(int videoWidth) {
//        this.videoWidth = videoWidth;
//    }
//
//    public int getVideoHeight() {
//        return videoHeight;
//    }
//
//    public void setVideoHeight(int videoHeight) {
//        this.videoHeight = videoHeight;
//    }
//
//    public static class Wrapper extends RelativeLayout implements ViewTreeObserver.OnGlobalLayoutListener {
//        private SimpleVideoView mVideoView;
//        private Uri mUri;
//        private io.vov.vitamio.MediaPlayer.OnPreparedListener mOnPreparedListener;
//        private io.vov.vitamio.MediaPlayer.OnErrorListener mOnErrorListener;
//        private io.vov.vitamio.MediaPlayer.OnCompletionListener mOnCompletionListener;
//        public Wrapper(Context context) {
//            super(context);
//            init(context);
//        }
//
//        public Wrapper(Context context, AttributeSet attrs) {
//            super(context, attrs);
//            init(context);
//        }
//
//        public Wrapper(Context context, AttributeSet attrs, int defStyleAttr) {
//            super(context, attrs, defStyleAttr);
//            init(context);
//        }
//
//        private void init(Context context) {
//            setBackgroundColor(WXResourceUtils.getColor("#ee000000"));
//            FrameLayout.LayoutParams pLayoutParams =
//                    new FrameLayout.LayoutParams(LayoutParams.WRAP_CONTENT,
//                            LayoutParams.WRAP_CONTENT);
//            pLayoutParams.gravity = Gravity.CENTER;
//            this.setLayoutParams(pLayoutParams);
//
//            getViewTreeObserver().addOnGlobalLayoutListener(this);
//        }
//        public
//        @Nullable
//        SimpleVideoView getVideoView() {
//            return mVideoView;
//        }
//
//
//
//        /**
//         * Create if not existed. Will cause request focus.
//         *
//         * @return
//         */
//        public
//        @NonNull
//        SimpleVideoView createIfNotExist() {
//            if (mVideoView == null) {
//                createVideoView();
//            }
//            return mVideoView;
//        }
//
//
//        public void setVideoURI(Uri uri) {
//            mUri = uri;
//            if (mVideoView != null) {
//                mVideoView.setVideoURI(uri);
//            }
//        }
//
//        public void start() {
//            if (mVideoView != null) {
//                mVideoView.start();
//            }
//        }
//
//        public void pause() {
//            if (mVideoView != null) {
//                mVideoView.pause();
//            }
//        }
//
//        public void stopPlayback() {
//            if (mVideoView != null) {
//                mVideoView.stopPlayback();
//            }
//        }
//
//        public void resume() {
//            if (mVideoView != null) {
//                mVideoView.resume();
//            }
//        }
//
//        public void setOnErrorListener(io.vov.vitamio.MediaPlayer.OnErrorListener l) {
//            mOnErrorListener = l;
//            if (mVideoView != null) {
//                mVideoView.setOnErrorListener(l);
//            }
//        }
//
//        public void setOnPreparedListener(io.vov.vitamio.MediaPlayer.OnPreparedListener l) {
//            mOnPreparedListener = l;
//            if (mVideoView != null) {
//                mVideoView.setOnPreparedListener(l);
//            }
//
//        }
//
//        public void setOnCompletionListener(io.vov.vitamio.MediaPlayer.OnCompletionListener l) {
//            mOnCompletionListener = l;
//            if (mVideoView != null) {
//                mVideoView.setOnCompletionListener(l);
//            }
//        }
//
//        private synchronized void createVideoView() {
//            if(mVideoView != null){
//                return;
//            }
//            Context context = getContext();
//
//            SimpleVideoView video = new SimpleVideoView(context);
//            RelativeLayout.LayoutParams videoLayoutParams =
//                     new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
////            videoLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
////            videoLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_TOP);
////            videoLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_LEFT);
////            videoLayoutParams.addRule(RelativeLayout.ALIGN_PARENT_RIGHT);
//            video.setLayoutParams(videoLayoutParams);
//            video.invalidate();
//            addView(video, 0);//first child
//            video.setOnErrorListener(mOnErrorListener);
//            video.setOnPreparedListener(mOnPreparedListener);
//            video.setOnCompletionListener(mOnCompletionListener);
//
//            mVideoView = video;
//
//            if(mUri != null) {
//                setVideoURI(mUri);
//            }
//        }
//
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
//
//        @Override
//        public void onGlobalLayout() {
//            if(createVideoViewIfVisible()){
//                removeSelfFromViewTreeObserver();
//            }
//        }
//
//    }

}
