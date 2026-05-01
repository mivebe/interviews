import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import CountriesTable from './components/CountriesTable';
import Modal from './components/Modal';
import CountryDetails from './components/CountryDetails';
import useCountries from './utils/useCountries';

import './styles/App.css';

const App = () => {
    const location = useLocation();
    const initialQuery = location.pathname !== '/' ? decodeURIComponent(location.pathname.slice(1)) : '';

    const { countries, isLoading, error } = useCountries(initialQuery);
    const [selectedCountry, setSelectedCountry] = useState(null);

    return (
        <div className="app">
            <header className="app-header">
                <div className="app-header__brand">
                    <img
                        src={`${import.meta.env.BASE_URL}logo_text.png`}
                        alt="Excitel Technology"
                        className="app-header__logo"
                    />
                </div>
            </header>

            <main className="app-main">
                {isLoading && (
                    <div className="app-loader" role="status" aria-live="polite">
                        <div className="app-loader__spinner" aria-hidden="true" />
                        <span className="app-loader__label">Loading countries…</span>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="app-error" role="alert">
                        Failed to load countries. Please try again later.
                    </div>
                )}

                {!isLoading && !error && (
                    <CountriesTable
                        countries={countries}
                        onShowDetail={setSelectedCountry}
                    />
                )}
            </main>

            {selectedCountry && (
                <Modal onClose={() => setSelectedCountry(null)}>
                    <CountryDetails country={selectedCountry} />
                </Modal>
            )}
        </div>
    );
};

export default App;
