import React, {Component} from 'react'
import logoImg from '../assets/logo.png'
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';


export default class Header extends Component {
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item icon={<DownOutlined />} disabled>
          <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item disabled>
          <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
            3rd menu item
          </a>
        </Menu.Item>
        <Menu.Item danger>a danger item</Menu.Item>
      </Menu>
    );
    
    return (
      <header id="header">
        <img className="logo" src={logoImg} alt=""/>

        <div className="filters">
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              空间选项 <DownOutlined />
            </a>
          </Dropdown>

          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              时间选项 <DownOutlined />
            </a>
          </Dropdown>

          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              展示选项 <DownOutlined />
            </a>
          </Dropdown>
        </div>

        <ul className="navigation">
          <li className="active">首页</li>
          <li>运行模拟</li>
          <li>统计&分析</li>
        </ul>
      </header>
    )
  }
}