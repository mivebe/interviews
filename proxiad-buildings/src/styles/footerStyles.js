
const footer = {
    halfFlex: {
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '0 2rem',
    },

    link: {
        display: 'flex',
        flexGrow: '0',
        padding: '0 2rem 0 0',
        transition: 'all .3s ease',
    },

    footerTitle: {
        display: 'flex',
        flexGrow: '0',
        padding: '0 2rem 0 0',
        transition: 'all .3s ease',
        marginLeft: 'auto',
        color: 'black',
        fontSize: '1.4rem',
        textAlign: 'right'
    },

    footer: {
        width: '100vw',
        height: '100px',
        borderTop: '1px solid #eaeaea',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed',
        bottom: '0',
        background: `rgba(255,255,255, 0.9)`,
        backdropFilter: 'blur(5px)',
        overflow: 'hidden'
    }
}


export default footer;
