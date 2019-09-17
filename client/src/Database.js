import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import Modal from 'react-modal'
import { GetDatabaseInfo, GetServerConfig, CreateCollection, DropCollection } from './services'

const modalStyle = {
  content: {
    top: '33%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
}

Modal.setAppElement('#root')

function Home(props) {

  const [databaseID, setDatabaseID] = useState('')
  const [data, setData] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDropModal, setShowDropModal] = useState(false)
  const [create, setCreate] = useState('')
  const [drop, setDrop] = useState('')

  useEffect(() => {
    getDatabaseID()
    getDatabaseInfo()
  }, [])

  // JSX

  return (
    <Container>
    <h3 className='mb-25'>{databaseID}</h3>
    {renderActions()}
    {renderData()}
    </Container>
  )

  function renderActions() {
    if (data) return (
      <div className='mb-15'>
      {renderCreateCollection()}
      {renderDropCollection()}
      </div>
    )
  }

  function renderCreateCollection() {
    return (
      <span>
      <button onClick={() => {setCreate(''); setShowCreateModal(true)}}>New Collection</button>
      <Modal isOpen={showCreateModal} style={modalStyle}>
        <form onSubmit={evt => {evt.preventDefault(); createCollection()}}>
          New Collection:<input value={create}
          onChange={evt => setCreate(evt.target.value)}
          className='modal-input' type='text' />
          <button type='submit'>Submit</button>
          <button onClick={evt => {evt.preventDefault(); setShowCreateModal(false)}}>Cancel</button>
        </form>
      </Modal>
      </span>
    )
  }

  function renderDropCollection() {
    return (
      <span>
      <button onClick={() => {setDrop(''); setShowDropModal(true)}}>Drop Collection</button>
      <Modal isOpen={showDropModal} style={modalStyle}>
        <form onSubmit={evt => {evt.preventDefault(); dropCollection()}}>
          Drop Collection:<input value={drop}
          onChange={evt => setDrop(evt.target.value)}
          className='modal-input' type='text' />
          <button type='submit'>Submit</button>
          <button onClick={evt => {evt.preventDefault(); setShowDropModal(false)}}>Cancel</button>
        </form>
      </Modal>
      </span>
    )
  }

  function renderData() {
    if (data) {
      return (
        <table className='db-table'>
        <thead>
        <tr>
        <th>Collection</th>
        <th>Count</th>
        <th>Size</th>
        <th>Average Size</th>
        </tr>
        </thead>
        <tbody>
        {data.map((obj, index) =>
          <tr key={index}
          className='collection'
          onClick={() => toCollection(obj.collectionID)}>
          <td>{obj.collectionID}</td>
          <td>{obj.count}</td>
          <td>{obj.size}</td>
          <td>{obj.avgObjSize}</td>
          </tr>
        )}
        </tbody>
        </table>
      )
    }
  }

  // Helpers

  async function getDatabaseID() {
    return setDatabaseID((await GetServerConfig()).data.database)
  }

  async function getDatabaseInfo() {
    setData(null)
    return setData((await GetDatabaseInfo()).data)
  }

  function toCollection(collectionID) {
    props.history.push('/collection/?id='+collectionID)
  }

  async function createCollection() {
    const res = await CreateCollection({collectionID: create})
    console.log(res.status)
    if (res.status === 200) {
      setShowCreateModal(false)
      getDatabaseInfo()
    }
  }

  async function dropCollection() {
    const res = await DropCollection({collectionID: drop})
    if (res.status === 200) {
      setShowDropModal(false)
      getDatabaseInfo()
    }
  }


}

export default Home
