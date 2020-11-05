import React from 'react';

import { Collapse } from 'antd';
import { Button } from 'antd';
import { Typography } from 'antd';
import { Space } from 'antd';

import { PlusOutlined, GithubOutlined } from '@ant-design/icons';

import styled from '@emotion/styled'

const { Title } = Typography;
const { Panel } = Collapse;

const Row = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function callback(key: string|string[]) {
  console.log(key);
}

const Header = (name: string) => {
  return (
    <Space>
      <GithubOutlined />
      {name}
    </Space>
  )
}


type SettingsState = {
  repos: string[]
}

class Settings extends React.Component<{}, SettingsState> {

  constructor() {
    super({})
    this.state = {
      repos: []
    }
    this.addRepo = this.addRepo.bind(this)
  }

  addRepo() {
    this.setState({
      repos: [...this.state.repos, "new"]
    })
  }

  render() {
    return (
      <>
        <Title level={4}>Repositories</Title>
        <Collapse defaultActiveKey={[0]} onChange={callback} bordered={true}>
          {this.state.repos.map((repo, i) =>
          <Panel header={Header(repo)} key={i}>
            <p>{text}</p>
          </Panel>
          )}
        </Collapse>
        <Row>
          <Button type="primary" shape="circle" size="large" icon={<PlusOutlined />} onClick={this.addRepo}/>
        </Row>
      </>
    );
  }
}

export default Settings;
