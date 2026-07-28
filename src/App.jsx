import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TOPICS = [
  "Core Java", "Advanced Java", "JDBC", "Servlet", "JSP",
  "Maven", "Hibernate", "JPA", "Spring", "Spring Boot",
  "Spring Security", "REST API", "Microservices", "MySQL",
  "Git & GitHub", "Docker", "AWS", "Interview Questions", "Projects"
];

function App() {
  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Auth Form Input States
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // App Main States
  const [selectedTopic, setSelectedTopic] = useState("Core Java");
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal / Form State for Add/Edit
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Core Java");
  const [newContent, setNewContent] = useState("");

  // Check Local Storage on Initial Load
  useEffect(() => {
    const savedUser = localStorage.getItem("java_notes_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch Notes Function
  const fetchNotes = async (topic) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://javanoteshubb-backend.onrender.com/notes/category/${encodeURIComponent(topic)}`);
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(selectedTopic);
  }, [selectedTopic]);

  // Auth Submit Handler
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      axios.post("https://javanoteshubb-backend.onrender.com/auth/signup", {
        name: authName,
        email: authEmail,
        password: authPassword
      })
      .then(() => {
        alert("Registration Successful! Please Login.");
        setIsSignup(false);
      })
      .catch(err => {
        alert(err.response?.data || "Signup Failed!");
      });
    } else {
      axios.post("https://javanoteshubb-backend.onrender.com/auth/login", {
        email: authEmail,
        password: authPassword
      })
      .then((res) => {
        const userData = (typeof res.data === 'object' && res.data !== null)
          ? res.data
          : { email: authEmail, name: authEmail.split('@')[0] };

        localStorage.setItem("java_notes_user", JSON.stringify(userData));
        setCurrentUser(userData);
        setShowAuthModal(false);
        alert("Login Successful! 🎉");
      })
      .catch((err) => {
        console.error("Login Fail:", err);
        alert(err.response?.data || "Invalid Email or Password!");
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("java_notes_user");
    setCurrentUser(null);
  };

  const handleOpenAddModal = () => {
    setEditMode(false);
    setNewTitle("");
    setNewCategory(selectedTopic);
    setNewContent("");
    setShowModal(true);
  };

  const handleOpenEditModal = (note) => {
    setEditMode(true);
    setCurrentNoteId(note.id);
    setNewTitle(note.title);
    setNewCategory(note.category || selectedTopic);
    setNewContent(note.content);
    setShowModal(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    const noteData = { title: newTitle, category: newCategory, content: newContent };
    try {
      if (editMode) {
        await axios.put(`https://javanoteshubb-backend.onrender.com/notes/${currentNoteId}`, noteData);
      } else {
        await axios.post("https://javanoteshubb-backend.onrender.com/notes", noteData);
      }
      setShowModal(false);
      fetchNotes(selectedTopic);
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note!");
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`https://javanoteshubb-backend.onrender.com/notes/${id}`);
        fetchNotes(selectedTopic);
      } catch (err) {
        console.error("Error deleting note:", err);
        alert("Failed to delete note!");
      }
    }
  };

  const handleDownloadPDF = (title, elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const opt = {
      margin: 10,
      filename: `${title.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
    } else {
      alert("PDF library is loading or not available. Please print using Ctrl+P!");
      window.print();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="navbar">
        <div className="nav-brand">
          <h2>☕ JavaNotesHub</h2>
        </div>
        <div className="nav-search">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="auth-buttons">
          {currentUser ? (
            <div className="user-profile">
              <span>👤 {currentUser.name || currentUser.email}</span>
              {(currentUser?.role === 'ADMIN' || currentUser?.email === 'pandeymurari571@gmail.com') && (
                <button className="add-note-btn" onClick={handleOpenAddModal}>➕ Add Note</button>
              )}
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => { setIsSignup(false); setShowAuthModal(true); }}>
              Login / Signup
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Topics</h3>
          <ul>
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className={selectedTopic === topic ? "active" : ""}
                onClick={() => setSelectedTopic(topic)}
              >
                📘 {topic}
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          <h1>{selectedTopic} Notes</h1>
          <hr style={{ margin: '15px 0', borderColor: '#334155' }} />

          {loading ? (
            <p>Loading notes from database...</p>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id || note._id} className="note-card">
                <div className="note-header">
                  <h3>{note.title}</h3>

                  <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="pdf-btn"
                      onClick={() => handleDownloadPDF(note.title, `pdf-content-${note.id}`)}
                    >
                      📄 Download PDF
                    </button>

                    {(currentUser?.role === 'ADMIN' || currentUser?.email === 'pandeymurari571@gmail.com') && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="edit-btn" onClick={() => handleOpenEditModal(note)}>✏️ Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteNote(note.id)}>🗑️ Delete</button>
                      </div>
                    )}
                  </div>
                </div>

                <div id={`pdf-content-${note.id}`} className="note-content">
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeText = String(children).replace(/\n$/, '');

                        return !inline && match ? (
                          <div style={{ position: 'relative' }}>
                            <button
                              style={{ position: 'absolute', right: '10px', top: '10px' }}
                              onClick={() => {
                                navigator.clipboard.writeText(codeText);
                                alert("Code copied to clipboard! 📋");
                              }}
                            >
                              📋 Copy
                            </button>
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {codeText}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {note.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))
          ) : (
            <p className="no-notes">No notes available for this topic.</p>
          )}
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleAuthSubmit}>
              {isSignup && (
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {isSignup ? "Sign Up" : "Login"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowAuthModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
            <p style={{ marginTop: '10px', cursor: 'pointer', textAlign: 'center' }} onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </p>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editMode ? "✏️ Edit Note" : "➕ Add New Note"}</h2>
            <form onSubmit={handleSaveNote}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content (Markdown):</label>
                <textarea
                  rows="8"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Save Note
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;