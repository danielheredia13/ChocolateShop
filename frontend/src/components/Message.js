import React from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({ variant, text }) => {
  return (
    <Alert variant={variant}>
        {text}
    </Alert>
  )
}

export default Message