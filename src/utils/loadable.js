import React from "react";
import { Spin } from 'antd';
import Loadable from "react-loadable";

// import './index.less'

// 加载动画
const loadingComponent = () => {
  return <div className={'spin-loading'}>
    <div><Spin size="large" /></div>
  </div>;
};

// 当不传加载动画时候使用默认的加载动画
// eslint-disable-next-line import/no-anonymous-default-export
export default (loader, loading = loadingComponent) => {
  return Loadable({
    loader,
    loading,
  });
}
