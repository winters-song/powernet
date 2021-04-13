import EventEmitter from 'events'
import * as d3 from 'd3'
import {swatches} from '../../utils/d3/colorLegend'
import ReactDOM from 'react-dom';

export default class StackBarChart extends EventEmitter{
  constructor(el) {
    super()
    this.el = el

    Object.assign(this, {
      width : this.el.offsetWidth,
      height : this.el.offsetHeight,
      margin: {
        left: 40,
        top: 20,
        right: 10,
        bottom: 30,
      },
      animDuration: 500,
      initialized: false
    })

    window.addEventListener('resize', () => {
      this.resizeTimer && clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.resize()
      }, 100)
    })

    this.init()
  }

  resize() {
    if(!this.initialized){
      return
    }
    let width = this.el.offsetWidth
    let height = this.el.offsetHeight
    if(width === this.width && height === this.height){
      return
    }
    this.width = width
    this.height = height

    this.initParams()
    this.render()
  }

  initParams() {
    let {width, height} = this

    this.svg.attr("viewBox", [0, 0, width, height]);
  }

  init(){
    this.svg = d3.create("svg")

    this.initParams()

    this.axisXGroup = this.svg.append("g")
    this.axisYGroup = this.svg.append("g")

    this.barGroup = this.svg.append("g")

    const node = this.svg.node();
    this.el.appendChild(node)

    this.legendGroup = document.createElement('div')
    this.legendGroup.className = 'swatches'
    this.el.appendChild(this.legendGroup)
    this.initialized = true
  }

  render(data) {
    let me = this
    const {width, height, margin} = this

    let series
    if(!data && this.lastData){
      data = this.lastData
    }else{
      this.lastData = data
    }
    series = d3.stack()
      .keys(data.columns)(data)
      .map(d => (d.forEach(v => v.key = d.key), d))
    this.lastSeries = series

    let color = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc")

    let legend = swatches({color, columns: "180px", format})
    ReactDOM.render(
      legend,
      this.legendGroup
    )

    function format(i){
      const index = data.columns.indexOf(i)
      return data.columns_zh[index]
    }

    const x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .rangeRound([height - margin.bottom, margin.top])

    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove())

    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call(g => g.selectAll(".domain").remove())

    const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

    this.barGroup
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", (d, i) => x(d.data.name))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .append("title")
      .text(d => `${d.data.name} ${format(d.key)} ${formatValue(d.data[d.key])}`);

    this.axisXGroup.call(xAxis);
    this.axisYGroup.call(yAxis);

  }
}