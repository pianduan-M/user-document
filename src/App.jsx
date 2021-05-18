import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
// 清除默认样式
import './assets/css/minireset.css'
// iconfont 样式
import './assets/css/iconfont.css'
import Layout from './pages/layout'
import { Provider } from 'react-redux'
import store from './redux/store'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Layout />
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;