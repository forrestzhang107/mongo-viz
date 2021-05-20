import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Document from "./Document";
import qs from "query-string";
import Loader from "react-loading";
import { Breadcrumb } from "./Components";
import { GetDocuments } from "./services";

function Collection(props) {
  const dbName = localStorage.getItem("dbName");

  const [collectionID, setCollectionID] = useState(null);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(null);
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [queryString, setQueryString] = useState("{}");
  const [sort, setSort] = useState("");
  const [sortString, setSortString] = useState("{}");

  useEffect(() => {
    const parse = qs.parse(window.location.search);
    setCollectionID(parse.id);
  }, []);

  useEffect(() => {
    if (collectionID)
      getData({
        collectionID,
        page,
        query: JSON.parse(queryString),
        sort: JSON.parse(sortString),
      });
  }, [collectionID, page, queryString, sortString]);

  useEffect(() => {
    const obj = {};
    const tup = query.split("=");
    try {
      if (tup[1]) obj[tup[0]] = JSON.parse(tup[1]);
      setQueryString(JSON.stringify(obj));
    } catch (e) {
      setQueryString("{}");
    }
  }, [query]);

  useEffect(() => {
    const obj = {};
    const tup = sort.split("=");
    const value = tup[1];
    if (value === "1" || value === "-1") {
      obj[tup[0]] = parseInt(value);
      setSortString(JSON.stringify(obj));
    } else setSortString("{}");
  }, [sort]);

  // JSX

  return (
    <Container>
      <Breadcrumb trail={[[dbName, "/auth/database"], [collectionID]]} />
      <div className="card-max">
        <div className="db-header">
          <div className="db-title">
            <h3 className="mb-0">{collectionID}</h3>
            <i className="fas fa-sync" onClick={refresh} />
          </div>
          {renderPageNav()}
        </div>
        {renderOptions()}
        {renderData()}
        {data && <div className="bottom-nav">{renderPageNav()}</div>}
      </div>
    </Container>
  );

  function renderData() {
    if (data)
      return (
        <>
          {data.map((doc, index) => (
            <Document
              key={index}
              collectionID={collectionID}
              data={doc}
              refresh={softRefresh}
            />
          ))}
        </>
      );
    else
      return (
        <div className="loader-wrapper">
          <Loader type="spin" color="#00aaff" />
        </div>
      );
  }

  function renderOptions() {
    return (
      <Row className="mb-16">
        <Col lg={6}>
          <div className="hspread vcenter">
            <div>Query:</div>
            <input
              className="opt-input"
              value={query}
              onChange={(evt) => setQuery(evt.target.value)}
            />
          </div>
        </Col>
        <Col lg={6}>
          <div className="hspread vcenter">
            <div>Sort:</div>
            <input
              className="opt-input"
              value={sort}
              onChange={(evt) => setSort(evt.target.value)}
            />
          </div>
        </Col>
      </Row>
    );
  }

  function renderPageNav() {
    if (pageCount > 1) {
      return (
        <div>
          {page > 1 && (
            <>
              <i
                onClick={() => onSetPage(1)}
                className="nav-icon fas fa-angle-double-left"
              />
              <i
                onClick={() => onSetPage(page - 1)}
                className="nav-arrow fas fa-angle-left"
              ></i>
            </>
          )}
          Page {page + " of " + pageCount}
          {page < pageCount && (
            <>
              <i
                onClick={() => onSetPage(page + 1)}
                className="nav-arrow fas fa-angle-right"
              ></i>
              <i
                onClick={() => onSetPage(pageCount)}
                className="nav-icon fas fa-angle-double-right"
              />
            </>
          )}
        </div>
      );
    }
  }

  // Helpers

  function onSetPage(update) {
    setData(null);
    setPage(update);
  }

  async function refresh() {
    if (page === 1 && query === "" && sort === "")
      getData({ collectionID, page: 1 });
    else {
      setPage(1);
      setQuery("");
      setSort("");
    }
  }

  async function softRefresh() {
    getData({
      collectionID,
      page,
      query: JSON.parse(queryString),
      sort: JSON.parse(sortString),
    });
  }

  async function getData(payload) {
    setData(null);
    const { page } = payload;
    const { data } = await GetDocuments(payload);
    const { results, count } = data;
    setData(results);
    setPageCount(Math.ceil(count / 10));
    if (!results[0] && page > 1) setPage(page - 1);
  }
}

export default Collection;
