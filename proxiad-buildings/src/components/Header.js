import styles from "../styles/headerStyles"

const Header = () => {
    return (
        <header style={styles.header}>
            <div style={styles.halfFlex}>
                <h3>Welcome</h3>
            </div>

            <div style={styles.imageContainer}>
                <img style={styles.img} src={process.env.PUBLIC_URL + "/images/avatar.png"} alt="avatar" />
            </div>
        </header>
    )
}

export default Header
