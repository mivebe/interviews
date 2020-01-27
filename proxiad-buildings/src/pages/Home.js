import { Link } from "react-router-dom"
import styles from "../styles/homeStyles"

const Home = () => {
    return (
        <main style={styles.main}>
            <Link to='/buildings' className={"links"}>
                <h1 style={styles.title}>Buildings</h1>
            </Link>
            <p style={styles.p}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </main>
    )
}

export default Home
