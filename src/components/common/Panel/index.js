import React, {Component} from 'react'
import './index.less'
import PieChart from '../../chart/PieChart'

export default class Panel extends Component {

  constructor(props){
    super(props)

    this.chartRef = React.createRef()
  }

  componentDidMount() {
    let {chartType} = this.props
    if(chartType == 'pie'){
      this.chart = new PieChart(this.chartRef.current)
      this.chart.init()
    }
  }

  render() {
    
    const style = Object.assign({}, this.props.style ||{})

    return (
      <div className="panel" style={style}>
        <header>
          <div className="title">chart</div>
        </header>
        <main ref={this.chartRef}>

        </main>
      </div>
    )
  }
}