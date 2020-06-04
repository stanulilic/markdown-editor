import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() =>{
        // load saved state in localStorage
        const savedState = localStorage.getItem(key);
        return savedState ? savedState:initialValue;
    })

    const setValue = value => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        localStorage.setItem(key, valueToStore);
    }

    return [storedValue, setValue];
}

export default useLocalStorage;
    /*
    https://usehooks.com/useLocalStorage/
    */
