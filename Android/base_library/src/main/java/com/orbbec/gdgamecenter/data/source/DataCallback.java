package com.orbbec.gdgamecenter.data.source;

import java.util.List;

/**
 * @author chaijingjing
 * @date 2018/6/4
 */
public interface DataCallback<T> {

    void onDataLoaded(List<T> data);

    void onDataNotAvailable();
}
