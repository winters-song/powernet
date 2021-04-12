import React, {Component} from 'react'
import './index.less'
import PieChart from '../../chart/PieChart'
import HBarChart from '../../chart/HBarChart'
import * as chartData from '../../../assets/mock/chartData'
export default class Panel extends Component {

  constructor(props){
    super(props)

    this.chartRef = React.createRef()
  }

  componentDidMount() {
    let {chartType} = this.props
    if(chartType == 'pie'){
      this.chart = new PieChart(this.chartRef.current)
    }
    if(chartType == 'hbar'){
      this.chart = new HBarChart(this.chartRef.current)
    }
    this.updateChart(this.chart, chartType)
  }

  updateChart(chart, type) {

    if(!this.chart){
      return
    }

    function update() {
      let data = []
      if(type == 'pie'){
        data = chartData.getPieData()
      }else if(type == 'hbar'){
        data = chartData.getPieData()
      }
      chart.render(data)
    }
    // setInterval(() => {
    //   update()
    // },2000)
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