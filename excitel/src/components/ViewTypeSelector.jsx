const ViewTypeSelector = ({onSelect}) => (
        <>
            <button title="Select Row" name="select-row" value={true} onClick={onSelect}>Row</button>
            <button title="Select Card" name="select-card" value={false} onClick={onSelect}>Card</button>
        </>
    );
export default ViewTypeSelector