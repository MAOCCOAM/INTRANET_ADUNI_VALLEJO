import React from 'react';
import './LeaderboardTable.css';

function LeaderboardTable({ examName, entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="leaderboard-empty">
        <div className="empty-icon">📊</div>
        <p>No hay datos disponibles para este simulacro.</p>
      </div>
    );
  }

  // Función para obtener clase de medalla según el puesto
  const getMedalClass = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  };

  // Función para obtener emoji de medalla
  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h3 className="leaderboard-title">{examName}</h3>
        <span className="leaderboard-count">{entries.length} participantes</span>
      </div>

      <div className="table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="col-name">Estudiante</th>
              <th className="col-rank">Puntaje</th>              
              <th className="col-score">Nota</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr 
                key={entry.id} 
                className={`leaderboard-row ${getMedalClass(entry.rank)}`}
              >
                <td className="col-name">
                  <span className="student-name">{entry.studentName}</span>
                </td>
                <td className="col-rank">
                  <span className="rank-badge">
                    {getMedalEmoji(entry.rank)}
                  </span>
                </td>   
                <td className="col-score">
                  <span className="score-value">{entry.score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardTable;