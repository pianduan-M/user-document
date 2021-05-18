import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Row, Col } from "antd";
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';

import './index.less'

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    data: PropTypes.array.isRequired,
    myStyle: PropTypes.object
  };
  formateDate = (time) => {
    const dt = new Date(Number(time))
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    this.time = {
      day: d,
      yM: y + ' - ' + m
    }
  }
  render() {

    return (
      <QueueAnim type="left" delay={300} duration={1000} className="home_posts_card" style={this.props.myStyle} >
        {this.props.data.map((item) => (
          <Row className="card_item item_shadow" key={item.id} >

            <Col className="row_left" xs={24} sm={24} md={6} lg={6} xl={6}>
              <div className="item_time_wrap">
                <div className="item_time">
                  {this.formateDate(item.createTime)}
                  <span className="time_day">{this.time.day}</span>
                  <span className="time_year_month">{this.time.yM}</span>

                </div>
              </div>

            </Col>

            <Col className="row_right" xs={24} sm={24} md={18} lg={18} xl={18}>
              <h3 className="item__title"><Link to={'/doc-detail/' + item.id} >{item.title}</Link></h3>
              {item.tags.length > 0 && (<div className="item__tags_wrap">
                <span className="tags_icon iconfont icon-biaoqian"></span>
                {item.tags.map((tag) => (
                  <a className="tag" key={tag} href={"/tags/" + tag}>
                    {tag}
                  </a>
                ))}
              </div>)}
              <div className="item__desc">
                <div className="desc__label">文档描述：</div>
                <p dangerouslySetInnerHTML={{ __html: item.desc }} ></p>
              </div>
              <Button type="primary" href={'/doc-detail/' + item.id} >阅读详情</Button>
            </Col>

          </Row>
        ))}
      </QueueAnim>
    );
  }
}

export default Card;
