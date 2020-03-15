import React, { Component } from 'react';
import { Button, DatePicker, Layout, Menu, Slider } from "antd";
import styled from '@emotion/styled'
import "antd/dist/antd.css";

import Map from "./Map"

const Header = Layout.Header;
const Sider = Layout.Sider;
const Footer = Layout.Footer;
const Content = Layout.Content;

const StyledDiv = styled.div`
  margin-left: 100px;
`

class App extends Component {
  render() {
    return (
      <Layout>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
            </Menu>
          </Sider>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
            </Menu>
          </Sider>
          <Content>
            <Map />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;