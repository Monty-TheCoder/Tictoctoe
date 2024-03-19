import React, { useEffect, useState } from "react";

const Debounce = () => {
    const [inputValue, setInputValue] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [inputValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <>
            <div className='Justify_content_center'>
                <h2>Debounce</h2>
                <hr />

                <input type="text" value={inputValue} name="search" onChange={(e) => handleChange(e)} /><br />

                <span>You have entered : &nbsp; {debouncedValue}</span>

            </div>
        </>
    );
};

export default Debounce;
