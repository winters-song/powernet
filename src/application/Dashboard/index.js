import React, {Component} from 'react'
import './index.less'
import Header from '../../components/common/Header'
import Panel from '../../components/common/Panel'
import Graph from '../../components/common/Graph'

export default class Dashboard extends Component {
  render() {
    return (
      <div id="dashboard">
        <Header />

        <div className="main">
          <div className="sidebar sidebar-left">
            <Panel chartType="pie" />
            <Panel  />
          </div>
          <div className="center">
            <Graph />
          </div>
          <div className="sidebar sidebar-right">
            <Panel chartType="hbar" />
            <Panel />
          </div>
        </div>
      </div>
    )
  }
}