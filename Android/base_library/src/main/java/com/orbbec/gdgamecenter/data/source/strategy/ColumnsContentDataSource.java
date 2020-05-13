package com.orbbec.gdgamecenter.data.source.strategy;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.text.TextUtils;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.orbbec.gdgamecenter.data.source.DataCallback;
import com.orbbec.gdgamecenter.data.source.DataDbHelper;
import com.orbbec.gdgamecenter.data.source.StrategyDataSource;
import com.orbbec.gdgamecenter.data.source.bean.ColumnsContents;
import com.orbbec.gdgamecenter.network.ServerHelper;
import com.orbbec.gdgamecenter.utils.LogUtils;
import com.orbbec.utils.XLog;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xutils.common.Callback;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import static com.orbbec.gdgamecenter.data.source.DataPersistenceContract.COLUMN_NAME_DESCRIPTION;
import static com.orbbec.gdgamecenter.data.source.DataPersistenceContract.COLUMN_NAME_TIME;
import static com.orbbec.gdgamecenter.data.source.DataPersistenceContract.COLUMN_NAME_TYPE;
import static com.orbbec.gdgamecenter.data.source.DataPersistenceContract.ColumnsContentEntry.TABLE_NAME;

/**
 * @author chaijingjing
 * @date 2018/6/4
 */
public class ColumnsContentDataSource implements StrategyDataSource {
    private static ColumnsContentDataSource INSTANCE;

    private Context mContext;
    private DataDbHelper mDbHelper;

    private ColumnsContentDataSource(Context context) {
        mContext = context;
        mDbHelper = new DataDbHelper(context);
    }

    public static ColumnsContentDataSource getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (ColumnsContentDataSource.class) {
                if (INSTANCE == null) {
                    INSTANCE = new ColumnsContentDataSource(context);
                }
            }
        }

        return INSTANCE;
    }

    @Override
    public void getLocalData(String dataType, DataCallback callback) {
        SQLiteDatabase db = mDbHelper.getReadableDatabase();

        String[] projection = {
                COLUMN_NAME_DESCRIPTION,
                COLUMN_NAME_TIME
        };

        String selection = COLUMN_NAME_TYPE + " LIKE ?";
        String[] selectionArgs = {dataType};

        Cursor c = db.query(TABLE_NAME, projection, selection, selectionArgs, null, null, null);

        List<ColumnsContents> items = null;
        String description = null;

        if (c != null && c.getCount() > 0) {
            c.moveToFirst();
            description = c.getString(c.getColumnIndexOrThrow(COLUMN_NAME_DESCRIPTION));
        }

        if (c != null) {
            c.close();
        }

        if (db != null) {
            db.close();
        }

        if (!TextUtils.isEmpty(description)) {
            try {
                JSONObject jsonObject = new JSONObject(description);
                if (jsonObject != null) {
                    Gson gson = new Gson();
                    LogUtils.d("person_center_btn_bg", "result:" + description);
                    items = gson.fromJson(description, new TypeToken<ArrayList<ColumnsContents>>() {
                    }.getType());
                }
            } catch (JSONException e) {

            }
        }

        if (items != null) {
            callback.onDataLoaded(items);
        } else {
            callback.onDataNotAvailable();
        }
    }

    @Override
    public void getRemoteData(String dataType, String code, final DataCallback callback) {
        ServerHelper.requestColumnsContentsData(code, new Callback.CommonCallback<JSONObject>() {
            @Override
            public void onSuccess(JSONObject result) {
                Type type = new TypeToken<ArrayList<ColumnsContents>>() {
                }.getType();
                JSONArray objects = result.optJSONArray("objects");
                String description = objects.toString();
                parseDisplayItems(description, type, callback);
            }

            @Override
            public void onError(Throwable ex, boolean isOnCallback) {
                if (callback != null) {
                    callback.onDataNotAvailable();
                }
            }

            @Override
            public void onCancelled(CancelledException cex) {
                if (callback != null) {
                    callback.onDataNotAvailable();
                }
            }

            @Override
            public void onFinished() {
            }
        });
    }

    private void parseDisplayItems(String description, Type type, DataCallback callback) {
        List items = null;
        if (!TextUtils.isEmpty(description) && type != null) {
            Gson gson = new Gson();
            items = gson.fromJson(description, type);
        }

        if (items != null) {
            callback.onDataLoaded(items);
        } else {
            callback.onDataNotAvailable();
        }
    }

    @Override
    public void saveData(String dataType, List data) {
        if (data == null) {
            XLog.w(null, "save displayItems error, data is null");
            return;
        }

        Gson gson = new Gson();
        String description = gson.toJson(data);

        SQLiteDatabase db = mDbHelper.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(COLUMN_NAME_TYPE, dataType);
        values.put(COLUMN_NAME_DESCRIPTION, description);
        db.replace(TABLE_NAME, null, values);

        db.close();
    }

    @Override
    public void refreshData(String dataType) {

    }

    @Override
    public void deleteData(String dataType) {

    }
}
