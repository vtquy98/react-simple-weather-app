import React from "react";
import { LocationHistoryModel } from "../../models";

import "./History.scss";

type Props = {
  onLocationClick: (location: any) => void;
};

const History = ({ onLocationClick }: Props) => {
  const initHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
  const [history, setHistory] = React.useState(initHistory);

  const onDeleteHistory = (h: LocationHistoryModel) => {
    const newHistory = history.filter(
      (item: LocationHistoryModel) =>
        item.position.latitude !== h.position.latitude &&
        item.position.longitude !== h.position.longitude
    );
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  return (
    <div className="history">
      <label className="title">History</label>
      <div className="history-items-container">
        {history.length > 0 ? (
          history.map((h: LocationHistoryModel, idx: number) => (
            <div className="history-item" key={idx}>
              <div>
                {idx + 1}. {h.country}
              </div>

              <div className="actions">
                <span>{new Date(h.timestamp).toLocaleString()}</span>
                <button
                  className="action-btn"
                  onClick={() => onLocationClick(h)}
                >
                  &#128270;
                </button>
                <button
                  className="action-btn"
                  onClick={() => onDeleteHistory(h)}
                >
                  &#128465;
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-record">No record</div>
        )}
      </div>
    </div>
  );
};

export default History;
