import { Link } from "react-router-dom";
import Bird from "./../images/bird.png";

const Home = () => {
  return (
    <>
      <div className="text-center">
        <h2>DAMN</h2>
        <hr />
        <Link to="/projects">
          <img 
            src={Bird} 
            alt="project birds"
            style={{ maxWidth: '10%', maxHeight: '10%' }} // 添加这行样式
          />
        </Link>
      </div>
    </>
  );
};

export default Home;
