import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PersonalizationContextType {
    compactMode: boolean;
    setCompactMode: (value: boolean) => void;
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
    const [compactMode, setCompactMode] = useState(() => {
        return localStorage.getItem("compactMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("compactMode", String(compactMode));
        if (compactMode) document.body.classList.add("compact-mode");
        else document.body.classList.remove("compact-mode");
    }, [compactMode]);

    return (
        <PersonalizationContext.Provider value={{ compactMode, setCompactMode }}>
            {children}
        </PersonalizationContext.Provider>
    );
}

export function usePersonalization() {
    const context = useContext(PersonalizationContext);
    if (context === undefined) {
        throw new Error("usePersonalization must be used within a PersonalizationProvider");
    }
    return context;
}
