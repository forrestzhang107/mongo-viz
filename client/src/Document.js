import React, { useState } from 'react'
import { DeleteDocument } from './services'

function Document(props) {

  const [active, setActive] = useState(false)

  const obj = props.data
  const keys = Object.keys(obj)

  return (
    <div className='document hspread'
    onMouseOver={() => setActive(true)} onMouseLeave={() => setActive(false)}>
    <div className='fluid'>{keys.map((key, index) => <span key={index}>{renderPair(key, obj[key], active)}</span>)}</div>
    {renderToolbar()}
    </div>
  )

  function renderToolbar() {
    return (
      <div className={'toolbar ' + (active ? '' : 'transparent')}>
      <i onClick={() => deleteDocument()} className="fa fa-times" aria-hidden="true"></i>
      </div>
    )
  }

  // Helpers

  async function deleteDocument() {
    const status = (await DeleteDocument({
      collectionID: props.collectionID,
      objectID: props.data._id
    })).status
    if (status === 200) props.refresh()
  }

}

function ObjectToggle(props) {

  const [open, setOpen] = useState(false)

  const obj = props.object
  const keys = Object.keys(obj)

  if (open) {
    return (
      <span>
        <span className='toggle' onClick={() => setOpen(false)}>collapse</span>
        <div className='fluid'><div className='indent'>{keys.map((key, index) => <span key={index}>{renderPair(key, obj[key], props.active)}</span>)}</div></div>
      </span>
    )
  }
  else return <span onClick={() => setOpen(true)} className='toggle'>...</span>

}

function renderPair(key, value, active) {
  if (value !== Object(value)) {
    const type = value ? typeof value : 'null'
    return (
      <div className='hspread'>
        <div>{key}: <span className={type}>{value ? value.toString() : 'null'}</span></div>
        {active ? <div className='type'>{type}</div> : ''}
      </div>
    )
  }
  else return <div>{key}: <ObjectToggle object={value} active={active} /></div>
}

export default Document
