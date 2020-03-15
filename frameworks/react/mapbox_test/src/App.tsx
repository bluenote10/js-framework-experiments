import React, { Component } from 'react';
import { Layout, Menu } from "antd";
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

interface AppState {
  data: Array<{
    name: string,
    subs: Array<{
      name: string,
      tileServer: string,
    }>,
  }>,
  selectedDataset: number,
  selectedSub: number,
}

class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      data: [
        {
          name: "A",
          subs: [
            {
              name: "A1",
              tileServer: "https://a.tile.openstreetmap.de/{z}/{x}/{y}.png",
            },
            {
              name: "A2",
              tileServer: "http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
            },
            {
              name: "A3",
              tileServer: "https://a.tile.openstreetmap.de/{z}/{x}/{y}.png",
            },
          ]
        },
        {
          name: "B",
          subs: [
            {
              name: "B1",
              tileServer: "https://a.tile.openstreetmap.de/{z}/{x}/{y}.png",
            },
            {
              name: "B2",
              tileServer: "http://tile.thunderforest.com/transport/{z}/{x}/{y}.png",
            },
          ]
        }
      ],
      selectedDataset: 0,
      selectedSub: 0,
    }
  }

  render() {
    return (
      <Layout>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              selectedKeys={["" + this.state.selectedDataset]}
              onSelect={(item) => this.setState({
                selectedDataset: parseInt(item.key),
                selectedSub: 0,
              })}
            >
              {this.state.data.map((dataset, i) => <Menu.Item key={i}>{dataset.name}</Menu.Item>)}
            </Menu>
          </Sider>
          <Sider width={200}>
            <Menu
              mode="inline"
              style={{ height: '100%', borderRight: 0 }}
              selectedKeys={["" + this.state.selectedSub]}
              onSelect={(item) => this.setState({
                selectedSub: parseInt(item.key),
              })}
            >
              {this.state.data[this.state.selectedDataset].subs.map((sub, i) => <Menu.Item key={i}>{sub.name}</Menu.Item>)}
            </Menu>
          </Sider>
          <Content>
            <Map tileServer={this.state.data[this.state.selectedDataset].subs[this.state.selectedSub].tileServer} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;