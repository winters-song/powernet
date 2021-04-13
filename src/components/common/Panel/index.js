import React, {Component} from 'react'
import './index.less'
import PieChart from '../../chart/PieChart'
import HBarChart from '../../chart/HBarChart'
import StackBarChart from "../../chart/StackBarChart";
import * as chartData from '../../../assets/mock/chartData'
import {CHART_TYPE} from "../../chart/Constants";


function chartFactory(el, type){
  const map = {}
  map[CHART_TYPE.PIE] = PieChart
  map[CHART_TYPE.H_BAR] = HBarChart
  map[CHART_TYPE.STACK_BAR] = StackBarChart

  if(map[type]){
    return new map[type](el)
  }
  console.warn('图表类型不存在')
  return null
}

export default class Panel extends Component {

  constructor(props){
    super(props)

    this.state = {
      autoUpdate: false
    }
    this.chartRef = React.createRef()
  }

  componentDidMount() {
    let {chartType} = this.props
    this.chart = chartFactory(this.chartRef.current, chartType)

    this.updateChart(this.chart, chartType)
  }

  updateChart(chart, type) {

    if(!this.chart){
      return
    }

    function update() {
      let data = []
      if(type === CHART_TYPE.PIE){
        data = chartData.getPieData()
      }else if(type === CHART_TYPE.H_BAR){
        data = chartData.getPieData()
      }else if(type === CHART_TYPE.STACK_BAR){
        data = chartData.getStackBarData()
      }
      chart.render(data)
    }

    if(this.state.autoUpdate){

      setInterval(() => {
        update()
      },2000)
    }
    update()
  }

  render() {
    
    const style = Object.assign({}, this.props.style ||{})

    return (
      <div className="panel" style={style}>
        <header>
          <div className="title">Chart Name</div>
        </header>
        <main ref={this.chartRef}>

        </main>
      </div>
    )
  }
}