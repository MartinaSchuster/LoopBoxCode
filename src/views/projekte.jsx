import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import './projekte-datenbank.css'

const Projekte = (props) => {
  const [projects, setProjects] = useState([{ id: 1, name: 'Projekt_1' }])
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  const handleAddProject = () => {
    const newId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1
    setProjects([...projects, { id: newId, name: `Projekt_${newId}` }])
  }

  const handleRemoveProject = () => {
    if (selectedProjectId === null) return
    const projektName = projects.find((p) => p.id === selectedProjectId)?.name || "?"
    const confirmDelete = window.confirm(`"${projektName}" wirklich löschen?`)
    if (!confirmDelete) return
    setProjects(projects.filter((p) => p.id !== selectedProjectId))
    setSelectedProjectId(null)
  }

  const handleSelectProject = (id) => {
    setSelectedProjectId(id)
  }

  // Neue Funktion zum Ändern des Projekt-Namens
  const handleProjectNameChange = (id, value) => {
    setProjects(projects.map((p) =>
      p.id === id ? { ...p, name: value } : p
    ))
  }

  return (
    <div className="projekte-container1">
      <Helmet>
        <title>projekte - LoopBox</title>
        <meta property="og:title" content="projekte - LoopBox" />
      </Helmet>
      <header id="cnt-topbar" className="cnt-topbar">
        <Link to="/" id="lnk-topbar-logo" className="txt-topbar-logo fnt-Logo">
          Loopbox
        </Link>
        <div id="cnt-topbar-buttons" className="cnt-topbar-buttons">
          <Link
            to="/"
            id="btn-topbar-startseite"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Startseite
          </Link>
          <button
            id="btn-topbar-speichern"
            type="button"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Speichern
          </button>
          <button
            id="btn-topbar-export"
            type="button"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Export
          </button>
          <button
            id="btn-topbar-hilfe"
            type="button"
            className="fnt-ButtonTopbar btn-topbar"
          >
            Hilfe
          </button>
        </div>
      </header>
      <div id="cnt-head" className="cnt-head-projekte">
        <button
          id="btn-head-projekte"
          type="button"
          className="fnt-ButtonHead btn-head"
        >
          Projekte
        </button>
        <div id="cnt-projekte-plusminus" className="cnt-plusminus">
          <button
            id="btn-projekte-minus"
            type="button"
            className="fnt-ButtonPlusMinus btn-plusminus"
            onClick={handleRemoveProject}
          >
            -
          </button>
          <button
            id="btn-projekte-plus"
            type="button"
            className="fnt-ButtonPlusMinus btn-plusminus"
            onClick={handleAddProject}
          >
            +
          </button>
        </div>
      </div>
      <div id="cnt-footer" className="cnt-footer">
        <span
          id="txt-footer-entwickler"
          className="fnt-ButtonText txt-footer-entwickler"
        >
          © 2025 Martina Schuster
        </span>
      </div>
      <div id="cnt-projekte" className="cnt-projekte">
        {projects.map((project) => (
          <div key={project.id} className="cnt-projekt">
            <div
              className={`btn-projekt ${selectedProjectId === project.id ? 'selected' : ''}`}
              onClick={() => handleSelectProject(project.id)}
            ></div>
            <input
              type="text"
              className="inp-projekt-name"
              value={project.name}
              onChange={(e) => handleProjectNameChange(project.id, e.target.value)}
              placeholder="Projektname"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projekte
