

const building = {
    container: {
        padding: '0 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
    },

    main: {
        padding: '0rem 0',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        top: '100px',
        maxHeight: 'calc(100% - 200px)',
        overflow: 'scroll',
        position: 'relative'
    },

    table: {
        width: 'calc(100vw - 4rem)',
        border: '1px solid rgba(0,0,0, 0.1)',
        borderRadius: "5px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '24px',
        marginLeft: '24px',
        overflow: 'hidden'
    },

    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100vw',
        padding: '1rem 0 2rem 0',
        borderBottom: '1px solid rgba(0,0,0, 0.1)',
        position: 'relative',
        alignSelf: 'center'
    },

    headingRow: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        padding: '2rem 0',
        borderBottom: '1px solid rgba(0,0,0, 0.1)',
    },

    box: {
        flexGrow: 1,
        maxWidth: '33%',
        padding: '0 .5rem',
        textAlign: 'center',
        maxHeight: '100px',
        wordWrap: 'break-word',
        fontSize: '16px',
        borderRight: '1px solid rgba(0,0,0, 0.1)',
        background: 'rgba(255,255,255, 0)'
    },

    icon: {
        cursor: 'pointer',
        maxWidth: '25px'
    },

    img: {
        maxWidth: '80px'
    },
}


export default building;
