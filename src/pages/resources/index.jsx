import React, { Component, } from 'react';
import './index.less'
import { Anchor, Row, Col } from 'antd';
import { reqResourcesCate } from '@/api'
const { Link } = Anchor;


function randomColor() {
  const r = Math.random() * 255
  const g = Math.random() * 255
  const b = Math.random() * 255
  const a = Math.random() * 1
  return `rgba(${r}, ${g}, ${b},${a})`
}

class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourcesCate: []
    }
  }
  handleClick = (e) => {
    e.preventDefault();
  }

  // 后台请求
  getResourcesCate = async () => {
    const res = await reqResourcesCate()
    if (res.code === 0) {
      this.setState({
        resourcesCate: res.data
      })
    }
  }

  componentDidMount() {
    this.getResourcesCate()
  }
  render() {
    const { resourcesCate } = this.state
    return (
      <div className="resources">
        <div className="resources_container">
          <div className="resources_sider">
            <Anchor bounds={20} affix={false} getContainer={() => document.querySelector('.resources')} onClick={this.handleClick} >

              {resourcesCate.map(item => (
                <li key={item.name} >
                  <Link href={'#' + item.name} title={item.name}></Link>
                </li>
              ))}
            </Anchor>
          </div>
          <div className="resources_main">
            {resourcesCate.map(res => (
              <div className="resources_card" key={res.name} id={res.name} >
                <h2 className="category_title"><strong>{res.name}</strong></h2>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="resources_list">
                  {res.children.map(item => (<Col xs={12} sm={12} md={8} lg={8} xl={8} key={item.id} >
                    <a href={item.url} className="resources_item"  key={item.id}> <div className="imgwap">
                      {
                        item.imageUrl ? <img src={item.imageUrl} alt="" /> : <div style={{ background: randomColor() }} >{item.name}</div>
                      }
                    </div>
                      <div className="item_info">
                        <h3 className="title">{item.name}</h3>
                        <div className="desc">{item.desc}</div>
                      </div></a>
                  </Col>))}


                </Row>
              </div>
            ))}

          </div>
        </div>
      </div>
    );
  }
}

export default Resources;