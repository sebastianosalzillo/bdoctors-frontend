import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const Stars = ({ voto, onChange, isActive= false }) => {
    const array = [1, 2, 3, 4, 5];
    

    return (
        <>
            {array.map((cur) => (
                <span key={cur} onClick={isActive ? () => onChange(cur) : null} className={isActive ? 'star-interactive' : 'star-static'} >
                    {voto >= cur ? <FontAwesomeIcon icon={solidStar} /> : <FontAwesomeIcon icon={regularStar} />}
                </span>
            ))}
        </>
    );
};

export default Stars;
