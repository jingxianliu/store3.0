package com.orbbec.gdgamecenter.data.source.bean;

import java.io.Serializable;
import java.util.List;

/**
 * @author yh
 * @date 2018/6/14
 */

public class PersonCenters implements Serializable {
    private static final long serialVersionUID = 5L;
    public String updated_timestamp;
    public String code;
    public List<Description> description;
    public String sequence;
    public String type;
    public String title;
    public String created_timestamp;
    public List<Banner> banner;

    public class Banner implements Serializable {
        private static final long serialVersionUID = 1L;
        public String image_url;
    }


    public class Description implements Serializable {
        private static final long serialVersionUID = 1L;
        public String content;
        public String title;
    }

}
