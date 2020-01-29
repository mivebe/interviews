import { Link } from "react-router-dom"
import styles from "../styles/footerStyles"

const Footer = () => {

    return (
        <footer style={styles.footer}>

            <nav style={styles.halfFlex} >
                <Link to="/" className={"links"}><p style={styles.link}>Home</p></Link>
                <Link to="/buildings" className={"links"}><p style={styles.link}>Buildings</p></Link>
            </nav>

            <div style={{ display: "flex" }}>
                <h1 style={styles.footerTitle}>Building App</h1>
            </div>

        </footer>
    )
}
export default Footer