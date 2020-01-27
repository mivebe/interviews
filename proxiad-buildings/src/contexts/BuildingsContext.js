import { useState, createContext } from "react"
import buildingsResponse from "../data/buildingsData.json"

export const BuildingsContext = createContext({})

const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

export const BuildingsProvider = ({ children }) => {
    const [buildings, setBuildings] = useState([])

    const fetchBuildings = async () => {
        await delay(500)
        setBuildings(buildingsResponse)
    }

    const addBuilding = (data) => {
        setBuildings([...buildings, data])
    }

    const editBuilding = (data) => {
        const newBuildings = buildings.map(el => {
            if (el.id === data.id) {
                return { ...el, ...data }
            }

            return el
        })

        setBuildings(newBuildings)
    }

    const deleteBuilding = (key) => {
        setBuildings(buildings.filter(el => el.id !== key))
    }

    return (
        <BuildingsContext.Provider value={{ buildings, fetchBuildings, addBuilding, editBuilding, deleteBuilding }}>
            {children}
        </BuildingsContext.Provider>
    )
}

