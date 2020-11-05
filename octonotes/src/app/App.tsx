import React from 'react';
import { Button } from 'antd';
import './App.css';
import { Layout } from 'antd';

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
  <Settings/>
);

export default App;
