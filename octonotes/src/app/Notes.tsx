import React from 'react';
import { useEffect } from "react";
import { Typography } from 'antd';

import styled from '@emotion/styled'

import { Repos } from "./repo";
import * as octokit from "./octokit";

const { Title } = Typography;

const StyledTitle = styled(Title)`
  margin-top: 20px;
`

// ----------------------------------------------------------------------------
// Notes
// ----------------------------------------------------------------------------

type NotesProps = {
  repos: Repos,
}

function Notes({ repos }: NotesProps) {

  useEffect(() => {
    async function loadContents() {
      let contents = await octokit.loadContents(repos)
    }
    loadContents();
  }, [repos])

  return (
    <>
      <StyledTitle level={4}>Notes</StyledTitle>
    </>
  );
}


export default Notes;

