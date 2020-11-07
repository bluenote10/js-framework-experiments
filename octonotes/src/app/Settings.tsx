import React from 'react';
import { useCallback } from "react";

import { Collapse } from 'antd';
import { Button } from 'antd';
import { Typography } from 'antd';
import { Space, Form, Input, Row, Col, Switch, Card } from 'antd';

import { PlusOutlined, GithubOutlined } from '@ant-design/icons';

import styled from '@emotion/styled'

import { Repo, createDefaultInitializedRepo } from "./repo"


const { Title } = Typography;
const { Panel } = Collapse;

const SpacedRow = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const StyledTitle = styled(Title)`
  margin-top: 20px;
`

// ----------------------------------------------------------------------------
// Header
// ----------------------------------------------------------------------------

const Header = (repo: Repo) => {
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

// ----------------------------------------------------------------------------
// Repo form
// ----------------------------------------------------------------------------

function RepoForm({
  onDelete,
}: {
  onDelete: () => void,
}) {

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
        <Row justify="space-between">
          <Col>
            <Button type="primary" htmlType="submit">
              Verify Access
            </Button>
          </Col>
          <Col>
            <Button danger onClick={onDelete}>
              Delete
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  )
}

// ----------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------

type SettingsProps = {
  repos: Repo[],
  setRepos: (repos: Repo[]) => void,
}

function Settings({ repos, setRepos }: SettingsProps) {

  const addRepo = useCallback(() => {
    let newRepo = createDefaultInitializedRepo(repos.length === 0 ? true : false)
    setRepos([...repos, newRepo])
  }, [repos, setRepos]);

  const toggleEnableRepo = (i: number) => {
    let newRepos = [...repos];
    newRepos[i].enabled = !newRepos[i].enabled;
    setRepos(newRepos);
  }

  const deleteRepo = (i: number) => {
    let newRepos = [...repos];
    newRepos.splice(i, 1);
    setRepos(newRepos);
  }

  return (
    <>
      <StyledTitle level={4}>Repositories</StyledTitle>
      {/*<Collapse defaultActiveKey={[0]} onChange={callback} bordered={true}>*/}
      {repos.map((repo, i) =>
        <Row key={i} gutter={[24, 24]}>
          <Col span={24}>
            <Card
              title={Header(repo)}
              size="small"
              hoverable extra={<Switch checked={repo.enabled} onClick={() => toggleEnableRepo(i)}></Switch>}
            >
              <RepoForm
                onDelete={() => deleteRepo(i)}
              />
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
          <Button type="dashed" size="large" onClick={addRepo}>
            <PlusOutlined /> Add Repository
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Settings;
