import "./BorrowHistoryModal.css";

const BorrowHistoryModal = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;
  const getBorrowStatusBadge = (status: string) => {
    const st = status.toUpperCase();

    switch (st) {
      case "ISSUED":
        return <span className="br-status br-issued">Issued</span>;

      case "RETURNED":
        return <span className="br-status br-returned">Returned</span>;

      case "LOST":
        return <span className="br-status br-lost">Lost</span>;

      case "OVERDUE":
        return <span className="br-status br-overdue">Overdue</span>;

      default:
        return <span className="br-status br-unknown">Unknown</span>;
    }
  };

  return (
    <div className="history-modal-overlay">
      <div className="history-modal">
        <h2>User Borrow History</h2>

        {history.length === 0 ? (
          <p>No borrowing history found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Issued Date</th>
                <th>Return Date</th>
                <th>Due Date</th>
                <th>overdue Days</th>
                <th>Fine</th>
                <th>note</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, index) => (
                <tr key={index}>
                  <td>{h.bookId?.title}</td>
                  <td>{new Date(h.issueDate).toLocaleDateString()}</td>
                  <td>
                    {h.returnDate
                      ? new Date(h.returnDate).toLocaleDateString()
                      : "Not Returned"}
                  </td>
                  <td>
                    {h.dueDate ? new Date(h.dueDate).toLocaleDateString() : ""}
                  </td>
                  <td>{h.overdueDays}</td>
                  <td>{h.fine}</td>
                  <td>{h.note}</td>
                  <td>{getBorrowStatusBadge(h.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button
          onClick={onClose}
          className="close-btn"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BorrowHistoryModal;
