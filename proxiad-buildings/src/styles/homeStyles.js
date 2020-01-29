
const home = {
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
        padding: '5rem 0',
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: 'calc(100% - 100px)',
        overflow: 'hidden',
        position: 'relative',
        textAlign: "center"
    },

    title: {
        margin: '0',
        lineHeight: '1.15',
        fontSize: '3rem',
        textAlign: 'center',
        padding: '2rem',
        border: '1px solid rgba(0,0,0, 0.1)',
        borderRadius: '5px',
    },

    p: {
        fontSize: '20px',
    }
}


export default home;
