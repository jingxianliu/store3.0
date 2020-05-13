package com.orbbec.gdgamecenter.data.source.bean;

/**
 * @author yh
 * @date 2018/6/9
 */

public class GDGameCenterInfo {

    public String code;
    public String name;
    public String sequence;
    public App app;
    public String app_id;
    public String type;
    public String id;

    public class App {
        public String app_id;
        public String app_url;
        public int state;
        public String poster_ids;
        public String package_name;
        public String title;
        public int icon_id;
        public String signature;
        public int version_code;
        public String zip_url;
        public String version_name;
        public String file_md5;
    }
}
