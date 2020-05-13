package com.orbbec.gdgamecenter.data.source;

import java.util.List;

/**
 * @author chaijingjing
 * @date 2018/6/4
 */
public interface DataSource {

    void getData(StrategyDataSource dataSource, String dataType, String code, DataCallback callback);

    void saveData(StrategyDataSource dataSource, String dataType, List data);

    void refreshData(StrategyDataSource dataSource, String dataType);

    void deleteData(StrategyDataSource dataSource, String dataType);

    void deleteAllData();
}
