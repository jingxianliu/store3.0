package com.orbbec.gdgamecenter.component;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.MediaPlayer;
import android.media.ThumbnailUtils;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.bumptech.glide.Glide;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.adapter.URIAdapter;
import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.dom.WXDomObject;
import com.taobao.weex.ui.component.WXComponent;
import com.taobao.weex.ui.component.WXComponentProp;
import com.taobao.weex.ui.component.WXVContainer;
import com.taobao.weex.utils.WXUtils;

//import io.vov.vitamio.Vitamio;
//import io.vov.vitamio.widget.VideoView;


/**
 * @author Altair
 * @date 2018/11/23
 */

public class SimpleVideo extends WXComponent<RelativeLayout> {
    public SimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent, String instanceId, boolean isLazy) {
        super(instance, dom, parent, instanceId, isLazy);
    }

    public SimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent, boolean isLazy) {
        super(instance, dom, parent, isLazy);
    }

    public SimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent) {
        super(instance, dom, parent);
    }

    public SimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent, int type) {
        super(instance, dom, parent, type);
    }
//    private SimpleVideoView view;
//    private final static String TAG = "simpleVideo";
//    private static String videoPath ;
//    private boolean mAutoplay = true;
//    private boolean mOnTop = false;
//    private Context mContext;
//    private ImageView imgv;
//
//    public SimpleVideo(WXSDKInstance instance, WXDomObject dom, WXVContainer parent) {
//        super(instance, dom, parent);
//    }
//
//    @Override
//    protected RelativeLayout initComponentHostView(@NonNull Context context) {
//        final SimpleVideoView.Wrapper video = new SimpleVideoView.Wrapper(context);
//        mContext = context;
//        view = video.createIfNotExist();
//        view.setZOrderOnTop(mOnTop);
//        view.setZOrderMediaOverlay(mOnTop);
//      //  view.setVideoQuality(io.vov.vitamio.MediaPlayer.VIDEOQUALITY_HIGH);
//        video.setOnErrorListener(new io.vov.vitamio.MediaPlayer.OnErrorListener() {
//
//            @Override
//            public boolean onError(io.vov.vitamio.MediaPlayer mp, int what, int extra) {
//
//                Log.e(TAG, "onError: " );
//                return true;
//            }
//        });
//
//        video.setOnPreparedListener(new io.vov.vitamio.MediaPlayer.OnPreparedListener() {
//
//            @Override
//            public void onPrepared(io.vov.vitamio.MediaPlayer mediaPlayer) {
//
//            }
//        });
//
//        video.setOnCompletionListener(new io.vov.vitamio.MediaPlayer.OnCompletionListener() {
//
//            @Override
//            public void onCompletion(io.vov.vitamio.MediaPlayer mediaPlayer) {
//
//            }
//        });
//        return video;
//    }


//    @WXComponentProp(name="setPath")
//    public void setPath(String path){
//        final WXSDKInstance instance = getInstance();
//        if(path == null){
//            return;
//        }
//        videoPath = path;
//        Log.e(TAG, "SetPath ");
//        view.setVideoURI(instance.rewriteUri(Uri.parse(videoPath),URIAdapter.VIDEO));
//        if(mAutoplay){
//            view.start();
//            view.setOnPreparedListener(new io.vov.vitamio.MediaPlayer.OnPreparedListener() {
//
//                @Override
//                public void onPrepared(io.vov.vitamio.MediaPlayer mp) {
//                    view.start();
//                }
//            });
//        }
//        else{
//            Thread thread = new Thread(new Runnable() {
//                @Override
//                public void run() {
//                    //在子线程中执行任务，执行完成或需要通知UI线程时调用以下方法
//                    long start = System.currentTimeMillis();
//                    // FFmpegMediaMetadataRetriever retriever = new FFmpegMediaMetadataRetriever();
//                    try {
//                        //  retriever.setDataSource(videoPath); //file's path
//                        //   Bitmap bitmap = retriever.getFrameAtTime(100000,FFmpegMediaMetadataRetriever.OPTION_CLOSEST_SYNC );  //这个时间就是第一秒的
//                       // Bitmap bitmap = ThumbnailUtils.createVideoThumbnail(videoPath,MediaStore.Images.Thumbnails.MINI_KIND);
//                      //  final Drawable drawable = new BitmapDrawable(bitmap);
//
//                        new Handler(Looper.getMainLooper()){
//                            @Override
//                            public void handleMessage(Message msg) {
//                                super.handleMessage(msg);
//                                int what = msg.what;
//                                if(what == 0){
//                                    //在主线程中需要执行的操作，一般是UI操作
//                                    Glide.with(mContext.getApplicationContext()).load(videoPath + ".jpg").into(imgv);
//
//                                }
//                            }
//                        }.sendEmptyMessage(0);
//
//                    } catch (Exception e) {
//                        e.printStackTrace();
//                    }
//                    finally{
//                        //    retriever.release();
//                    }
//                    Log.e(TAG, "setPath: "+(System.currentTimeMillis()-start) );
//
//                }
//            });
//            thread.start();

//        }

//            view.setOnCompletionListener(new io.vov.vitamio.MediaPlayer.OnCompletionListener() {
//
//                @Override
//                public void onCompletion(io.vov.vitamio.MediaPlayer mp) {
//                  //  mp.reset();
//                    //   mp.release();
//                  //  view.setVideoURI(instance.rewriteUri(Uri.parse(videoPath),URIAdapter.VIDEO));
//                    view.seekTo(1);
//                    view.start();
//                }
//            });


//    }

//    @WXComponentProp(name="setAutoplay")
//    public void setAutoplay(boolean autoplay){
//        mAutoplay = autoplay;
//    }

//    @WXComponentProp(name="onTop")
//    public void onTop(boolean onTopFlag){
//        Log.e(TAG, "onTop ");
//        mOnTop = onTopFlag;
////        view.setZOrderMediaOverlay(mOnTop);
//    }
//
//    @JSMethod
//    public void restart(){
//        Log.e(TAG, "restart ");
       // view.stopPlayback();
//        view.setVideoPath(videoPath);
//        view.start();
//    }

//    @JSMethod
//    public void applyChange(){
//        Log.e(TAG, "refresh ");
//        view.requestLayout();
//        view.invalidate();
//    }


//    @JSMethod
//    public void pause(){
//        Log.e(TAG, "pause ");
        //view.stopPlayback();
//        view.pause();
//    }

//    @JSMethod
//    public void stop(){
//        Log.e(TAG, "stop video ");
//        view.stopPlayback();
        //view.pause();
//    }

//    @JSMethod
//    public void resume(){
//        Log.e(TAG, "resume ");
        //view.resume();
//        view.start();
//    }

//    @JSMethod
//    public void offTop(){
//        Log.e(TAG, "offTop ");
        //view.resume();
//        view.setZOrderOnTop(false);
//        view.setZOrderMediaOverlay(false);
//    }

//    @JSMethod
//    public void overrideAutoplay(){
//        view.setOnPreparedListener(new io.vov.vitamio.MediaPlayer.OnPreparedListener() {
//
//            @Override
//            public void onPrepared(io.vov.vitamio.MediaPlayer mp) {
//                mAutoplay = false;
//                return;
//            }
//        });
//    }

}
