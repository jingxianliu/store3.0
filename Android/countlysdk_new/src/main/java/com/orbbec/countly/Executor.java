package com.orbbec.countly;

import android.content.ContentUris;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Message;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;
import org.xutils.http.RequestParams;
import org.xutils.x;

import ly.count.android.sdk.Countly;

/**
 * @author tanzhuohui
 * @date 2018/12/17
 */
public class Executor extends HandlerThread {

    private Handler handler;
    public static final int BEGIN = 0x00;
    public static final int END = 0x01;
    public static final int HEART = 0x02;
    public static final int CRASHES = 0x03;
    public static final int OPERATE = 0x04;
    public static final int HELP = 0x05;
    public static final int EVENT = 0x06;
    public static final int PAY = 0x07;


    public static final String PORT_BEGIN = "begin";
    public static final String PORT_END = "end";
    public static final String PORT_HEART = "heart";
    public static final String PORT_CRASHES = "crashes";
    public static final String PORT_OPERATE = "operate";
    public static final String PORT_EVENT = "event";
    public static final String PORT_PAY = "pay";

    public Executor(String name) {
        super(name);
        start();
        initHandler();
    }

    private void initHandler() {
        handler = new Handler(getLooper()) {
            @Override
            public void handleMessage(Message msg) {
                // TODO: 2018/12/18 处理方法
                switch (msg.what) {
                    case BEGIN:
                        get(PORT_BEGIN , (String) msg.obj);
                        break;
                    case HEART:
                        get(PORT_HEART , (String) msg.obj);
                        Message message = new Message();
                        message.what = msg.what;
                        message.obj = msg.obj;
                        handler.sendMessageDelayed(message , 60000);
                        break;
                    case END:
                        removeCallbacksAndMessages(null);
                        get(PORT_END , (String) msg.obj);
                        break;
                    case CRASHES:
                        get(PORT_CRASHES , (String) msg.obj);
                        break;
                    case EVENT:
                        get(PORT_EVENT , (String) msg.obj);
                        break;
                    case PAY:
                        get(PORT_PAY , (String) msg.obj);
                        break;
                    case HELP:
                    case OPERATE:
                        get(PORT_OPERATE , (String) msg.obj);
                        break;
                    default:
                        break;
                }
            }
        };
    }

    public static class Instance {
        public static Executor executor = new Executor("executor");
    }

    public static Executor getInstance() {
        return Instance.executor;
    }

    public void sendMessages(int port, String data) {
        Message message = new Message();
        message.what = port;
        message.obj = data;
        handler.sendMessage(message);
    }

    public void sendMessagesDelay(int port, String data , int delay) {
        Message message = new Message();
        message.what = port;
        message.obj = data;
        handler.sendMessageDelayed(message , delay);
    }

    public void removeMessage(int what){
        handler.removeMessages(what);
    }

    private void get(final String port , String data){
        String ip = "http://117.48.231.54:11095/" + port + "?" + data;
        final RequestParams params = new RequestParams(ip);
        if(Countly.sharedInstance().isLoggingEnabled()) {
            Log.d("countly_new", "get: " + params.getUri());
        }
        x.http().get(params, new Callback.CommonCallback<String>() {
            @Override
            public void onSuccess(String result) {
                if(Countly.sharedInstance().isLoggingEnabled()) {

                    Log.d("countly_new", "onSuccess: " + result);
                }
                if(params.getUri().contains(PORT_HEART)){
                    try {
                        JSONObject object = new JSONObject(result);
                        if(object.optInt("code") == -1){
                            handler.removeCallbacksAndMessages(null);
                            CountlyUtils.getInstance().sendBeginAgain();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
                if(Countly.sharedInstance().isLoggingEnabled()) {
                    Log.d("countly_new", "onError: " + ex.getMessage());
                }
            }

            @Override
            public void onCancelled(CancelledException cex) {
                if(Countly.sharedInstance().isLoggingEnabled()) {
                    Log.d("countly_new", "onCancelled: ");
                }
            }

            @Override
            public void onFinished() {
                if(Countly.sharedInstance().isLoggingEnabled()) {
                    Log.d("countly_new", "onFinished: ");
                }

                if(port.equals(END)){
                    System.exit(0);
                }
            }
        });
    }

}
