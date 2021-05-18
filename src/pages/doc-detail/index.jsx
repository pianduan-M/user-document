import React, { Component } from "react";
import "./index.less";
import { reqDocumentDetail } from '@/api'
import QcEventEmitter from '@/utils/QcEventEmitter.js'
import { Anchor } from 'antd';

const { Link } = Anchor;

class DocDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doc: {},
      active: ''
    };
  }
  static propTypes = {};
  // 创建菜单
  getDocumentDetail = async (id) => {
    const res = await reqDocumentDetail(id)
    if (res.code === 0) {
      this.setState({
        doc: res.data,
        isOpen: false // 移动端 控制菜单栏显示隐藏
      })
    }
  }

  // 移动端 切换菜单栏
  toggleSideBar = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  // 菜单点击
  menuListClick = (title) => {
    return () => {
      this.setState({
        active: title,
        isOpen: false
      })
    }
  }
  componentDidMount() {
    const { id } = this.props.match.params
    this.getDocumentDetail(id)
    // 监听事件总线
    QcEventEmitter.addListener("toggleSideBar", this.toggleSideBar)

  }

  componentWillUnmount() {
    QcEventEmitter.removeListener("toggleSideBar", this.toggleSideBar)
  }

  render() {
    const { doc, active, isOpen } = this.state;

    // 创建左侧菜单函数
    const createMenuNode = (menuList) => {
      if (menuList instanceof Array) {
        return (
          <ul>
            {menuList.map((item, index) => (
              <li key={item.id}>
                {[
                  item.level === '1' ? <h3 key={index} > <Link className={item.id === active ? 'active' : ''} onClick={this.menuListClick(item.id)} href={"#" + item.id} style={{ marginLeft: 10 * item.level }} title={item.title} ></Link></h3> : '',
                  item.level === '2' ? <h4 key={index} > <Link className={item.id === active ? 'active' : ''} onClick={this.menuListClick(item.id)} href={"#" + item.id} style={{ marginLeft: 10 * item.level }} title={item.title}  ></Link></h4> : '',
                  item.level > 2 ? <Link key={index} href={"#" + item.id} style={{ marginLeft: 10 * item.level }} title={item.title} ></Link> : ''
                ]
                }
              </li>
            ))
            }
          </ul >
        );
      }
    }

    return (
      <div className="document_detail" onClick={this.toggleSideBar} >
        <div
          className="document_main"  >
          <h1 className="document_title">{doc.title}</h1>
          <div className="docment_content" dangerouslySetInnerHTML={{ __html: doc.content }}>

          </div>
        </div>

        <Anchor affix={false} className={'document_sideMenu' + (isOpen ? " open" : '')} >
          {doc.menuList && createMenuNode(doc.menuList)}
        </Anchor>
      </div>
    );
  }
}

export default DocDetail;
