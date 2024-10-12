import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';

interface AuthContextType {
    user: User | null;
    authenticating: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authenticating, setAuthenticating] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthenticating(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, authenticating }}>
            {children}
        </AuthContext.Provider>
    );
};
