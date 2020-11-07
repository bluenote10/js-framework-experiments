import React from 'react';
import { useCallback } from "react";

import { Collapse } from 'antd';
import { Button } from 'antd';
import { Typography } from 'antd';
import { Space, Form, Input, Row, Col, Switch, Card } from 'antd';

import FormItemLabel from "antd/lib/form/FormItemLabel"

import { PlusOutlined, GithubOutlined, ReadOutlined } from '@ant-design/icons';

import styled from '@emotion/styled'

import { Repo, Repos, createDefaultInitializedRepo } from "./repo"
import { RowProps } from 'antd/lib/row';


const { Title } = Typography;
const { Panel } = Collapse;

const SpacedRow = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

const StyledTitle = styled(Title)`
  margin-top: 20px;
`

const StyledRepoTitle = styled.span`
  font-size: 16px;
`

// ----------------------------------------------------------------------------
// Header
// ----------------------------------------------------------------------------

function Header(repo: Repo) {
  return (
    <Space>
      <Row wrap={false} align="middle" gutter={8}>
        <Col flex="auto">
          <GithubOutlined style={{ fontSize: '32px', color: '#666' }}/>
        </Col>
        <Col flex="auto">
          <StyledRepoTitle>{repo.name}</StyledRepoTitle>
        </Col>
      </Row>
    </Space>
  )
}

// ----------------------------------------------------------------------------
// Repo form
// ----------------------------------------------------------------------------

/*
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
*/
function RepoForm({
  repo,
  onDelete,
  onEdited,
}: {
  repo: Repo,
  onDelete: () => void,
  onEdited: (repo: Repo) => void,
}) {

  const rowProps: RowProps = {justify: "end", align: "middle" as "middle", gutter: [8, 16]}

  return (
    <>
      <Row {...rowProps}>
        <Col>Name:</Col>
        <Col span={16}>
          <Input
            placeholder="Name within Notemarks"
            value={repo.name}
            onChange={evt => {onEdited({...repo, name: evt.target.value})}}
          />
        </Col>
      </Row>
      <Row {...rowProps}>
        <Col>User:</Col>
        <Col span={16}>
          <Input
            placeholder="GitHub user name"
            value={repo.userName}
            onChange={evt => {onEdited({...repo, userName: evt.target.value})}}
          />
        </Col>
      </Row>
      <Row {...rowProps}>
        <Col>Repository:</Col>
        <Col span={16}>
          <Input
            placeholder="GitHub repository name"
            value={repo.repoName}
            onChange={evt => {onEdited({...repo, repoName: evt.target.value})}}
          />
        </Col>
      </Row>
      <Row {...rowProps}>
        <Col>Token:</Col>
        <Col span={16}>
          <Input.Password
            placeholder="GitHub access token"
            value={repo.token}
            onChange={evt => {onEdited({...repo, token: evt.target.value})}}
          />
        </Col>
      </Row>
      <Row {...rowProps}>
        <Col span={16}>
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
        </Col>
      </Row>
    </>
  )
}


// ----------------------------------------------------------------------------
// Settings
// ----------------------------------------------------------------------------

type SettingsProps = {
  repos: Repos,
  setRepos: (repos: Repos) => void,
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

  const updateRepo = (i: number, updatedRepo: Repo) => {
    let newRepos = [...repos];
    newRepos[i] = updatedRepo;
    setRepos(newRepos);
  }

  return (
    <>
      <StyledTitle level={4}>Repositories</StyledTitle>
      {/*<Collapse defaultActiveKey={[0]} onChange={callback} bordered={true}>*/}
      {repos.map((repo, i) =>
        <Row key={repo.id} gutter={[24, 24]}>
          <Col span={24}>
            <Card
              title={Header(repo)}
              size="small"
              hoverable
              //extra={<Switch checked={repo.enabled} onClick={() => toggleEnableRepo(i)}></Switch>}
            >
              <RepoForm
                repo={repo}
                onDelete={() => deleteRepo(i)}
                onEdited={(updatedRepo) => updateRepo(i, updatedRepo)}
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
