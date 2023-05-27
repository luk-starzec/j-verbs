import React from 'react'

const CopyrightInfo = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>© {currentYear}</>
  )
}

export default CopyrightInfo