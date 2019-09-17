import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Document from './Document'
import qs from 'query-string'
import { GetServerConfig, GetDocuments, GetDocumentCount } from './services'

function Collection(props) {

  const [databaseID, setDatabaseID] = useState(null)
  const [collectionID, setCollectionID] = useState(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(null)
  const [data, setData] = useState(null)
  const [query, setQuery] = useState('')
  const [queryString, setQueryString] = useState('{}')
  const [sort, setSort] = useState('')
  const [sortString, setSortString] = useState('{}')

  useEffect(() => {
    getDatabaseID()
    const parse = qs.parse(window.location.search)
    setCollectionID(parse.id)
    if (parse.page) setPage(parse.page)
  }, [])

  useEffect(() => {
    if (collectionID) getPages({
      collectionID: collectionID,
      query: JSON.parse(queryString),
    })
  }, [collectionID, queryString])

  useEffect(() => {
    if (collectionID) getData({
      collectionID: collectionID,
      page: page,
      query: JSON.parse(queryString),
      sort: JSON.parse(sortString),
    })
  }, [collectionID, page, queryString, sortString])

  useEffect(() => {
    const str = parseQuery(query)
    setQueryString(str)
  }, [query])

  useEffect(() => {
    const str = parseSort(sort)
    setSortString(str)
  }, [sort])

  // JSX

  return (
    <Container>
    <h3>{collectionID}</h3>
    <div className='hspread mb-25'>
    {renderAppNav()}
    {renderPageNav()}
    </div>
    {renderOptions()}
    {renderData()}
    <div className='right'>
    {renderPageNav(true)}
    </div>
    </Container>
  )

  function renderData() {
    if (data) {
      return (
        <div className='mb-25'>
        {data.map((doc, index) =>
          <Document key={index} collectionID={collectionID} data={doc} refresh={refresh} />
        )}
        </div>
      )
    }
  }

  function renderOptions() {
    return (
      <Row className='mb-15'>
      <Col lg={6}>
      <div className='hspread vcenter'>
      <div>Query:</div>
      <input className='opt-input' type='text'
      value={query} onChange={evt => setQuery(evt.target.value)} />
      </div>
      </Col>
      <Col lg={6}>
      <div className='hspread vcenter'>
      <div>Sort:</div>
      <input className='opt-input' type='text'
      value={sort} onChange={evt => setSort(evt.target.value)} />
      </div>
      </Col>
      </Row>
    )
  }

  function renderAppNav() {
    if (databaseID) {
      return (
        <div>
          <Link to='/database'>{databaseID}</Link>
          <i className="divider fas fa-chevron-right"></i>
          <span onClick={() => refresh()} className='synth-link'>{collectionID}</span>
        </div>
      )
    }
  }

  function renderPageNav(reqData=false) {
    if (pages > 1 && (!reqData || (reqData && data))) {
      return (
        <div>
        {page > 1 ? <i onClick={() => setPage(page-1)} className="nav-arrow fas fa-chevron-left"></i> : ''}
        {page + ' of ' + pages}
        {page < pages ? <i onClick={() => setPage(page+1)} className="nav-arrow fas fa-chevron-right"></i> : ''}
        </div>
      )
    }
  }

  // Helpers

  async function refresh() {
    if (page === 1 && query === '' && sort === '') getData({collectionID: collectionID, page: 1})
    else {
      setPage(1)
      setQuery('')
      setSort('')
    }
  }

  async function getDatabaseID() {
    setDatabaseID((await GetServerConfig()).data.database)
  }

  async function getData(payload) {
    setData(null)
    const data = (await GetDocuments(payload)).data
    setData(data)
  }

  async function getPages(payload) {
    setPages(null)
    const count = (await GetDocumentCount(payload)).data
    setPages(Math.ceil(count/10))
  }

  function parseQuery(str) {
    if (str[0] === '{') str = str.substring(1, str.length-1)
    str = str.replace(/ |'|"/g,'')
    const props = str.split(',')
    const obj = {}
    props.forEach((prop) => {
        const tup = prop.split(':')
        if (!tup[1]) return '{}'
        obj[tup[0]] = tup[1]
    })
    return JSON.stringify(obj)
  }

  function parseSort(str) {
    if (str[0] === '{') str = str.substring(1, str.length-1)
    str = str.replace(/ |'|"/g,'')
    const props = str.split(',')
    const obj = {}
    props.forEach((prop) => {
        const tup = prop.split(':')
        if (!tup[1] || isNaN(tup[1])) return '{}'
        obj[tup[0]] = parseInt(tup[1])
    })
    return JSON.stringify(obj)
  }

}

export default Collection