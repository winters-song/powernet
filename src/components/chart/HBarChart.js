import EventEmitter from 'events'
import * as d3 from 'd3'
import {legend} from '../../utils/d3/colorLegend'

export default class HBarChart extends EventEmitter{
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
        bottom: 10,
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
    let {width, height, margin} = this

    this.svg.attr("viewBox", [0, 0, width, height]);
  }

  init(){
    this.svg = d3.create("svg")

    this.initParams()

    this.legendGroup = this.svg.append("g")
    this.axisXGroup = this.svg.append("g")
    this.axisYGroup = this.svg.append("g")

    this.barGroup = this.svg.append("g")
      .attr("fill", "steelblue")

    this.textGroup = this.svg.append("g")
      // .attr("fill", "white")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)

    const node = this.svg.node();
    this.el.appendChild(node)
    this.initialized = true
  }

  render(data) {
    const {width, height, margin} = this

    if(data){
      //降序排列
      data = d3.sort(data, (a, b) => d3.descending(a.value, b.value))
      this.lastData = data
    }else if(this.lastData){
      data = this.lastData
    }

    const min = 0
    const max  = d3.max(data, d => d.value)

    const color = d3.scaleLinear()
      .domain([min, max])
      .range(["white", "green"])

    // legend({
    //   el: this.legendGroup,
    //   color,
    //   // title: 'legend name',
    //   width: 260,
    //   marginLeft: 40,
    //   tickValues: d3.range(0, max+1 , Math.floor(max))
    // })

    const t = this.svg.transition().duration(this.animDuration);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([margin.left, width - margin.right])

    const y = d3.scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([margin.top, height - margin.bottom])
      .padding(0.1)

    const xAxis = g => g
      .attr("class", "axis")
      .attr("transform", `translate(0,${margin.top})`)
      .call(d3.axisTop(x).ticks(width / 80))
      .call(g => g.select(".domain").remove())

    const yAxis = g => g
      .attr("class", "axis")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(d3.axisLeft(y).tickFormat(i => data[i].name).tickSizeOuter(0))


    this.barGroup
      .selectAll("rect")
      .data(data, d => d.data.id)
      .join("rect")
      .call(el => el.transition(t)
        .attr("fill", d => color(d.value))
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth())
      )
    
    this.textGroup
      .selectAll("text")
      .data(data, d => d.data.id)
      .join("text")
        .attr("x", d => x(d.value))
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -4)
        .text(d => d.value)
        .attr("fill", "black")
      .call(text => text.filter(d => x(d.value) - x(0) < 20) // short bars
        .attr("dx", +8)
        .attr("fill", "white")
      )

    this.axisXGroup.call(xAxis);
    this.axisYGroup.call(yAxis);

  }
}