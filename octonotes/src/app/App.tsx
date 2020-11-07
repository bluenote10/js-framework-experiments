import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

import { Row, Col, Layout, Menu } from 'antd';

import { EditOutlined, SettingOutlined } from '@ant-design/icons';

import styled from '@emotion/styled'

import * as repo_utils from "./repo"
import Settings from "./Settings";
import Notes from "./Notes";


// const { Header, Content, Footer, Sider } = Layout;
const { Content } = Layout;


const ContentStyled = styled(Content)`
  background: #FFF;
`


enum Page {
  Main = "main",
  Settings = "settings",
}


function App() {

  const [page, setPage] = useState(Page.Main)
  const [repos, setRepos] = useState(repo_utils.getStoredRepos());

  useEffect(() => {
    // console.log("Storing repos:", repos)
    repo_utils.setStoredRepos(repos);
  }, [repos]);

  return (
    <Layout>
      {/* Theoretically the menu should be wrapped in <Header> but I prefer the smaller sized menu */}
      <Row justify="center" style={{background: "#001529"}}>
        <Col md={18} xl={12}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[page]}
            onClick={evt => setPage(evt.key as Page)}
          >
            <Menu.Item key={Page.Main} icon={<EditOutlined/>}>
              Notes
            </Menu.Item>
            <Menu.Item key={Page.Settings} icon={<SettingOutlined/>}>
              Settings
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
      <ContentStyled>
        <Row justify="center">
          <Col md={18} xl={12}>
            {(
              page === Page.Main
              ? <Notes/>
              : <Settings repos={repos} setRepos={setRepos}/>
            )}
          </Col>
        </Row>
      </ContentStyled>
    </Layout>
  );
}

export default App;
