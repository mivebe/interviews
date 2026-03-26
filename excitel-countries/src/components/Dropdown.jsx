import { useState } from 'react'
import '../styles/Dropdown.css'
import upArrow from '../resources/icons/up-arrow.png'
import downArrow from '../resources/icons/down-arrow.png'


const Dropdown = ({ options, onChange, listItemType, icon }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);

  const optionsList = options.map(o => o.value) || [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
  ];

  const toggleOptions = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelection = (index) => {
    setSelectedOption(index);
    setIsDropdownOpen(false);
    onChange(optionsList[index])
  };

  const handleKeyDown = (index) => (e) => {
    switch (e.key) {
      case " ":
      case "SpaceBar":
      case "Enter":
        e.preventDefault();
        handleSelection(index);
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (e) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsDropdownOpen(false);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedOption(
          selectedOption - 1 >= 0 ? selectedOption - 1 : optionsList.length - 1
        );
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedOption(
          selectedOption === optionsList.length - 1 ? 0 : selectedOption + 1
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="table-header__section">
      <div className="inpit-dropdown__container">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          className={`inpit-dropdown__button ${isDropdownOpen ? "expanded" : ""}`}
          onClick={toggleOptions}
          onKeyDown={handleListKeyDown}
        >
          {icon && <img className="left-icon" src={icon} alt="left-icon" />}
          <p className='dropdown__text' value={optionsList[selectedOption]} >
            {options.find(o => o.value === optionsList[selectedOption]).title}
          </p>
          <img className='dropdown__arrow' src={isDropdownOpen ? upArrow : downArrow} alt='dropdown-arrow' />
        </button>
        <ul
          className={`inpit-dropdown__options ${isDropdownOpen ? "show" : ""}`}
          role="listbox"
          aria-activedescendant={optionsList[selectedOption]}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {optionsList.map((option, index) =>
              <li
                key={index}
                id={option}
                role="option"
                aria-selected={selectedOption === index}
                tabIndex={0}
                onKeyDown={handleKeyDown(index)}
                onClick={() => {
                  handleSelection(index);
                }}
              >
                {listItemType === 'text' ?
                  option :
                  <>
                    <input type='checkbox' id={option} name={option} defaultChecked={options.find(o => o.value === option).defaultSelected} />
                    <label htmlFor={option}>{options.find(o => o.value === option).title}</label>
                  </>}
              </li>
            )
          }
        </ul>
      </div>
    </div>
  );
};
export default Dropdown
