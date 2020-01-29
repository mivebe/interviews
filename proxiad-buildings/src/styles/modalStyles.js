

const modal = {
    modal: {
        position: "absolute",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '100',
        borderRadius: '5px',
        backgroundColor: "lightgrey",
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backdropFilter: 'blur(2px)',

    },

    img: {
        maxWidth: '80px',
    },

    file: {
        opacity: '0',
        zIndex: '-1',
        position: 'absolute'
    },

    input: {
        borderRadius: '5px',
        padding: '5px',
        margin: '10px',
        border: 'none',
        outline: 'none',
        maxWidth: '33%'
    },

    icon: {
        maxWidth: '25px',
        cursor: 'pointer',
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
}

export default modal