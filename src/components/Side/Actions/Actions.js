import React from 'react';
import { ButtonGroup, Button } from '@material-ui/core'

export default function Actions() {
  return (
    <div className="actions">
      <ButtonGroup>
        <Button>ułóż</Button>
        <Button>wymień</Button>
        <Button>pas</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>akceptuję</Button>
        <Button>sprawdzam</Button>
      </ButtonGroup>
    </div>
  )
}