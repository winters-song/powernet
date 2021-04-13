import EventEmitter from 'events'
import * as d3 from 'd3'
import chinaJSON from './china_geojson_mini.json'
import proninceJSON from './china_geojson_edit.json'


export default class ChinaMap extends EventEmitter{
  constructor(el) {
    super()
    this.el = el

    Object.assign(this, {
      width : this.el.offsetWidth,
      height : this.el.offsetHeight,
      margin : 15,
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

  getLinkData(nodes, links){
    let map = {}
    nodes.forEach(item => {
      map[item.id] = item
    })
    
    let list = []
    links.forEach(item => {
      list.push({
        source: map[item.from], 
        target: map[item.to]
      })
    })
    
    return list
  }

  initParams() {
    let {width, height, margin} = this

    this.svg.attr("viewBox", [0, 0, width, height]);
    this.projection = d3.geoMercator()
      .center([107,37]) //地图中心位置,107是经度，31是纬度
      .scale(800) //设置缩放量
      .translate([width/2, height/2]);


  }

  initShadow(){
    let filter = this.svg.append('defs')
      .append('filter')
      .attr('id', 'mapShadow')

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3);

    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('result', 'offsetBlur')

    filter.append('feFlood')
      .attr("in", "offsetBlur")
      .attr("flood-color",'#fff')
      .attr("flood-opacity", 1)
      .attr("result", "offsetColor");

    filter.append('feComposite')
      .attr("in", "offsetColor")
      .attr("in2", "offsetBlur")
      .attr("operator", "in")
      .attr("result", "offsetBlur");

    let feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur')
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic')
  }

  init(){
    let me = this
    this.svg = d3.create("svg")
    this.g = this.svg.append('g')
    this.initParams()
    this.initShadow()

    function zoomed(event) {
      me.g.attr("transform", event.transform)
    }

    const zoom = d3.zoom()
      .on("zoom", zoomed);
  
    this.path = d3.geoPath().projection(this.projection);
    this.svg.call(zoom)

    const node = this.svg.node();
    this.el.appendChild(node)
    this.inited = true
  }

  render(data) {
    let me = this

    let {projection} = this

    //地图轮廓
    this.g.append("g")
      .selectAll("path")
      .data(chinaJSON.features)
      .join('path')
      .attr("d", this.path)
      .attr("fill", 'transparent')
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 1)
      // .attr("title", d => d.properties.name)
      .style("filter", `url(#mapShadow)`);

    // 省份轮廓
    this.g.append("g")
      .selectAll("path")
      .data(proninceJSON.features)
      .join('path')
      .attr("d", this.path)
      .attr("fill", 'transparent')
      .attr("stroke", "#fff")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 0.5)
      .attr("title", d => d.properties.name)
      .attr("stroke-dasharray", 3)
    //
    const linkData = this.getLinkData(data.nodes, data.links)

    this.g.append("g")
      .selectAll("line")
      .data(linkData)
      .join("line")
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .attr("x1", d => projection(d.source.pos)[0])
      .attr("y1", d => projection(d.source.pos)[1])
      .attr("x2", d => projection(d.target.pos)[0])
      .attr("y2", d => projection(d.target.pos)[1])

    this.g.append("g")
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
        .attr("class", "city-node")
        .attr("cx", d => projection(d.pos)[0])
        .attr("cy", d => projection(d.pos)[1])
        .attr("r", d => d.value*0.05)
    .attr("fill", d => {
      if(d.value< 200) return '#09f'
      return '#fa0'
    })

    this.g.append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
        .attr("fill", "#fff")
        .attr("x", d => projection(d.pos)[0])
        .attr("y", d => projection(d.pos)[1])
        .attr("dx", d => '-1em')
        .attr("dy", d => '-1.5em')
        .text(d => `${d.name}:${d.value}`)

  }
}