package com.orbbec.gdgamecenter.data.source.bean;

import java.util.List;

/**
 * @author yh
 * @date 2018/6/7
 */

public class Ads {
    public String updated_timestamp;
    public List<Ad> ad;
    public String publish_flag;
    public String created_timestamp;
    public String type;
    public int id;

    public class Ad {
        public String image_url;
    }
}
