import { useCallback, useContext, useState } from "react"
import { BuildingsContext } from "../contexts/BuildingsContext"
import styles from "../styles/buildingsStyles"
import Modal from "./Modal"

const TableRow = ({ id, name, area, location, imageID }) => {

    const { editBuilding, deleteBuilding } = useContext(BuildingsContext)
    const [modalOpen, setModalOpen] = useState(false)

    const onDelete = useCallback(() => {
        deleteBuilding(id)                    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <div className="row" style={styles.row}>

            <div style={styles.box}>
                {id}
            </div>

            <div style={styles.box}>
                {name}
            </div>

            <div style={styles.box}>
                {area}
            </div>

            <div style={styles.box}>
                {location}
            </div>

            <div style={styles.box}>
                {imageID ?
                    <img style={styles.img} src={process.env.PUBLIC_URL + `/images/${imageID}`} alt='uploaded' />
                    :
                    <img style={styles.img} src={process.env.PUBLIC_URL + '/images/placeholderImage.png'} alt='placeholder' />
                }
            </div>

            <div style={styles.box}>
                <img style={styles.icon} src={process.env.PUBLIC_URL + "/icons/edit.png"} alt='edit' onClick={() => setModalOpen(true)} />
                <img style={styles.icon} src={process.env.PUBLIC_URL + "/icons/delete.png"} alt='delete' onClick={onDelete} />
            </div>

            {modalOpen && <Modal
                onClose={() => setModalOpen(false)}
                onEdit={editBuilding}
                data={{ id, name, area, location, imageID }}
            />}
        </div>
    )
}

export default TableRow
