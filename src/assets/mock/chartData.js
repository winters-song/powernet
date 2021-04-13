
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

  arr.forEach(item => {
    if(Math.random() < 0.8){
      let value = Math.floor(Math.random() * 100) + 1
      newArr.push(Object.assign({}, item, {value}))
    }
  })

  return newArr
}

export function getStackBarData() {
  const arr = [{
    id: 1, name: '北京', fire: 20, wind: 20, water: 20, nuclear: 20, light: 20
  },{
    id: 2, name: '四川', fire: 20, wind: 20, water: 20, nuclear: 20, light: 20
  },{
    id: 3, name: '新疆', fire: 20, wind: 20, water: 20, nuclear: 20, light: 20
  },{
    id: 4, name: '湖北', fire: 20, wind: 20, water: 20, nuclear: 20, light: 20
  },{
    id: 5, name: '上海', fire: 20, wind: 20, water: 20, nuclear: 20, light: 20
  },{
    id: 6, name: '河北', fire: 20, wind: 20, water: 20, nuclear: 20, light: 20
  }]

  let newArr = []

  arr.forEach(item => {
    newArr.push(Object.assign({}, item, {
      fire: Math.floor(Math.random() * 100) + 1,
      wind: Math.floor(Math.random() * 100) + 1,
      water: Math.floor(Math.random() * 100) + 1,
      nuclear: Math.floor(Math.random() * 100) + 1,
      light: Math.floor(Math.random() * 100) + 1,
    }))
  })

  newArr.columns = ['fire', 'wind', 'water', 'nuclear', 'light']
  newArr.columns_zh = ['火电', '风电', '水电', '核电', '光电']

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