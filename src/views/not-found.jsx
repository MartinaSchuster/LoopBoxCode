import React from 'react'

import { Helmet } from 'react-helmet'

import './not-found.css'

const NotFound = (props) => {
  return (
    <div className="not-found-container1">
      <Helmet>
        <title>404 - Not Found</title>
      </Helmet>
      <h3>OOPS! PAGE NOT FOUND</h3>
      <div className="not-found-container2">
        <h1 className="not-found-text2">404</h1>
      </div>
      <div className="not-found-container3">
        <h2 className="not-found-text3">
          WE ARE SORRY, BUT THE PAGE YOU REQUESTED WAS NOT FOUND
        </h2>
      </div>
      <header id="cnt-topbar" className="cnt-topbar">
        <a href="/" id="lnk-topbar-logo" className="txt-topbar-logo fnt-Logo">
          Loopbox
        </a>
        <div
          id="cnt-topbar-buttons"
          className="cnt-topbar-buttons startseite-container5"
        >
          <button
            id="btn-topbar-hilfe"
            type="button"
            className="fnt-ButtonTopbar btn-topbar startseite-fadenlauf-button"
          >
            Hilfe
          </button>
        </div>
      </header>
      <div id="cnt-footer" className="cnt-footer">
        <span
          id="txt-footer-entwickler"
          className="ButtonText txt-footer-entwickler"
        >
          © 2025 Martina Schuster
        </span>
      </div>
    </div>
  )
}

export default NotFound
