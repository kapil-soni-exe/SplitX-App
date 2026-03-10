import { useEffect, useState } from "react";
import { getProfileStats } from "../../../../api/profile.api";

function ProfileStats() {

  const [stats, setStats] = useState({
    groups: 0,
    expenses: 0,
    settlements: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadStats = async () => {
      try {

        const res = await getProfileStats();
        console.log(res.data)

        setStats(res.data);

      } catch (err) {

        console.error("Failed to load stats");

      } finally {
        setLoading(false);
      }
    };

    loadStats();

  }, []);

  if (loading) return null;

  return (
    <div className="profile-stats">

      <div className="stat">
        <div className="stat-number">{stats.groups}</div>
        <div className="stat-label">Groups</div>
      </div>

      <div className="stat">
        <div className="stat-number">{stats.expenses}</div>
        <div className="stat-label">Expenses</div>
      </div>

      <div className="stat">
        <div className="stat-number">{stats.settlements}</div>
        <div className="stat-label">Settled</div>
      </div>

    </div>
  );
}

export default ProfileStats;