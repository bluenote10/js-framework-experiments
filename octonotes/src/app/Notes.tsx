import React from 'react';
import { Typography } from 'antd';

import styled from '@emotion/styled'


const { Title } = Typography;

const StyledTitle = styled(Title)`
  margin-top: 20px;
`

// ----------------------------------------------------------------------------
// Notes
// ----------------------------------------------------------------------------

function Notes() {

  return (
    <>
      <StyledTitle level={4}>Notes</StyledTitle>
    </>
  );
}


export default Notes;

