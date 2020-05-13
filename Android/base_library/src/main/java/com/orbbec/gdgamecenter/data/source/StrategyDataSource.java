package com.orbbec.gdgamecenter.data.source;

import java.util.List;

/**
 * @author chaijingjing
 * @date 2018/6/5
 */
public interface StrategyDataSource {

    void getLocalData(String dataType, DataCallback callback);

    void getRemoteData(String dataType, String code, DataCallback callback);

    void saveData(String dataType, List data);

    void refreshData(String dataType);

    void deleteData(String dataType);
}
