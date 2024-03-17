import { Link } from "react-router-dom";
import Ticket from "./../images/movie_tickets.jpg";

const Home = () => {
  return (
    <>
      <div className="text-center">
        <h2>DAMN</h2>
        <hr />
        <Link to="/projects">
          <img src={Ticket} alt="project tickets"></img>
        </Link>
      </div>
    </>
  );
};

export default Home;
