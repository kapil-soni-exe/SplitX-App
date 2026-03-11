import "./DashboardSkeleton.css";

function DashboardSkeleton() {
  return (
    <div className="dashboard-grid">
      
      {/* Group Summary */}
      <div className="cards hero-cards col-6 skeleton-card"></div>

      {/* To Pay */}
      <div className="cards col-3 skeleton-card"></div>

      {/* To Receive */}
      <div className="cards col-3 skeleton-card"></div>

      {/* Recent Activity */}
      <div className="cards col-12 skeleton-card tall"></div>

      {/* Insights */}
      <div className="cards col-12 skeleton-card"></div>

    </div>
  );
}

export default DashboardSkeleton;