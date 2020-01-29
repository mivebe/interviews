import { useState, useEffect, useRef } from "react"
import ReactDOM from 'react-dom'
import styles from "../styles/modalStyles"

const Modal = ({ data, onClose, onAdd, onEdit }) => {
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [newData, setNewData] = useState({})

    const formRef = useRef(null)
    const fileRef = useRef(null)

    useEffect(() => {
        if (image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            }
            reader.readAsDataURL(image);
        } else {
            setPreview(null);
        }

    }, [image])

    const handleFormChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        if (name !== 'image') {
            setNewData({ ...newData, [name]: value })
        }
    }

    return ReactDOM.createPortal(
        <overlay style={styles.overlay}>
            <div style={styles.modal}>
                <section style={styles.row}>
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
                        <img style={styles.icon} src={process.env.PUBLIC_URL + "/icons/close.png"} alt="add" onClick={onClose} />
                    </div>
                </section>
                <section style={styles.row}>
                    <form ref={formRef} onChange={handleFormChange} onSubmit={e => e.preventDefault()}>
                        <input type="text" id="name" name="name" style={styles.input} defaultValue={data ? data.name : ""} required />

                        <input type="text" id="area" name="area" style={styles.input} defaultValue={data ? data.id : ""} required />

                        <input type="text" id="location" name="location" style={styles.input} defaultValue={data ? data.id : ""} />

                        <input type="file" id="image" name="image" ref={fileRef} style={styles.file} onChange={(e) => {
                            setImage(e.target.files[0]);
                            setNewData({ ...newData, imageID: e.target.files[0].name })
                        }} />

                    </form>
                </section>
                <section style={styles.row} >
                    <div style={styles.box}>
                        <img style={styles.icon} src={process.env.PUBLIC_URL + '/icons/upload.png'} alt="building" onClick={() => fileRef.current.click()} />
                    </div>

                    <div style={styles.box}>
                        {
                            preview ?
                                <img style={styles.img} src={preview} alt="preview" /> :
                                data && data.imageID ?
                                    <img style={styles.img} src={process.env.PUBLIC_URL + `/images/${data.imageID}`} alt="building" /> :
                                    <img style={styles.img} src={process.env.PUBLIC_URL + '/images/placeholderImage.png'} alt="placeholder" />
                        }
                    </div>

                    <div style={styles.box}>
                        <img style={styles.icon} src={process.env.PUBLIC_URL + '/icons/check.png'} alt="submit" onClick={() => {
                            if (!formRef || !formRef.current.checkValidity()) {
                                return
                            }

                            if (onAdd) {
                                onAdd({ ...newData, id: Date.now() });
                            }

                            if (onEdit) {
                                onEdit({ ...newData, id: data.id })
                            }

                            onClose()
                        }} />
                    </div>
                </section>
            </div>

        </overlay>, document.querySelector('body')
    )
}

export default Modal
