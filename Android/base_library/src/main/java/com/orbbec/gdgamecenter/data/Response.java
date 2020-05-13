package com.orbbec.gdgamecenter.data;

import com.google.gson.annotations.SerializedName;

import org.json.JSONArray;

/**
 * @author chaijingjing
 * @date 2018/6/4
 */
public class Response {

    /**
     * 查询结果数量,正整数
     */
    @SerializedName("num_results")
    public int numResults;

    /**
     * 查询结果总页数,正整数
     */
    @SerializedName("total_pages")
    public int totalPages;

    /**
     * 当前页数,正整数
     */
    @SerializedName("page")
    public int page;

    /**
     * 查询结果,JSON数组
     */
    @SerializedName("objects")
    public JSONArray objects;
}
