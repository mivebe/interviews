import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom"
import Table from "./components/Table"
import Modal from "./components/Modal"
import Card from './components/Card'
import './styles/App.css';
import { getSingleEntry } from './utils/util';

const App = () => {
  const [countries, setCountries] = useState()
  const [query, setQuery] = useState('')
  const [modalData, setModalData] = useState(null)

  const location = useLocation()

  const urlSearch = location.pathname !== '/' ? location.pathname.slice(1) : '';

  useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:3001?query=${query || urlSearch}`)
      const data = await response.json()
      setCountries(data)
    })()
  }, [query, urlSearch])

  const handleKeyDown = searchInput => e => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        setQuery(searchInput)
        break;
      default:
        break;
    }
  }

  const handleShowModal = (e) => {
    setModalData(getSingleEntry(e.target.getAttribute('entryid'), countries))
  }

  return (
    <div className="App">
      {countries && <Table data={countries} handleSearch={handleKeyDown} handleShowModal={handleShowModal} />}
      {modalData && <Modal onClose={() => setModalData(null)}>
        <Card data={modalData} />
      </Modal>}
    </div>
  );
}

export default App;
