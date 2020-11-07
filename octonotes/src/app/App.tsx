import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

import { Row, Col } from 'antd';
// const { Layout, Header, Footer, Sider, Content } = Layout;

import * as repo_utils from "./repo"
import Settings from "./Settings";

// import * as octokit from "./octokit";
// octokit.getData()


function App() {

  const [repos, setRepos] = useState(repo_utils.getStoredRepos());

  useEffect(() => {
    // console.log("Storing repos:", repos)
    repo_utils.setStoredRepos(repos);
  }, [repos]);

  return (
    /*
    <Layout>
      <Content><Settings/></Content>
    </Layout>
    */
    <Row justify="center">
      <Col md={18} xl={12}>
        <Settings repos={repos} setRepos={setRepos}/>
      </Col>
    </Row>
  );
}

export default App;
