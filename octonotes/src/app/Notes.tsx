import React from 'react';
import { useEffect, useState } from "react";
import { Typography } from 'antd';

import styled from '@emotion/styled'

import { Repos } from "./repo";
import { Entry, loadEntries} from "./octokit";

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

  let [entries, setEntries] = useState([] as Entry[])

  useEffect(() => {
    async function loadContents() {
      let newEntries = await loadEntries(repos)
      setEntries(newEntries)
    }
    loadContents();
  }, [repos])

  return (
    <>
      <StyledTitle level={4}>Notes</StyledTitle>
      {entries.map(entry =>
        <div key={entry.title}>
          {entry.title}
        </div>
      )}
    </>
  );
}


export default Notes;

