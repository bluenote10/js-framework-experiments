import React from 'react';
import { Button } from 'antd';
import './App.css';
import { Layout, Row, Col } from 'antd';

import Settings from "./Settings";

import * as octokit from "./octokit";

const { Header, Footer, Sider, Content } = Layout;

// octokit.getData()

const App = () => (
  /*
  <Layout>
    <Content><Settings/></Content>
  </Layout>
  */
  <Row justify="center">
    <Col md={18} xl={12}>
      <Settings/>
    </Col>
</Row>
);

export default App;
