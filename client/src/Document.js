import React, { useState } from 'react'
import ObjectToggle from './ObjectToggle'
import { DeleteDocument } from './services'

function Document(props) {

  const [active, setActive] = useState(false)

  const obj = props.data
  const keys = Object.keys(obj)

  return (
    <div className='document hspread'>
    <div>
    {keys.map((key, index) =>
      <div key={index}>{key}: {renderProp(obj[key])}</div>
    )}
    </div>
    <div tabIndex='0' className='del-space'
    onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
    {renderDel()}
    </div>
    </div>
  )

  function renderDel() {
    if (active) return (
      <div className='right' onClick={() => deleteDocument()}>
      <i className="fa fa-times" aria-hidden="true"></i>
      </div>
    )
  }

  // Helpers

  async function deleteDocument() {
    console.log(props)
    const res = await DeleteDocument({
      collectionID: props.collectionID,
      objectID: props.data._id
    })
    if (res.status === 200) props.refresh()
  }

  function renderProp(obj) {
    if (isPrimitive(obj)) return obj.toString()
    else return <ObjectToggle object={obj} />
  }


  function isPrimitive(test) {
    return test !== Object(test)
  }

}

export default Document
