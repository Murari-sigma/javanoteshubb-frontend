import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

const topicsList = [
  "Core Java", "Advanced Java", "JDBC", "Servlet", "JSP",
  "Maven", "Hibernate", "JPA", "Spring", "Spring Boot",
  "Spring Security", "REST API", "Microservices", "MySQL",
  "Git & GitHub", "Docker", "AWS", "Interview Questions", "Projects"
];

function App() {
  // Auth States
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  // Auth Form Input States
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");

  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

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
  const fetchNotes = () => {
    setLoading(true);
    axios.get(`https://javanoteshubb-backend.onrender.com/notes/category/${selectedTopic}`)
      .then((response) => {
        setNotes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        setNotes([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (currentUser) {
      fetchNotes();
    }
  }, [selectedTopic, currentUser]);


const handleDownloadPDF = (noteTitle, elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("Note content not found!");
    return;
  }

  const opt = {
    margin: [0.4, 0.4, 0.4, 0.4],
    filename: `${noteTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Notes.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};

  // Auth Submit (Login / Signup)
  const handleAuthSubmit = (e) => {
      e.preventDefault();

      if (isSignup) {
        axios.post("https://javanoteshubb-backend.onrender.com/auth/signup", {
          name: authName,
          email: authEmail,
          password: authPassword
        })
        .then((res) => {
          alert("Registration Successful! Please Login.");
          setIsSignup(false); // Signup ke baad Login form par bhej dega
        })
        .catch((err) => {
          console.error("Signup Error:", err);
          alert(err.response?.data?.message || err.response?.data || "Signup Failed!");
        });
      } else {
        axios.post("https://javanoteshubb-backend.onrender.com/auth/login", {
          email: authEmail,
          password: authPassword
        })
        .then((res) => {

          const userData = res.data;

          localStorage.setItem(
            "java_notes_user",
            JSON.stringify(userData)
          );

          setCurrentUser(userData);

          alert("Login Successful! 🎉");

        })
        .catch((err) => {
          console.error("Login Error:", err);
          alert(err.response?.data?.message || err.response?.data || "Invalid Email or Password!");
        });
      }
    };
  // Logout Handler
  const handleLogout = () => {

      localStorage.removeItem("java_notes_user");
      localStorage.removeItem("token");

      setCurrentUser(null);

  };

    // Forgot Password
   const handleForgotPassword = async () => {
     if (!forgotEmail) {
       alert("Please enter your email.");
       return;
     }

     try {
       const res = await axios.post(
         "https://javanoteshubb-backend.onrender.com/auth/forgot-password",
         {
           email: forgotEmail,
         }
       );

       alert(res.data.message || "Reset link sent successfully.");
       setShowForgot(false);
       setForgotEmail("");
     } catch (err) {
       alert(
         err.response?.data?.message || "Unable to send reset link."
       );
     }
   };

  // Open Form for Adding New Note
  const handleOpenAddModal = () => {
    setEditMode(false);
    setCurrentNoteId(null);
    setNewTitle("");
    setNewCategory(selectedTopic);
    setNewContent("");
    setShowModal(true);
  };

  // Open Form for Editing Existing Note
  const handleOpenEditModal = (note) => {
    setEditMode(true);
    setCurrentNoteId(note.id);
    setNewTitle(note.title);
    setNewCategory(note.category);
    setNewContent(note.content);
    setShowModal(true);
  };

  // Save / Update Note Handler
  const handleSaveNote = (e) => {
    e.preventDefault();
    const noteData = {
      title: newTitle,
      category: newCategory,
      content: newContent
    };

    if (editMode) {
      axios.put(`https://javanoteshubb-backend.onrender.com/auth/notes/${currentNoteId}`, noteData)
        .then(() => {
          alert("Note updated successfully! ✨");
          setShowModal(false);
          fetchNotes();
        })
        .catch(() => alert("Error updating note"));
    } else {
      axios.post("https://javanoteshubb-backend.onrender.com/auth/notes", noteData)
        .then(() => {
          alert("Note added successfully! 🎉");
          setShowModal(false);
          if (newCategory === selectedTopic) {
            fetchNotes();
          } else {
            setSelectedTopic(newCategory);
          }
        })
        .catch(() => alert("Error adding note"));
    }
  };

  // Delete Note Handler
  const handleDeleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      axios.delete(`https://javanoteshubb-backend.onrender.com/api/notes/${id}`)
        .then(() => {
          fetchNotes();
        })
        .catch(() => alert("Error deleting note"));
    }
  };

  const filteredTopics = topicsList.filter(topic =>
    topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔒 IF NOT LOGGED IN -> SHOW LOGIN / SIGNUP SCREEN
  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img
              src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
              alt="Java Logo"
              width="40"
            />
            <h2>Java Developer Notes</h2>
          </div>
          <h3>{isSignup ? "Create Student Account" : "Welcome Back! Please Login"}</h3>

          <form onSubmit={handleAuthSubmit}>
            {isSignup && (
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address:</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn">
              {isSignup ? "Sign Up" : "Login"}
            </button>
            {!isSignup && (
              <p
                className="forgot-password"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </p>
            )}
          </form>

          <p
            className="toggle-auth"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login here"
              : "Don't have an account? Sign Up here"}
          </p>
        </div>
        {showForgot && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2>Forgot Password</h2>

              <div className="form-group">
                <label>Email Address:</label>

                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleForgotPassword}
                >
                  Send Reset Link
                </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForgot(false)}
              >
                Cancel
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 🔓 IF LOGGED IN -> MAIN APPLICATION VIEW
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img
            src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
            alt="Java Logo"
            width="32"
          />
          <h2>Java Developer Notes</h2>
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <input
            type="text"
            className="search-bar"
            placeholder="🔍 Search topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* 👑 SHOW "ADD NOTE" BUTTON ONLY IF USER IS ADMIN */}

        {(currentUser?.role === 'ADMIN' || currentUser?.email === 'pandeymurari571@gmail.com') && (
          <button className="add-btn" onClick={handleOpenAddModal}>
            + Add Note
          </button>
        )}


          {/* User Profile Badge & Logout Button */}

                    {currentUser ? (
                      <div className="user-badge">
                        <span className="user-name-glow">
                          {(currentUser?.role === 'ADMIN' || currentUser?.email === 'pandeymurari571@gmail.com') ? '👑 ' : '🎓 '}
                          {currentUser?.name || currentUser?.email}
                        </span>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                      </div>
                    ) : (
                      /* Jab login nahi hai tab ye wala login options dikhega */
                      <div className="auth-trigger-group">
                        <button className="login-btn" onClick={() => setIsSignup(false)}>
                          Login
                        </button>
                        <button className="signup-btn" onClick={() => setIsSignup(true)}>
                          Signup
                        </button>
                      </div>
                    )}
                  </div>
                </nav>
      {/* Main Layout */}
      <div className="main-layout">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <h3>Topics</h3>
          <ul>
            {filteredTopics.map((topic, index) => (
              <li
                key={index}
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

                {loading && <p>Loading notes from database...</p>}

                {!loading && notes.length === 0 && (
                  <p className="no-notes">No notes available for this topic.</p>
                )}

                {!loading && notes.length > 0 && (
                  notes.map((note) => (
                    <div key={note.id || note._id} className="note-card">
                      <div className="note-header">
                        <h3>{note.title}</h3>

                        <div className="action-buttons" style={{ display: 'flex', gap: '8px' }}>
                          {/* PDF Download Button */}
                          <button
                            className="pdf-btn"
                            onClick={() => handleDownloadPDF(note.title, `pdf-content-${note.id}`)}
                          >
                            📄 Download PDF
                          </button>

                          {/* Edit/Delete Buttons for Admin */}
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
                                    onClick={() => {
                                      navigator.clipboard.writeText(codeText);
                                      alert("Code copied to clipboard! 📋");
                                    }}
                                  >
                                    Copy
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
                )}
              </main>

                         {/* Add / Edit Modal */}
                         {showModal && (
                           <div className="modal-overlay">
                             <div className="modal-box">
                               <h2>{editMode ? "✏️ Edit Note" : "➕ Add New Note"}</h2>

                               <form onSubmit={handleSaveNote}>
                                 <div className="form-group">
                                   <label>Note Title:</label>
                                   <input
                                     type="text"
                                     value={newTitle}
                                     onChange={(e) => setNewTitle(e.target.value)}
                                     required
                                   />
                                 </div>

                                 <div className="form-group">
                                   <label>Category / Topic:</label>
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

                                   <button
                                     type="button"
                                     className="cancel-btn"
                                     onClick={() => setShowModal(false)}
                                   >
                                     Cancel
                                   </button>
                                 </div>
                               </form>
                             </div>
                           </div>
                         )}
                       </div>

                       </div>
                   );
               }

                 export default App;