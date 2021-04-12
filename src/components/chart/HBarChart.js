import EventEmitter from 'events'
import * as d3 from 'd3'

export default class HBarChart extends EventEmitter{
  constructor(el) {
    super()
    this.el = el

    Object.assign(this, {
      width : this.el.offsetWidth,
      height : this.el.offsetHeight,
      margin : 30,
      animDuration: 500,
      inited: false
    })

    // window.addEventListener('resize', () => {
    //   this.resizeTimer && clearTimeout(this.resizeTimer)
    //   this.resizeTimer = setTimeout(() => {
    //     this.resize()
    //   }, 100)
    // })

    this.init()
  }


  initParams() {
    let {width, height, margin} = this

    this.svg.attr("viewBox", [0, 0, width, height]);

  }

  init(){
    this.svg = d3.create("svg")
    this.initParams()

    this.axisXGroup = this.svg.append("g")
    this.axisYGroup = this.svg.append("g")

    const node = this.svg.node();
    this.el.appendChild(node)
    this.inited = true
  }

  render(data) {
    let me = this
    const {width, height, margin} = this

    //降序排列
    data = d3.sort(data, (a, b) => d3.descending(a.value, b.value))


    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([margin, width - margin])

    const y = d3.scaleBand()
      .domain(d3.range(data.length))
      .rangeRound([margin, height - margin])
      .padding(0.1)

    const xAxis = g => g
      .attr("class", "axis")
      .attr("transform", `translate(0,${margin})`)
      .call(d3.axisTop(x).ticks(width / 80))
      .call(g => g.select(".domain").remove())

    const yAxis = g => g
      .attr("class", "axis")
      .attr("transform", `translate(${this.margin},0)`)
      .call(d3.axisLeft(y).tickFormat(i => data[i].name).tickSizeOuter(0))


    // const t = this.svg.transition().duration(this.animDuration);


    this.axisXGroup.call(xAxis);
    this.axisYGroup.call(yAxis);

  }
}