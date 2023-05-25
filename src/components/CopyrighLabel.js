import React from 'react'

const CopyrightLabel = () => {
  const currentYear = new Date().getFullYear();
  return (
    <>© {currentYear}</>
  )
}

export default CopyrightLabel