import React, {Component} from 'react'
import './index.less'
import Header from '../../components/common/Header'
import Panel from '../../components/common/Panel'
import Graph from '../../components/common/Graph'
import {CHART_TYPE} from "../../components/chart/Constants";

export default class Dashboard extends Component {
  render() {
    return (
      <div id="dashboard">
        {/*<Header />*/}

        <div className="main">
          <div className="sidebar sidebar-left">
            {/*<Panel chartType={CHART_TYPE.PIE} />*/}
            {/*<Panel  />*/}
          </div>
          <div className="center">
            {/*<Graph />*/}
          </div>
          <div className="sidebar sidebar-right">
            {/*<Panel chartType={CHART_TYPE.H_BAR} />*/}
            <Panel chartType={CHART_TYPE.STACK_BAR}/>
          </div>
        </div>
      </div>
    )
  }
}