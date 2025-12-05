import { useNavigate } from "react-router-dom";

export default function Error401() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="display-4">401</h1>
          <p className="lead">You are not authorized to view this page.</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <button className="btn btn-primary" onClick={goHome}>Go to Home</button>
            <button className="btn btn-outline-secondary" onClick={goLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}

