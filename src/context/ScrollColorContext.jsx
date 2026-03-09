import React, { createContext, useContext, useState, useEffect } from 'react';

const ScrollColorContext = createContext({
    currentColor: '#050507', // Default void
    textColor: '#FFFFFF', // Default white
    transitionDuration: 1.5, // Default slow transition
    setCurrentColor: () => { },
    setTextColor: () => { },
    setTransitionDuration: () => { }
});

export const ScrollColorProvider = ({ children }) => {
    const [currentColor, setCurrentColor] = useState('#050507');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [transitionDuration, setTransitionDuration] = useState(1.5);

    // Sync CSS Variables for global usage
    useEffect(() => {
        document.documentElement.style.setProperty('--current-bg-color', currentColor);
        document.documentElement.style.setProperty('--current-text-color', textColor);
        document.documentElement.style.setProperty('--current-transition', `${transitionDuration}s`);
    }, [currentColor, textColor, transitionDuration]);

    return (
        <ScrollColorContext.Provider value={{ currentColor, setCurrentColor, textColor, setTextColor, transitionDuration, setTransitionDuration }}>
            {children}
        </ScrollColorContext.Provider>
    );
};

export const useScrollColor = () => useContext(ScrollColorContext);

// Hook for sections to register their color
// Returns { setSectionColor, setSectionDuration }
export const useSectionColor = () => {
    const { setCurrentColor, setTextColor, setTransitionDuration } = useScrollColor();

    // Helper to set both bg and text color with optional duration
    // Memoized to prevent infinite loops in consumers with useEffect dependencies
    const setGlobalTheme = React.useCallback((bgColor, txtColor = '#FFFFFF', duration = 1.5) => {
        // console.log("GlobalThemeUpdate:", { bgColor, txtColor, duration }); // Commented out debug
        setCurrentColor(bgColor);
        setTextColor(txtColor);
        setTransitionDuration(duration);
    }, [setCurrentColor, setTextColor, setTransitionDuration]);

    return setGlobalTheme;
};
