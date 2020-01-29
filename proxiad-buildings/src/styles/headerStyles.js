
const header = {
    halfFlex: {
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '0 2rem',
    },

    inlineA: {
        display: 'flex',
        flexGrow: '0',
        padding: '0 2rem 0 0',
        transition: 'all .3s ease'
    },

    imageContainer: {
        width: '5rem',
        overflow: 'hidden'
    },

    img: {
        width: "4rem",
        height: "4rem",
        overflow: 'hidden'
    },


    header: {
        width: '100vw',
        height: '100px',
        borderBottom: '1px solid #eaeaea',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        top: '0',
        background: `rgba(255,255,255, 0.9)`,
        backdropFilter: 'blur(5px)',
    }
}


export default header;
