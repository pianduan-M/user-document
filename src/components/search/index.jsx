import React, { Component } from "react";
import { Link } from 'react-router-dom'
import { Input, Modal, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { reqSearch } from '@/api'
import PropTypes from "prop-types";
import "./index.less";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      docs: []
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
        docs: []
      })
      return
    }
    const res = await reqSearch(keyword)
    const docs = res.result
    // 高亮显示
    docs.map(item => {
      const res = new RegExp(keyword, 'i')
      item.title = item.title.replace(res, `<mark>${keyword}</mark>`)
      item.desc = item.desc.replace(res, `<mark>${keyword}</mark>`)
      return item
    })

    if (res.code === 0) {
      this.setState({
        docs: docs
      })
    }
  }
  // 处理搜索框输入 函数
  handleSearch = (e) => {
    const { value } = e.target
    this.setState({
      searchValue: value
    })

    if (this.flag) return
    this.flag = true
    this.toSearch(value)
    setTimeout(() => {
      this.flag = false
    }, 200);

  }

  // 关闭搜索框
  closeSearch = () => {
    const { closeModel } = this.props;
    this.setState({
      searchValue: '',
      docs: []
    })
    closeModel()
  }

  componentDidMount() {
    this.props.createInputRef(this.inputRef);
  }


  render() {
    const { isSearch } = this.props;
    const { searchValue, docs } = this.state
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
        {docs.length > 0 ? (
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
