package com.orbbec.gdgamecenter.data.source;

import android.provider.BaseColumns;

/**
 * @author chaijingjing
 * @date 2018/6/5
 */
public class DataPersistenceContract {

    public static final String COLUMN_NAME_TYPE = "type";
    public static final String COLUMN_NAME_DESCRIPTION = "description";
    public static final String COLUMN_NAME_TIME = "time";

    public static abstract class ColumnsEntry implements BaseColumns {

        public static final String TABLE_NAME = "columns_table";
    }

    public static abstract class ColumnsContentEntry implements BaseColumns {

        public static final String TABLE_NAME = "columns_content_table";
    }

    public static abstract class AdEntry implements BaseColumns {

        public static final String TABLE_NAME = "ad_table";
    }

    public static abstract class NoticeEntry implements BaseColumns {

        public static final String TABLE_NAME = "notice_table";
    }

    public static abstract class PersonCenterEntry implements BaseColumns {

        public static final String TABLE_NAME = "personcenter_table";
    }
}
