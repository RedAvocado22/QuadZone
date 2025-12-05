import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4">404</h1>
          <p className="lead">The page you are looking for does not exist.</p>
          <button className="btn btn-primary" onClick={goHome}>Go to Home</button>
        </div>
      </div>
    </div>
  );
}

