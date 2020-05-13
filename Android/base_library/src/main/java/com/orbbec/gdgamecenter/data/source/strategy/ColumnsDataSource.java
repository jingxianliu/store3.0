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
import com.orbbec.gdgamecenter.data.source.bean.Columns;
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
import static com.orbbec.gdgamecenter.data.source.DataPersistenceContract.ColumnsEntry.TABLE_NAME;

/**
 * @author chaijingjing
 * @date 2018/6/4
 */
public class ColumnsDataSource implements StrategyDataSource {

    private static ColumnsDataSource INSTANCE;

    private Context mContext;
    private DataDbHelper mDbHelper;

    private ColumnsDataSource(Context context) {
        mContext = context;
        mDbHelper = new DataDbHelper(context);
    }

    public static ColumnsDataSource getInstance(Context context) {
        if (INSTANCE == null) {
            synchronized (ColumnsDataSource.class) {
                if (INSTANCE == null) {
                    INSTANCE = new ColumnsDataSource(context);
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

        List<Columns> items = null;
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
                    items = gson.fromJson(description, new TypeToken<ArrayList<Columns>>() {
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

        /*try {
            JSONObject result = new JSONObject("{\"total_pages\": 1, \"objects\": [{\"code\": \"a746ddf3-1951-49c8-8eb4-3069d4353bc6\", \"type\": \"recommend\", \"id\": 112, \"sequence\": 1, \"name\": \"\\u63a8\\u8350\"}, {\"code\": \"fb0062f0-a1bd-4afe-9035-6281ccdc8afd\", \"type\": \"column\", \"id\": 113, \"sequence\": 2, \"name\": \"\\u6559\\u80b2\"}, {\"code\": \"67e1465a-1253-410b-8a58-0ae47c92ed13\", \"type\": \"column\", \"id\": 114, \"sequence\": 3, \"name\": \"\\u4eb2\\u5b50\"}, {\"code\": \"9a5c03ae-3870-4969-9885-bd0c1529bdd6\", \"type\": \"column\", \"id\": 115, \"sequence\": 4, \"name\": \"\\u5065\\u5eb7\"}, {\"code\": \"a194851d-d079-4f0e-aba2-19f8ec53c1e4\", \"type\": \"column\", \"id\": 116, \"sequence\": 5, \"name\": \"\\u5a31\\u4e50\"}, {\"code\": \"857d08d7-6a6d-44e2-a3e3-61186bb64c7f\", \"type\": \"personal_center\", \"id\": 117, \"sequence\": 99, \"name\": \"\\u4e2a\\u4eba\\u4e2d\\u5fc3\"}], \"num_results\": 6, \"page\": 1}");
            Log.d("person_center_btn_bg", "result:" + result.toString());
            Type type = new TypeToken<ArrayList<Columns>>() {
            }.getType();

            JSONArray objects = result.optJSONArray("objects");

            String json = objects.toString();

            String description = json.toString();
            parseDisplayItems(description, type, callback);
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        //todo 測試
        ServerHelper.requestColumnsData(code, new Callback.CommonCallback<JSONObject>() {
            @Override
            public void onSuccess(JSONObject result) {
                try {
                    LogUtils.d("person_center_btn_bg", "result:" + result.toString());
                    Type type = new TypeToken<ArrayList<Columns>>() {
                    }.getType();

                    JSONArray objects = result.optJSONArray("objects");

                    String json = objects.toString();

                    String description = json.toString();
                    parseDisplayItems(description, type, callback);
                } catch (Exception e) {
                    e.printStackTrace();
                }
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
        boolean yanghua = !TextUtils.isEmpty(description) && type != null;
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
