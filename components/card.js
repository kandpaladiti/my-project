// components/Card.js
export default function Card() {
    return (
      <div className="card">
        <img src="https://via.placeholder.com/150" alt="Crop" />
        <div className="card-content">
          <h3 className="card-title">Crop Name</h3>
          <p className="card-description">Description of the crop.</p>
          <span className="card-region">Region: Asia</span>
        </div>
      </div>
    );
  }
  