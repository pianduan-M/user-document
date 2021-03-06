import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
// 清除默认样式
import './assets/css/minireset.css'
// markdown 样式
import 'github-markdown-css'
// iconfont 样式
import './assets/css/iconfont.css'
import Layout from './pages/layout'
import { Provider } from 'react-redux'
import store from './redux/store'
import ScrollToTop from './components/scrollToTop/scroll-to-top'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <ScrollToTop>
            <Layout />
          </ScrollToTop>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;