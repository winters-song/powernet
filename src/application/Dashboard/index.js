import React, {Component} from 'react'
import './index.less'
import Header from '../../components/common/Header'
import Panel from '../../components/common/Panel'

export default class Dashboard extends Component {
  render() {
    return (
      <div id="dashboard">
        {/*<Header />*/}

        <div className="main">
          <div className="sidebar sidebar-left">
            <Panel chartType="hbar" />
            <Panel  />
          </div>
          <div className="center">

          </div>
          <div className="sidebar sidebar-right">
            <Panel style={{opacity: 0}} />
          </div>
        </div>
      </div>
    )
  }
}