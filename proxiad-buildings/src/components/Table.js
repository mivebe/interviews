import { useContext, useEffect, useState } from "react"
import { BuildingsContext } from "../contexts/BuildingsContext"
import TableRow from "./TableRow"
import Modal from "./Modal"
import styles from "../styles/buildingsStyles"

const Table = () => {

    const { buildings, fetchBuildings, addBuilding } = useContext(BuildingsContext)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        fetchBuildings()                   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <table style={styles.table}>
            {modalOpen && <Modal
                onClose={() => setModalOpen(false)}
                onAdd={addBuilding}
            />}
            <div style={styles.headingRow}>
                <div style={styles.box}>
                    Id
                </div>
                <div style={styles.box}>
                    Name
                </div>
                <div style={styles.box}>
                    Area
                </div>
                <div style={styles.box}>
                    Location
                </div>
                <div style={styles.box}>
                    Image
                </div>
                <div style={styles.box}>
                    <img style={styles.icon} src={process.env.PUBLIC_URL + "/icons/add.png"} alt="add" onClick={() => setModalOpen(true)} />
                </div>
            </div>

            {buildings && buildings.map(el => <TableRow
                key={el.id}
                id={el.id}
                name={el.name}
                area={el.area}
                location={el.location || "N/A"}
                imageID={el.imageID || null}
            />)}
        </table>
    )
}

export default Table
