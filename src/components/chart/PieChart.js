import EventEmitter from 'events'
import * as d3 from 'd3'

export default class PieChart extends EventEmitter{
  constructor(el) {
    super()
    this.el = el

    this.width = this.el.offsetWidth
    this.height = this.el.offsetHeight

    window.addEventListener('resize', () => {
      this.resizeTimer && clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.resize()
      }, 400)
    })
  }

  getData() {
    return [{
      name: '北京', value: 20
    },{
      name: '四川', value: 20
    },{
      name: '新疆', value: 20
    },{
      name: '湖北', value: 20
    },{
      name: '上海', value: 20
    }]
  }

  resize() {
    let width = this.el.offsetWidth
    let height = this.el.offsetHeight
    if(width == this.width && height == this.height){
      return
    } 
    this.width = width
    this.height = height

    this.svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1)

    this.svg.selectAll(".pie").attr("d", arc)

  }

  init(){
    let {width, height} = this
    let pie = d3.pie()
      .sort(null)
      .value(d => d.value)

    const data = this.getData()

    const arcs = pie(data);

    const svg = d3.create("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height]);
    this.svg = svg

    // pie的path路径
    const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(Math.min(width, height) / 2 - 1)

    const radius = Math.min(width, height) / 2 * 0.8;
    const arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    svg.append("g")
      .attr("stroke", "white")
      .selectAll("path")
      .data(arcs)
      .join("path")
        .attr("class", "pie")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
      .append("title")
        .text(d => `${d.data.name}: ${d.data.value}`);

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value));

      const node = svg.node();
      this.el.appendChild(node)
  }
}