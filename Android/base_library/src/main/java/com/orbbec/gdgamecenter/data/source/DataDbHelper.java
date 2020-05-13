package com.orbbec.gdgamecenter.data.source;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.orbbec.gdgamecenter.data.source.DataPersistenceContract.AdEntry;
import com.orbbec.gdgamecenter.data.source.DataPersistenceContract.ColumnsContentEntry;
import com.orbbec.gdgamecenter.data.source.DataPersistenceContract.ColumnsEntry;
import com.orbbec.gdgamecenter.data.source.DataPersistenceContract.NoticeEntry;
import com.orbbec.gdgamecenter.data.source.DataPersistenceContract.PersonCenterEntry;


/**
 * @author chaijingjing
 * @date 2018/6/5
 */
public class DataDbHelper extends SQLiteOpenHelper {

    public static final String DATABASE_NAME = "Data.db";

    public static final int DATABASE_VERSION = 1;

    private static final String TEXT_TYPE = " TEXT";

    private static final String INTEGER_TYPE = " INTEGER";

    private static final String COMMA_SEP = ",";

    private static final String SQL_CREATE_COLUMNS_ENTRIES = "CREATE TABLE " + ColumnsEntry.TABLE_NAME + " (" +
            ColumnsEntry._ID + TEXT_TYPE + " PRIMARY KEY," +
            DataPersistenceContract.COLUMN_NAME_TYPE + TEXT_TYPE + " UNIQUE" + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_DESCRIPTION + TEXT_TYPE + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_TIME + INTEGER_TYPE +
            " )";

    private static final String SQL_CREATE_NOTICES_ENTRIES = "CREATE TABLE " + NoticeEntry.TABLE_NAME + " (" +
            NoticeEntry._ID + TEXT_TYPE + " PRIMARY KEY," +
            DataPersistenceContract.COLUMN_NAME_TYPE + TEXT_TYPE + " UNIQUE" + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_DESCRIPTION + TEXT_TYPE + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_TIME + INTEGER_TYPE +
            " )";

    private static final String SQL_CREATE_COLUMNSCOTENTS_ENTRIES = "CREATE TABLE " + ColumnsContentEntry.TABLE_NAME + " (" +
            ColumnsContentEntry._ID + TEXT_TYPE + " PRIMARY KEY," +
            DataPersistenceContract.COLUMN_NAME_TYPE + TEXT_TYPE + " UNIQUE" + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_DESCRIPTION + TEXT_TYPE + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_TIME + INTEGER_TYPE +
            " )";


    private static final String SQL_CREATE_ADS_ENTRIES = "CREATE TABLE " + AdEntry.TABLE_NAME + " (" +
            AdEntry._ID + TEXT_TYPE + " PRIMARY KEY," +
            DataPersistenceContract.COLUMN_NAME_TYPE + TEXT_TYPE + " UNIQUE" + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_DESCRIPTION + TEXT_TYPE + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_TIME + INTEGER_TYPE +
            " )";

    private static final String SQL_CREATE_PERSONCENTER_ENTRIES = "CREATE TABLE " + PersonCenterEntry.TABLE_NAME + " (" +
            ColumnsEntry._ID + TEXT_TYPE + " PRIMARY KEY," +
            DataPersistenceContract.COLUMN_NAME_TYPE + TEXT_TYPE + " UNIQUE" + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_DESCRIPTION + TEXT_TYPE + COMMA_SEP +
            DataPersistenceContract.COLUMN_NAME_TIME + INTEGER_TYPE +
            " )";

    public DataDbHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(SQL_CREATE_COLUMNS_ENTRIES);
        db.execSQL(SQL_CREATE_NOTICES_ENTRIES);
        db.execSQL(SQL_CREATE_COLUMNSCOTENTS_ENTRIES);
        db.execSQL(SQL_CREATE_ADS_ENTRIES);
        db.execSQL(SQL_CREATE_PERSONCENTER_ENTRIES);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }
}
