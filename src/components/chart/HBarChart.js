import EventEmitter from 'events'
import * as d3 from 'd3'

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
        bottom: 10
      },
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

    this.barGroup = this.svg.append("g")
      .attr("fill", "steelblue")

    this.textGroup = this.svg.append("g")
      // .attr("fill", "white")
      .attr("text-anchor", "end")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)

    const node = this.svg.node();
    this.el.appendChild(node)
    this.inited = true
  }

  render(data) {
    let me = this
    const {width, height, margin} = this

    //降序排列
    data = d3.sort(data, (a, b) => d3.descending(a.value, b.value))

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.id))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())


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
      .data(data)
      .join("rect")
      .call(el => el.transition(t)
        .attr("fill", d => color(d.id)) 
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth())
      )
        // .attr("x", x(0))
        // .attr("y", (d, i) => y(i))
        // .attr("width", d => x(d.value) - x(0))
        // .attr("height", y.bandwidth());
    
    this.textGroup
      .selectAll("text")
      .data(data)
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
        // .attr("text-anchor", "start"));


    this.axisXGroup.call(xAxis);
    this.axisYGroup.call(yAxis);

  }
}