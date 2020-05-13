package com.orbbec.gdgamecenter.activity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.ColorDrawable;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;


import com.bumptech.glide.Glide;
import com.bumptech.glide.load.DecodeFormat;
import com.bumptech.glide.request.RequestOptions;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.utils.NetUtils;
import com.orbbec.gdgamecenter.library.R;
import com.orbbec.gdgamecenter.WXApplication;
import com.orbbec.gdgamecenter.data.source.DataCallback;
import com.orbbec.gdgamecenter.data.source.bean.Ads;
import com.orbbec.gdgamecenter.data.source.bean.GDGameCenterInfo;
import com.orbbec.gdgamecenter.data.source.strategy.AdDataSource;
import com.orbbec.gdgamecenter.data.source.strategy.NoticeDataSource;
import com.orbbec.gdgamecenter.network.ServerConstants;
import com.orbbec.gdgamecenter.network.ServerHelper;
import com.orbbec.gdgamecenter.utils.ActivityHelper;
import com.orbbec.gdgamecenter.utils.Config;
import com.orbbec.gdgamecenter.utils.UpdateService;
import com.orbbec.gdgamecenter.utils.Utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class MLaunchActivity extends AppCompatActivity {

    private static final int DEFAULT_MSC = 2;
    private static final int LAUNCH_HANDLER_MSG = 101;
    //private Banner mLaunchBannerView;
    private ImageView mLaunchImageView;
    private TextView mMscTextView;
    private LinearLayout mMscTextGroup;
    public int mLauncherDevID;
    public int mLaunch_default;
    private AdDataSource mAdDataSource;
    public Class mHomeActvityClass;
    private NoticeDataSource mNoticeDataSource;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ActivityHelper.getInstance().addActivity(this);
        setContentView(R.layout.activity_launcher);
//        mLauncherDevID = R.drawable.launcher_dev;
//        mLaunch_default = R.drawable.launch_default;
//        mHomeActvityClass = HomeActivity.class;
        initData();

        initView();

        if(Utils.getDevInstall(this)){
            obtainLaunchBannerInfo();
        }else{
            obtainCamAdBanner();
        }
        obtainGDGameCenterInfo();
      //  Intent intent = new Intent(this , HomeActivity.class);
      //  startActivity(intent);
    }

    /**
     * 获取广告
     */
    private void obtainLaunchBannerInfo() {
        //todo 网络请求启动界面的数据
        if (!NetUtils.networkCanUse(this)) {
            mAdDataSource.getLocalData(Config.TYPE_ADS, mAdsDataCallback);
        } else {
            mAdDataSource.getRemoteData(Config.TYPE_ADS, "", mAdsDataCallback);
            //mAdDataSource.getLocalData(Config.TYPE_ADS, mAdsDataCallback);
        }
    }

    private void obtainCamAdBanner() {
        //todo 本地无摄像头启动广告页
        obtainNoDeviceBannerInfoSuccess();
    }

    private void obtainNoDeviceBannerInfoSuccess() {
        if (mLaunchImageView == null) {
            return;
        }
        RequestOptions requestOptions = new RequestOptions()
                .format(DecodeFormat.PREFER_RGB_565)
                .placeholder(new ColorDrawable(0x224367FF));
        Glide.with(this).applyDefaultRequestOptions(requestOptions).load(mLauncherDevID).into(mLaunchImageView);
        //initBanner();
        sendHandlerUI(DEFAULT_MSC);
    }

    /**
     * 获取数据源
     */
    private void initData() {
        mAdDataSource = AdDataSource.getInstance(this);
        mNoticeDataSource = NoticeDataSource.getInstance(this);
    }

    /**
     * 初始话view
     */
    private void initView() {
        //mLaunchBannerView = (Banner) findViewById(R.id.launch_banner);
        mLaunchImageView = (ImageView) findViewById(R.id.imageview) ;
        mMscTextView = (TextView) findViewById(R.id.msc_text);
        mMscTextGroup = (LinearLayout) findViewById(R.id.msc_text_content);
    }

    private Handler mHandler = new Handler(new Handler.Callback() {
        @Override
        public boolean handleMessage(Message message) {
            switch (message.what) {
                case LAUNCH_HANDLER_MSG:
                    handlerUI(message);
                    break;
                default:
                    break;
            }
            return false;
        }
    });

    /**
     * 跟新UI
     *
     * @param message
     */
    private void handlerUI(Message message) {
        if (mMscTextView == null) {
            return;
        }
        int msc = (int) message.obj;
        if (msc == 0) {
            //todo 跳转activity
            LogUtils.d("person_center_btn_bg", "跳转activity");
            startActivity(initType());
            finish();
        } else {
            mMscTextView.setText(String.valueOf(--msc));
            Message msg = mHandler.obtainMessage(LAUNCH_HANDLER_MSG);
            msg.obj = msc;
            mHandler.sendMessageDelayed(msg, 1000);
        }

    }


    /**
     * 判断类型
     */
    private Intent initType() {
        String action = getIntent().getStringExtra(Config.ACTION_TYPE);
        String actionName = getIntent().getStringExtra(Config.ACTION_NAME);
        LogUtils.d("action_type", "initType: " + action);
        LogUtils.d("actionName", "actionName: " + actionName);
        if (TextUtils.isEmpty(action)) {
            if(!TextUtils.isEmpty(actionName)){
                Intent intent = new Intent(this,mHomeActvityClass);
                intent.putExtra(Config.ACTION_NAME, actionName);
                return intent;
            }
            return new Intent(this, mHomeActvityClass);
        } else {
            Intent intent = new Intent(this,mHomeActvityClass);
            switch (action) {
                case Config.TYPE_APP:
                    intent.putExtra(Config.ACTION_TYPE, action);
                    intent.putExtra(Config.APP_PACKAGENAME, getIntent().getStringExtra(Config.APP_PACKAGENAME));
                    break;
                case Config.TYPE_POSTER:
                    intent.putExtra(Config.ACTION_TYPE, action);
                    break;
                case Config.TYPE_ACTIVITY:
                    intent.putExtra(Config.ACTION_TYPE , action);
                default:
                    break;
            }
            return intent;
        }
    }

    private DataCallback mAdsDataCallback = new DataCallback<Ads>() {
        @Override
        public void onDataLoaded(List<Ads> data) {
            obtainBannerInfoSuccess(parseImgUrls(data), DEFAULT_MSC);
        }

        @Override
        public void onDataNotAvailable() {
            obtainBannerInfoFail();
        }
    };

    /**
     * 获取banner数据成功
     *
     * @param imgUrl 需要展示的banner的网络url
     * @param msc    展示的时间，单位是秒
     */
    private void obtainBannerInfoSuccess(List<String> imgUrl, int msc) {
        if (mLaunchImageView == null) {
            return;
        }
        LogUtils.d("tzh", "obtainBannerInfoSuccess: " + imgUrl);
        RequestOptions requestOptions = new RequestOptions()
                .format(DecodeFormat.PREFER_RGB_565)
                .placeholder(new ColorDrawable(0x224367FF));
        Glide.with(this).applyDefaultRequestOptions(requestOptions).load(imgUrl.get(0)).into(mLaunchImageView);
        sendHandlerUI(msc);
    }

    /**
     * 获取banner数据失败
     */
    private void obtainBannerInfoFail() {
        LogUtils.e("dxm", "obtainBannerInfoFail: " );

        if (mLaunchImageView == null) {
            return;
        }
        RequestOptions requestOptions = new RequestOptions()
                .format(DecodeFormat.PREFER_RGB_565)
                .placeholder(new ColorDrawable(0x224367FF));
        Glide.with(this).applyDefaultRequestOptions(requestOptions).load(mLaunch_default).into(mLaunchImageView);
        sendHandlerUI(DEFAULT_MSC);

    }


    /**
     * 跟新UI秒
     */
    private void sendHandlerUI(final int msc) {
        if (mMscTextView != null) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mMscTextView.setText(String.valueOf(msc));
                    mMscTextGroup.setVisibility(View.VISIBLE);
                }
            });
        }

        Message message = mHandler.obtainMessage(LAUNCH_HANDLER_MSG);
        message.obj = msc;
        mHandler.sendMessageDelayed(message, 1000);

    }

    /**
     * 获取ad的url的集合
     *
     * @param data
     */
    private ArrayList<String> parseImgUrls(List<Ads> data) {
        ArrayList<String> imgUrls = new ArrayList<>();
        for (int i = 0; i < data.size(); i++) {
            List<Ads.Ad> datas = data.get(i).ad;
            for (int j = 0; j < datas.size(); j++) {
                Ads.Ad ad = datas.get(j);
                imgUrls.add(ServerConstants.APP_HOST + ad.image_url);
            }
        }

        return imgUrls;
    }

    /**
     * 获取本身的版本信息
     */


    private void obtainGDGameCenterInfo() {
        ServerHelper.requestGdGameCenterInfo(mUpdateInfoCallback);
    }

    private Callback.CommonCallback<JSONObject> mUpdateInfoCallback = new Callback.CommonCallback<JSONObject>() {
        @Override
        public void onSuccess(JSONObject result) {
            if (result != null) {
                try {
                    JSONArray objects = result.optJSONArray("objects");

                    JSONObject json = objects.getJSONObject(0);

                    Type type = new TypeToken<GDGameCenterInfo>() {
                    }.getType();
                    Gson gson = new Gson();
                    GDGameCenterInfo info = gson.fromJson(json.toString(), type);
                    LogUtils.d("dxm",json.toString());
                    SharedPreferences sp = getSharedPreferences(Config.SP_NAME, MODE_PRIVATE);
                    sp.edit().putString(Config.APP_CODE, info.code).commit();
                    WXApplication.getContext().setInfo(info);
                    PackageManager pm  = WXApplication.getContext().getPackageManager();
                    try {
                        PackageInfo packageInfo = pm.getPackageInfo(getPackageName(), 0);
                        if(packageInfo.versionCode<(info.app.version_code)){
                            UpdateService.startDownload(WXApplication.getContext(), info.app.package_name, ServerConstants.APP_HOST+info.app.app_url, info.app.state);
                        }
                    }catch (PackageManager.NameNotFoundException e){
                        e.printStackTrace();
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }


        }

        @Override
        public void onError(Throwable ex, boolean isOnCallback) {

        }

        @Override
        public void onCancelled(CancelledException cex) {

        }

        @Override
        public void onFinished() {

        }
    };

    @Override
    protected void onStop() {
        super.onStop();
        Glide.get(this).clearMemory();
    }
}
