package com.orbbec.gdgamecenter.network.download;

import android.database.Cursor;

import org.xutils.db.converter.ColumnConverter;
import org.xutils.db.sqlite.ColumnDbType;

/**
 *
 * @author wyouflf
 * @date 15/11/10
 */
public class DownloadStateConverter implements ColumnConverter<DownloadState> {

    @Override
    public DownloadState getFieldValue(Cursor cursor, int index) {
        int dbValue = cursor.getInt(index);
        return DownloadState.valueOf(dbValue);
    }

    @Override
    public Object fieldValue2DbValue(DownloadState fieldValue) {
        return fieldValue.value();
    }

    @Override
    public ColumnDbType getColumnDbType() {
        return ColumnDbType.INTEGER;
    }
}
