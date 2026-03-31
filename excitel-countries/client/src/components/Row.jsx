const Row = ({ data }) => {

    return (
        <div id="row-entry">
            <p>{data.name}</p>
            <p>{data.capitalName}</p>
            <p>{data.region}</p>
            <p>{data.subregion}</p>
        </div>
    )
}
export default Row;