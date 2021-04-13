import EventEmitter from 'events'
import * as d3 from 'd3'

export default class PieChart extends EventEmitter{
  constructor(el) {
    super()
    this.el = el

    Object.assign(this, {
      width : this.el.offsetWidth,
      height : this.el.offsetHeight,
      margin : 15,
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

    const t = this.svg.transition().duration(this.animDuration);

    this.pathGroup
      .selectAll("path")
      // .attr("d", this.arc)
      .call(el => el.transition(t)
        .attr("d", this.arc)
      )

    this.textGroup
      .selectAll("text")
      // .attr("transform", d => `translate(${this.arcLabel.centroid(d)})`)
      .call(el => el.transition(t)
        .attr("transform", d => `translate(${this.arcLabel.centroid(d)})`)
      )
  }

  initParams() {
    let {width, height, margin} = this

    this.svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

    const radius = Math.min(width, height) / 2 - margin
    const labelRadius = radius * 0.7
    // pie的path路径
    this.arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    this.arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
  }

  init(){
    this.svg = d3.create("svg")
    this.initParams()

    this.pie = d3.pie()
      .sort(null)
      .value(d => d.value)

    this.pathGroup = this.svg.append("g")
      .attr("stroke", "white")

    this.textGroup = this.svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")

    const node = this.svg.node();
    this.el.appendChild(node)
    this.initialized = true
  }

  render(data) {
    const arcs = this.pie(data);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.id))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

    const t = this.svg.transition().duration(this.animDuration);

    this.pathGroup
      .selectAll("path")
      .data(arcs, d => d.data.id)
      .join("path")
      .attr("class", "pie")
      .attr("fill", d => color(d.data.id))
      .attr("d", this.arc)
      // .call(el => el.transition(t)
      //   .attr("d", this.arc)
      // )
      .each( function(d) {
        const node = d3.select(this)
        let title = node.select("title")
        if(!title.node()){
          title = node.append("title")
        }
        title.text(d => `${d.data.name}: ${d.data.value}`);
      })


    this.textGroup
      .selectAll("text")
      .data(arcs, d => d.data.id)
      .join("text")
      .call(el => el.transition(t)
        .attr("transform", d => `translate(${this.arcLabel.centroid(d)})`)
      )
      // .attr("transform", d => `translate(${this.arcLabel.centroid(d)})`)
      .each(function(d) {
        const node = d3.select(this)
        let nameEl = node.select("tspan.name")
        if(!nameEl.node()){
          nameEl = node.append("tspan").attr('class', 'name')
        }
        nameEl
          .attr("y", "-0.4em")
          .attr("font-weight", "bold")
          .text(d => d.data.name)

        if(d.endAngle - d.startAngle > 0.25) {
          let labelEl = node.select("tspan.label")
          if(!labelEl.node()) {
            labelEl = node.append("tspan").attr('class', 'label')
          }
          labelEl.attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value);
        }
      })

  }
}