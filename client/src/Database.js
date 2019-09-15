import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { GetDatabaseInfo, GetServerConfig } from './services'

function Home(props) {

  const [databaseID, setDatabaseID] = useState('')
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetch() {
      const config = (await GetServerConfig()).data
      setDatabaseID(config.database)
      const res = await GetDatabaseInfo()
      setData(res.data)
    }
    fetch()
  }, [])

  // JSX

  return (
    <Container className='first center'>
    <h3 className='mb-25'>{databaseID}</h3>
    {renderData()}
    </Container>
  )

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

  function toCollection(collectionID) {
    props.history.push('/collection/?id='+collectionID)
  }


}

export default Home
