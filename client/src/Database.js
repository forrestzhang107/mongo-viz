import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Modal from "react-modal";
import Loader from "react-loading";
import { GetDatabaseInfo, CreateCollection, DropCollection } from "./services";

const modalStyle = {
  content: {
    top: "33%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function Database(props) {
  const [data, setData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDropModal, setShowDropModal] = useState(false);
  const [create, setCreate] = useState("");
  const [drop, setDrop] = useState("");

  useEffect(() => {
    getDatabaseInfo();
  }, []);

  // JSX

  return (
    <Container>
      <div className="card-max">
        <div className="db-header">
          <div className="db-title">
            <h3 className="mb-0">ExpressoDB</h3>
            <i className="fas fa-sync" onClick={getDatabaseInfo} />
          </div>
          <div>
            {renderCreateCollection()}
            {renderDropCollection()}
          </div>
        </div>
        {renderData()}
      </div>
    </Container>
  );

  function renderCreateCollection() {
    return (
      <span>
        <button
          className="app-button"
          onClick={() => {
            setCreate("");
            setShowCreateModal(true);
          }}
        >
          New Collection
        </button>
        <Modal
          isOpen={showCreateModal}
          style={modalStyle}
          onRequestClose={() => setShowCreateModal(false)}
        >
          <form
            className="modal-form"
            onSubmit={(evt) => {
              evt.preventDefault();
              createCollection();
            }}
          >
            New Collection:
            <input
              value={create}
              onChange={(evt) => setCreate(evt.target.value)}
            />
            <button className="app-button" type="submit">
              Submit
            </button>
            <button
              className="app-button"
              onClick={(evt) => {
                evt.preventDefault();
                setShowCreateModal(false);
              }}
            >
              Cancel
            </button>
          </form>
        </Modal>
      </span>
    );
  }

  function renderDropCollection() {
    return (
      <span>
        <button
          className="app-button"
          onClick={() => {
            setDrop("");
            setShowDropModal(true);
          }}
        >
          Drop Collection
        </button>
        <Modal
          isOpen={showDropModal}
          style={modalStyle}
          onRequestClose={() => setShowDropModal(false)}
        >
          <form
            className="modal-form"
            onSubmit={(evt) => {
              evt.preventDefault();
              dropCollection();
            }}
          >
            Drop Collection:
            <input value={drop} onChange={(evt) => setDrop(evt.target.value)} />
            <button className="app-button" type="submit">
              Submit
            </button>
            <button
              className="app-button"
              onClick={(evt) => {
                evt.preventDefault();
                setShowDropModal(false);
              }}
            >
              Cancel
            </button>
          </form>
        </Modal>
      </span>
    );
  }

  function renderData() {
    if (data) {
      return (
        <table className="db-table">
          <thead>
            <tr>
              <th>Collection</th>
              <th>Document Count</th>
              <th>Collection Size</th>
              <th>Average Size</th>
            </tr>
          </thead>
          <tbody>
            {data.map((obj, index) => (
              <tr
                key={index}
                className="collection"
                onClick={() => toCollection(obj.collectionID)}
              >
                <td>{obj.collectionID}</td>
                <td>{obj.count}</td>
                <td>{formatBytes(obj.size)}</td>
                <td>{formatBytes(obj.avgObjSize)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else
      return (
        <div className="loader-wrapper">
          <Loader type="spin" color="#00aaff" />
        </div>
      );
  }

  // Helpers

  async function getDatabaseInfo() {
    setData(null);
    return setData((await GetDatabaseInfo()).data);
  }

  function toCollection(collectionID) {
    props.history.push("/collection?id=" + collectionID);
  }

  async function createCollection() {
    const res = await CreateCollection({ collectionID: create });
    if (res.status === 200) {
      setShowCreateModal(false);
      getDatabaseInfo();
    }
  }

  async function dropCollection() {
    const res = await DropCollection({ collectionID: drop });
    if (res.status === 200) {
      setShowDropModal(false);
      getDatabaseInfo();
    }
  }
}

export default Database;

function formatBytes(bytes, decimals = 2) {
  if (!bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
