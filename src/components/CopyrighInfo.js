import React from 'react'

const CopyrightInfo = () => {
  const firstYear = 2023;
  const currentYear = new Date().getFullYear();
  const text = firstYear === currentYear ? currentYear : `${firstYear}-${currentYear}`;
  return (
    <>© {text}</>
  )
}

export default CopyrightInfo