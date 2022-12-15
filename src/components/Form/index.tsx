import React from 'react'

interface FormProps {
  children: JSX.Element
  onSubmit: any | null
  onReset: any | null
}

const Form: React.FC<FormProps> = ({ children, onSubmit, onReset }) => {
  return (
    <form autoComplete="off" onSubmit={onSubmit} onReset={onReset}>
      {children}
    </form>
  )
}

export default Form
