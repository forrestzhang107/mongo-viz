import React, {useState} from 'react'

function ObjectToggle(props) {

  const [open, setOpen] = useState(false)

  const obj = props.object
  const keys = Object.keys(obj)
  if (open) {
    return (
      <span>
        <span className='toggle' onClick={() => setOpen(false)}>
          <i className="fas fa-angle-up"></i>
        </span>
        <div className='indent'>
        {keys.map((key, index) =>
          <div key={index}>{key}: {renderProp(obj[key])}</div>
        )}
        </div>
      </span>
    )
  }
  else return (
    <span onClick={() => setOpen(true)} className='toggle'>
      <i className="fas fa-angle-down"></i>
    </span>
  )

  function renderProp(obj) {
    if (isPrimitive(obj)) return obj
    return <ObjectToggle object={obj} />
  }

  // Helpers

  function isPrimitive(test) {
    return test !== Object(test)
  }

}

export default ObjectToggle
