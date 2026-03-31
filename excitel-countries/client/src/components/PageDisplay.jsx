const PageDisplay = ({ pagination, handlePageSelect }) => (
    <>
        {[...Array(pagination.pagesCount)]?.map((e, index) =>
            <button className='page-button'
                key={index + 1}
                value={index + 1}
                onClick={handlePageSelect}
            >
                {index + 1}
            </button>
        )}
    </>
);
export default PageDisplay