import React from "react";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { FiChevronRight } from "react-icons/fi";

export function Loader(props) {
  const { display } = props;
  if (display)
    return <ReactLoading className="loader" type="cylon" color="#00aaff" />;
  else return null;
}

export function Breadcrumb(props) {
  const { trail } = props;
  return (
    <div className="crumbs">
      {trail.map(([title, path], i) => (
        <span key={title} style={{ display: "flex", alignItems: "center" }}>
          {path ? (
            <>
              <Link to={path}>{title}</Link>
              <FiChevronRight size={20} />
            </>
          ) : (
            <span style={{ fontWeight: "500" }}>{title}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function BackNav(props) {
  return (
    <div className="back-nav">
      <i className="fas fa-chevron-left" />
      <Link to={props.to}>Back to {props.display}</Link>
    </div>
  );
}

export function EditLink(props) {
  return (
    <Link to={props.to}>
      <i className="far fa-edit" />
    </Link>
  );
}
