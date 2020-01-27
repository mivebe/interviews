
import Table from "../components/Table"

import { BuildingsProvider } from "../contexts/BuildingsContext";

const Buildings = () => {
    return (
        <section style={{ display: "flex", alignItems: "center" }}>
            <BuildingsProvider>
                <Table />
            </BuildingsProvider>
        </section>
    )
}

export default Buildings
