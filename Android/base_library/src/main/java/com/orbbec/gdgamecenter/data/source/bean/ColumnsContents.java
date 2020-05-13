package com.orbbec.gdgamecenter.data.source.bean;


import java.io.Serializable;
import java.util.List;

/**
 * @author yh
 * @date 2018/6/7
 */

public class ColumnsContents implements Serializable {
    private static final long serialVersionUID = 5L;

    public String updated_timestamp;
    public String code;
    public String title;
    public List<Banner> banner;
    public List<App> app;
    public String sequence;
    public String created_timestamp;
    public String type;
    public List<Vod> vod;
    public String superscript;
    public String link;


    public class App implements Serializable {
        private static final long serialVersionUID = 1L;
        public String app_url;
        public String package_name;
        public String title;
        public List<Poster> poster;
        public String version_name;
        public String signature;
        public int version_code;
        public List<Icon> icon;
        public String file_md5;
        public String description;
        public String short_title;
        public String app_id;
        public List<Thumbnail> thumbnail;

    }

    public class Icon implements Serializable {
        private static final long serialVersionUID = 1L;
        public String image_url;
    }

    public class Poster implements Serializable {
        private static final long serialVersionUID = 1L;
        public String image_url;
    }

    public class Banner implements Serializable {
        private static final long serialVersionUID = 1L;
        public String image_url;
    }

    public class Thumbnail implements Serializable {
        private static final long serialVersionUID = 1L;
        public String image_url;
    }

    // /vod/240dd61ae965a376cb864bda0ecb5ff5.mp4
    public class Vod implements Serializable {
        private static final long serialVersionUID = 1L;
        public String streaming_name;
        public String vod_url;
    }
}
