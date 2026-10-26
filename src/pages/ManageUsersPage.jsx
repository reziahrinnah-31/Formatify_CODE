import { useState } from 'react';
import { Icon } from '../AdminDashboard';
import { getUsers } from '../../utils/store';

const ManageUsersPage = () => {
  const [filter, setFilter] = useState('all');
  const users = getUsers();

  const filtered = filter === 'all'
    ? users
    : users.filter(u => u.dept?.toLowerCase() === filter);

  const mcaCount = users.filter(u => u.dept === 'MCA').length;
  const bcaCount = users.filter(u => u.dept === 'BCA').length;

  return (
    <main className="a-content">
      <div className="a-page-top" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="a-page-title">Manage Users</h1>
          <p className="a-page-sub" style={{ marginBottom: 0 }}>
            Students registered on the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="a-filters" style={{ marginTop: 20 }}>
        {['all', 'mca', 'bca'].map(f => (
          <button
            key={f}
            className={`a-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="a-users-stats">
        <div className="a-users-stat">
          <span>Total Students</span>
          <strong>{users.length}</strong>
        </div>
        <div className="a-users-stat">
          <span>Active</span>
          <strong className="green">{users.length}</strong>
        </div>
        <div className="a-users-stat">
          <span>MCA</span>
          <strong className="red">{mcaCount}</strong>
        </div>
        <div className="a-users-stat">
          <span>BCA</span>
          <strong className="gold">{bcaCount}</strong>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
          <h3 style={{ marginBottom: 8 }}>No students yet</h3>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>
            Students appear here automatically when they register.
          </p>
        </div>
      ) : (
        <div className="a-users-table-wrap">
          <table className="a-users-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Department</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const initials = (u.name || 'U')
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();
                const avatarBg = u.dept === 'MCA' ? 'var(--red)' : 'var(--gold)';
                return (
                  <tr key={u.id ?? i}>
                    <td>
                      <div className="a-user-name-cell">
                        <div className="a-user-avatar" style={{ background: avatarBg }}>
                          {initials}
                        </div>
                        <span style={{ fontWeight: 700 }}>{u.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`a-dept-badge ${u.dept?.toLowerCase()}`}>
                        {u.dept}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text3)' }}>{u.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default ManageUsersPage;