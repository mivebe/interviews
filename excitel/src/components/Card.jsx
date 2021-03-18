import "../styles/Card.css"

const Card = ({ data }) => (

    <div className="card">
        <div className="card-header">
            <img src={data.flag} alt="flag" />
        </div>
        <h1>{data.name}</h1>
        <div className="card-body">
            <div className="card-body_row">
                Country: <p className="tag blue">{data.name}</p>
                With capital: <p className="tag blue">{data.capitalName}</p>
            </div>
            <div className="card-body_row">
                Coordinates: {data.latLng.map(coordinate => <p className="tag yellow">{coordinate}</p>)}
            </div>
            <p>
                The current population is of {data.name} is: <p className="tag yellow">{data.population}</p>
            </p>
            <div className='card-body_row'>
                Region: <p className="tag red">{data.region}</p>
                Subregion: <p className="tag red">{data.subregion}</p>
            </div>
        </div>
    </div>
);
export default Card;