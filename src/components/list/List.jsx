import React, { Component } from "react";
import PropTypes from "prop-types";
import formateDate from "@/utils/formatDate.js";
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';

import './index.less'

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static propTypes = {
    data: PropTypes.array.isRequired,
    myStyle: PropTypes.object
  };
  render() {
    return (
      <QueueAnim type="scale" duration={1000} interval={0} className="home_posts_list" style={this.props.myStyle}>
        {this.props.data.map((item) => (
          <div className="list_item item_shadow" key={item.id} >
            {/* 文档标题 */}
            <h3 className="item__title"> <Link to={'/doc-detail/' + item.id}>
              {item.title}
            </Link></h3>
            <div className="item_desc">
              <p className="item_desc_text">{item.desc}</p>
            </div>
            {/* tag time 容器 */}
            <div className="item_footer">
              <div className="item__tags_wrap" >
                {item.tags.length > 0 ? <span className="tags_icon iconfont icon-biaoqian"></span> : null}
                {item.tags.map((tag) => (
                  <a className="tag" key={tag} href={"/tags/" + tag}>
                    {tag}
                  </a>
                ))}
              </div>
              <div className="doc_create_time">
                {formateDate(item.createTime)}
              </div>
            </div>
          </div>
        ))}
      </QueueAnim>
    );
  }
}

export default List;
