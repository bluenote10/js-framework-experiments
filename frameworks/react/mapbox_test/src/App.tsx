import React, { Component } from 'react';
import { Button, DatePicker, version } from "antd";

import "antd/dist/antd.css";

import styled from '@emotion/styled'

const StyledDiv = styled.div`
  margin-left: 100px;
`

class App extends Component {
  render() {
    return (
      <StyledDiv>
        <h1>antd version: {version}</h1>
        <DatePicker />
        <Button type="primary" style={{ marginLeft: 8 }}>
          Primary Button
        </Button>
      </StyledDiv>
    );
  }
}

export default App;