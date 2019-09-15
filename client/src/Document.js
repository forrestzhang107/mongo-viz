import React from 'react'
import ObjectToggle from './ObjectToggle'

function Document(props) {

  const obj = props.data
  const keys = Object.keys(obj)

  return (
    <div className='document'>
    {keys.map((key, index) =>
      <div key={index}>{key}: {renderProp(obj[key])}</div>
    )}
    </div>
  )

  // Helpers

  function renderProp(obj) {
    if (isPrimitive(obj)) return obj.toString()
    else return <ObjectToggle object={obj} />
  }


  function isPrimitive(test) {
    return test !== Object(test)
  }

}

export default Document
