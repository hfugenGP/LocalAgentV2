import React, { ChangeEvent, forwardRef } from 'react'

interface FileProps {
  multiple?: boolean
}

interface FileUploadProps {
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined,
  ) => void
  multiple?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange, multiple }) => {
  const Upload = forwardRef<HTMLInputElement, FileProps>((props, _) => {
    return <input type="file" {...props} hidden onChange={onChange} />
  })
  return (
    <>
      <Upload multiple={multiple} />
    </>
  )
}

export default FileUpload
