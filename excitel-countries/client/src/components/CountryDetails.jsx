import '../styles/Card.css';

const formatNumber = (value) => {
    if (typeof value !== 'number') return '-';
    return value.toLocaleString('en-US');
};

const formatCoords = (latLng) => {
    if (!Array.isArray(latLng) || latLng.length < 2) return '-';
    return `${latLng[0]}°, ${latLng[1]}°`;
};

const CountryDetails = ({ country }) => (
    <article className="card">
        {country.flag && (
            <div className="card__flag">
                <img src={country.flag} alt={`Flag of ${country.name}`} />
            </div>
        )}
        <header className="card__header">
            <h2 className="card__title">{country.name}</h2>
            {country.code && <span className="card__code">{country.code}</span>}
        </header>
        <dl className="card__grid">
            <div className="card__row">
                <dt>Capital</dt>
                <dd>{country.capitalName || '-'}</dd>
            </div>
            <div className="card__row">
                <dt>Region</dt>
                <dd>{country.region || '-'}</dd>
            </div>
            <div className="card__row">
                <dt>Subregion</dt>
                <dd>{country.subregion || '-'}</dd>
            </div>
            <div className="card__row">
                <dt>Population</dt>
                <dd>{formatNumber(country.population)}</dd>
            </div>
            <div className="card__row card__row--wide">
                <dt>Coordinates</dt>
                <dd>{formatCoords(country.latLng)}</dd>
            </div>
        </dl>
    </article>
);

export default CountryDetails;
