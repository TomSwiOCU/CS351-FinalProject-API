import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTasksData } from "../../core/hooks/useTasksData";
import "../panel.css";

export default function Dashboard() {
  
  // Gets selectedListId from AppShell Outlet
  const { selectedListId } = useOutletContext<{
    selectedListId: number | null;
  }>();

  const { tasks, lists, loading } = useTasksData(selectedListId);
  // JOURNAL STATE
  const [journalDate, setJournalDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [rating, setRating] = useState("");
  const [journalText, setJournalText] = useState("");
  const [savedJournal, setSavedJournal] = useState(null);

  // TASK STATS
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const previewTasks = tasks.slice(0, 3);

  const saveJournal = () => {
    setSavedJournal({
      date: journalDate,
      rating,
      text: journalText
    });

    setJournalText("");
    setRating("");
  };

  return (
    <section className="panel">

      {/* HEADER */}
      <h2>Dashboard</h2>
      <p className="lead">Welcome back! Here is your overview</p>

      {/* STATS */}
      <div className="dashboardGrid">
        <div className="card">
          <h3>Tasks</h3>
          <p>Total: {tasks.length}</p>
          <p>Completed: {completedTasks}</p>
          <p>Pending: {pendingTasks}</p>
        </div>

        <div className="card">
          <h3>Lists</h3>
          <p>{lists.length} active lists</p>
        </div>

        <div className="card">
          <h3>Have you been productive?</h3>
          <p>{completedTasks > 0 ? "Keep going" : "Start your first task!"}</p>
        </div>
      </div>

      {/* TASK PREVIEW */}
      <div className="card">
        <h3>Today's Tasks</h3>

        {loading ? (
          <p>Loading tasks...</p>
        ) : previewTasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          <ul>
            {previewTasks.map(task => (
              <li key={task.id}>
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* JOURNAL */}
      <div className="card">
        <h3>Daily Journal</h3>

        <label>Date</label>
        <input
          type="date"
          value={journalDate}
          onChange={(e) => setJournalDate(e.target.value)}
        />

        <label>Rate Your Day (1 - 10)</label>
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <label>Journal Entry</label>
        <textarea
          rows={5}
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />

        <button onClick={saveJournal}>
          Save Your Journal
        </button>

        {savedJournal && (
          <div className="savedBox">
            <h4>Saved Entry</h4>
            <p><strong>Date:</strong> {savedJournal.date}</p>
            <p><strong>Rating:</strong> {savedJournal.rating}/10</p>
            <p>{savedJournal.text}</p>
          </div>
        )}
      </div>

    </section>
  );
}
