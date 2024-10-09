import { createContext ,useState} from "react";

export const UserContext=createContext(null);

export const UserProvider = (props) =>{
    const [login,setLogin]= useState(false);
    const [username1,setUsername1]= useState('Arpit Anand');
    const [image1,setImage1]= useState(null);
    const [id,setId]=useState(null);
    const [total,setTotal]=useState(0);
    const [user, setUser] = useState(null);
    const toggle=()=>{
        setLogin(!login)
    };
    return(
    <UserContext.Provider value={{login,toggle,username1,setUsername1,image1,user,setUser,setImage1,id , setId,total,setTotal}}>
        {props.children}
    </UserContext.Provider>
    );
}