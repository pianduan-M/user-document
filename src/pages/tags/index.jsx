import React, { Component } from 'react';
import Card from '@/components/card/Card'
import { reqSearchByTag } from '@/api'
import './index.less'

class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [],
      total: 0,
      keyword: ''
    }
    const { keyword } = props.match.params
    this.getDocments(keyword)
  }
  getDocments = async (keyword) => {
    const res = await reqSearchByTag(keyword)
    if (res.code === 0) {
      const { docs, total } = res.result
      this.setState({
        docs,
        total,
        keyword
      })
    }
  }

  render() {
    const { docs, keyword } = this.state
    return (
      <div className="tags_container" >
        <div className="tags_header">
          <h1>{keyword +':  '+ docs.length +' 篇' }</h1>
        </div>
        <div className="tags_main">
          <Card data={docs} />
        </div>
      </div>
    );
  }
}

export default Tags;