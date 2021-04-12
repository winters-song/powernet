
export function getPieData () {

  const arr = [{
    id: 1, name: '北京', value: 20
  },{
    id: 2, name: '四川', value: 20
  },{
    id: 3, name: '新疆', value: 20
  },{
    id: 4, name: '湖北', value: 20
  },{
    id: 5, name: '上海', value: 20
  },{
    id: 6, name: '河北', value: 20
  }]

  let newArr = []
  let total = 0

  arr.forEach(item => {
    if(Math.random() < 0.8){
      let value = Math.floor(Math.random() * 100) + 1
      newArr.push(Object.assign({}, item, {value}))
      total+=value
    }
  })

  return newArr
}

export function getMapData () {
  return {
    nodes: [{ id: 1, name: '北京', value: 200, pos: [116.4, 40]}, 
        { id: 2, name: '重庆', value: 80, pos: [117, 29]},
        { id: 3, name: '上海', value: 150, pos: [121,31]},
       { id: 4, name: '沈阳', value: 100, pos: [123,41]}],
    links: [{from: 1, to: 2}, {from: 1, to: 3}, {from: 1, to: 4}]
  }
}