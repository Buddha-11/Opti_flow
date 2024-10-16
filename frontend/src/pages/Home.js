import '../index.css'
import Navbar from '../components/Navbar'
import TaskList from '../components/Task'

const Home=()=>{
    return (
        <div className="home">
            <div className="Navbar">
                <Navbar />
            </div>
            <div className="Task">
                <TaskList />
            </div>

            
        </div>
    )
}

export default Home