import { useContext, createContext, useState, useEffect } from "react"


const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkSesh = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/check_session')
                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                }
            } catch (error) {
                console.error('Error checking session:', error)
            }
        }
        checkSesh()
    }, [])
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
export const useUser = () => useContext(UserContext)
