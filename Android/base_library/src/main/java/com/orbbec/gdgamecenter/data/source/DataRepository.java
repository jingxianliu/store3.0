package com.orbbec.gdgamecenter.data.source;

import android.content.Context;

import com.orbbec.utils.NetUtils;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.orbbec.gdgamecenter.utils.Utils.checkNotNull;

/**
 * @author chaijingjing
 * @date 2018/6/4
 */
public class DataRepository implements DataSource {
    private static DataRepository INSTANCE = null;

    private Context mContext;
    /**
     * TODO: 2017/1/23 key 需要重新定义
     */
    private Map<String, Object> mCacheData;

    /**
     * 标记缓存失效
     */
    private Map<String, Boolean> mCacheIsDirty;

    private DataRepository(Context context) {
        mContext = context;
    }

    public static DataRepository getInstance(Context context) {
        checkNotNull(context);
        if (INSTANCE == null) {
            synchronized (DataRepository.class) {
                if (INSTANCE == null) {
                    INSTANCE = new DataRepository(context);
                }
            }
        }

        return INSTANCE;
    }

    @Override
    public void getData(final StrategyDataSource dataSource, final String dataType, final String code, final DataCallback callback) {
        checkNotNull(callback);
        if (mCacheData != null && !mCacheIsDirty.get(dataType)) {
            String key = dataType;


            Object data = mCacheData.get(key);
            if (data != null) {
                callback.onDataLoaded((List) data);
                return;
            }
        }


        if (mCacheIsDirty.get(dataType) && NetUtils.networkCanUse(mContext)) {
            dataSource.getRemoteData(dataType, code, new DataCallback() {
                @Override
                public void onDataLoaded(List data) {
                    refreshCache(dataType, data);
                    refreshLocalDataSource(dataSource, dataType, data);
                    callback.onDataLoaded((List) mCacheData.get(dataType));
                }

                @Override
                public void onDataNotAvailable() {
                    callback.onDataNotAvailable();
                }
            });
        } else {
            dataSource.getLocalData(dataType, new DataCallback() {
                @Override
                public void onDataLoaded(List data) {
                    refreshCache(dataType, data);
                    callback.onDataLoaded(data);
                }

                @Override
                public void onDataNotAvailable() {
                    dataSource.getRemoteData(dataType, code, callback);

                }
            });

        }
    }

    private void refreshLocalDataSource(StrategyDataSource dataSource, String dataType, List datas) {
        deleteData(dataSource, dataType);
        saveData(dataSource, dataType, datas);


    }

    private void refreshCache(String key, Object datas) {
        if (mCacheData == null) {
            mCacheData = new LinkedHashMap<>();
        }

        if (mCacheIsDirty == null) {
            mCacheIsDirty = new LinkedHashMap<>();
        }

        mCacheData.remove(key);
        mCacheData.put(key, datas);

        mCacheIsDirty.put(key, false);
    }

    @Override
    public void saveData(StrategyDataSource dataSource, String dataType, List data) {
        dataSource.saveData(dataType, data);
        if (mCacheData == null) {
            mCacheData = new LinkedHashMap<>();
        }

        mCacheData.put(dataType, data);
    }

    @Override
    public void refreshData(StrategyDataSource dataSource, String dataType) {
        dataSource.refreshData(dataType);
        if (mCacheIsDirty == null) {
            mCacheIsDirty = new LinkedHashMap<>();
        }

        mCacheIsDirty.put(dataType, true);

    }

    @Override
    public void deleteData(StrategyDataSource dataSource, String dataType) {
        dataSource.deleteData(dataType);
        if (mCacheData == null) {
            mCacheData = new LinkedHashMap<>();
        }

        mCacheData.remove(dataType);
    }

    @Override
    public void deleteAllData() {

    }

    public Map<String, Object> getAllAppInfo() {
        return mCacheData;
    }

}
