import React from 'react';

import { Collapse } from 'antd';
import { Button } from 'antd';
import { Typography } from 'antd';
import { Space, Form, Input, Row, Col, Switch, Card } from 'antd';

import { PlusOutlined, GithubOutlined } from '@ant-design/icons';

import styled from '@emotion/styled'

const { Title } = Typography;
const { Panel } = Collapse;

const SpacedRow = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const StyledTitle = styled(Title)`
  margin-top: 20px;
`

function callback(key: string|string[]) {
  console.log(key);
}

const Header = (name: string) => {
  return (
    <Space>
      <Row wrap={false}>
        <Col flex="auto">
          <GithubOutlined style={{ fontSize: '32px', color: '#666' }}/>
        </Col>
      </Row>
    </Space>
  )
}

const RepoForm = () => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
    >
      <Form.Item
        label="User"
        name="user"
        rules={[{ required: true, message: 'GitHub user name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Repository"
        name="repository"
        rules={[{ required: true, message: 'GitHub repository name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Token"
        name="token"
        rules={[{ required: true, message: 'GitHub token' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Verify Access
        </Button>
      </Form.Item>
    </Form>
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
        <StyledTitle level={4}>Repositories</StyledTitle>
        {/*<Collapse defaultActiveKey={[0]} onChange={callback} bordered={true}>*/}
        {this.state.repos.map((repo, i) =>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card title={Header(repo)} key={i} size="small" hoverable extra={<Switch></Switch>}>
                <RepoForm/>
              </Card>
            </Col>
          </Row>
        )}
        {/*
        <SpacedRow>
          <Button type="primary" shape="circle" size="large" icon={<PlusOutlined />} onClick={this.addRepo}/>
        </SpacedRow>
        */}
        <Row justify="center">
          <Col>
            <Button type="dashed" size="large" onClick={this.addRepo}>
              <PlusOutlined /> Add Repository
            </Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default Settings;