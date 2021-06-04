import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { Input, Modal, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { reqSearch } from '@/api'
import PropTypes from "prop-types";
import debounce from '@/utils/debounce.js'
import "./index.less";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      docs: [],
      collects: []
    };
    this.inputRef = React.createRef();
  }
  static propTypes = {
    isSearch: PropTypes.bool.isRequired,
    closeModel: PropTypes.func.isRequired,
    createInputRef: PropTypes.func.isRequired,
  };

  // 后台搜索 函数
  toSearch = async (keyword) => {
    if (!keyword) {
      this.setState({
        docs: [],
        collects: []
      })
      return
    }
    const res = await reqSearch(keyword)
    const { docs, collectArticles } = res.result
    // 高亮显示
    docs && docs.map(item => {
      const res = new RegExp(keyword, 'i')
      item.title = item.title.replace(res, `<mark>${keyword}</mark>`)
      item.desc = item.desc.replace(res, `<mark>${keyword}</mark>`)
      return item
    })

    collectArticles && collectArticles.map(item => {
      const res = new RegExp(keyword, 'i')
      item.name = item.name.replace(res, `<mark>${keyword}</mark>`)
      item.desc = item.desc.replace(res, `<mark>${keyword}</mark>`)
      return item
    })

    if (res.code === 0) {
      this.setState({
        docs: docs,
        collects: collectArticles
      })
    }
  }
  // 处理搜索框输入 函数
  handleSearch = (e) => {
    const { value } = e.target
    this.setState({
      searchValue: value
    })

    this.debounceFn(value)
  }

  // 关闭搜索框
  closeSearch = () => {
    const { closeModel } = this.props;
    this.setState({
      searchValue: '',
      docs: [],
      collects: []
    })
    closeModel()
  }

  componentDidMount() {
    this.props.createInputRef(this.inputRef);
    // 防抖函数
    this.debounceFn = debounce(this.toSearch, 200)
  }


  render() {
    const { isSearch } = this.props;
    const { searchValue, docs, collects } = this.state
    return (
      <Modal
        forceRender
        zIndex={99999}
        title={
          <span style={{ display: "flex" }}>
            <Input
              value={searchValue}
              size="large"
              allowClear
              ref={this.inputRef}
              prefix={<SearchOutlined />}
              onChange={this.handleSearch}

            />
            <Button
              size="large"
              type="text"
              className="close_btn"
              onClick={this.closeSearch}
            >
              取消
            </Button>
          </span>
        }
        visible={isSearch}
        closable={false}
        footer={null}
        wrapClassName="search_wrap"
        onCancel={this.closeSearch}
        bodyStyle={{ paddingTop: 0, minHeight: 400, overflow: 'hidden' }}
      >
        {(docs.length || collects.length) > 0 ? (
          <div className="result_main">
            <div className="row">文档</div>
            <ul className="result_list">
              {docs.map(doc => (
                <li key={doc.id} onClick={this.closeSearch} >
                  <Link to={'/doc-detail/' + doc.id}>
                    <div className="result_item">
                      <div className="result_icon">
                        <span className="iconfont icon-caidan"></span>
                      </div>
                      <div className="result_content">
                        <span className="result_title text_hidden" dangerouslySetInnerHTML={{ __html: doc.title }} ></span>
                        <span className="result_desc text_hidden" dangerouslySetInnerHTML={{ __html: doc.desc }}></span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="collectAtr-wrap">
              <div className="row">收藏文章</div>
              <ul className="result_list">
                {collects.map(collect => (
                  <li key={collect.id} onClick={this.closeSearch} >
                    <a href={collect.url}>
                      <div className="result_item">
                        <div className="result_icon">
                          <span className="iconfont icon-caidan"></span>
                        </div>
                        <div className="result_content">
                          <span className="result_title text_hidden" dangerouslySetInnerHTML={{ __html: collect.title }} ></span>
                          <span className="result_desc text_hidden" dangerouslySetInnerHTML={{ __html: collect.desc }}></span>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : <div className="search_help">
          <span>No recent searches</span>
        </div>
        }

      </Modal>
    );
  }
}

export default Search;
