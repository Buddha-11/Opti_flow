import '../index.css'
import Navbar from '../components/Navbar'
import TaskList from '../components/Task'
import Image from '../images/Home_Image.png'

const Home = () => {
    return (
        <div className="home">
            <Navbar />
            <div className="spacer3"></div>
            
            <div className="content">
                <div className="text">
                    <h1>Optimize your workflow with <strong>OptiFlow</strong></h1>
                </div>
                <div className="image">
                    <img src={Image} alt="Workflow optimization" />
                </div>
            </div>
            
            <div className="Task">
                <TaskList />
            </div>
        </div>
    )
}

export default Home
