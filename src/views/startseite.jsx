import React from 'react'
import { Link } from 'react-router-dom'

import { Helmet } from 'react-helmet'

import './startseite.css'

const Startseite = (props) => {
  return (
    <div className="startseite-container1">
      <Helmet>
        <title>LoopBox</title>
        <meta property="og:title" content="LoopBox" />
      </Helmet>
      <div id="cnt-text" className="cnt-text">
        <span id="txt-zeile1" className="txt-zeile1">
          Herzlich Willkommen bei
        </span>
        <h1 id="txt-zeile2" className="txt-zeile2">
          LoopBox
        </h1>
      </div>
      <div id="cnt-navigation-buttons" className="cnt-navigation-buttons">
        <div id="cnt-navigation-top" className="cnt-navigation-top">
          <Link
            to="/tool"
            id="btn-navigation-tool"
            className="fnt-ButtonHome btn-navigation-button1"
          >
            Neu
          </Link>
          <Link
            to="/projekte"
            id="btn-navigation-projekte"
            className="fnt-ButtonHome btn-navigation-button1"
          >
            Öffnen
          </Link>
        </div>
        <Link
          to="/datenbank"
          id="btn-navigation-datenbank"
          className="fnt-ButtonHome btn-navigation-button2"
        >
          Datenbank
        </Link>
      </div>
      <header id="cnt-topbar" className="cnt-topbar">
        <Link to="/" id="lnk-topbar-logo" className="txt-topbar-logo fnt-Logo">
          Loopbox
        </Link>
        <div
          id="cnt-topbar-buttons"
          className="cnt-topbar-buttons startseite-container5"
        >
          <button
            id="btn-topbar-hilfe"
            type="button"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Hilfe
          </button>
        </div>
      </header>
      <div id="cnt-footer" className="cnt-footer">
        <span
          id="txt-footer-entwickler"
          className="fnt-ButtonText txt-footer-entwickler"
        >
          © 2025 Martina Schuster
        </span>
      </div>
    </div>
  )
}

export default Startseite
