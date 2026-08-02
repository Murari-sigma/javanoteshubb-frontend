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

    const [showMenu, setShowMenu] = useState(false);
    const [menuSearch, setMenuSearch] = useState("");
    const [showTopics, setShowTopics] = useState(false);

    const filteredMenuTopics = topicsList.filter(topic =>
      topic.toLowerCase().includes(menuSearch.toLowerCase())
    );


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
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
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
      axios.put(`https://javanoteshubb-backend.onrender.com/notes/${currentNoteId}`, noteData)
        .then(() => {
          alert("Note updated successfully! ✨");
          setShowModal(false);
          fetchNotes();
        })
        .catch(() => alert("Error updating note"));
    } else {
      axios.post("https://javanoteshubb-backend.onrender.com/notes", noteData)
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
      if (!id) {
        alert("Invalid Note ID!");
        return;
      }

      if (window.confirm("Are you sure you want to delete this note?")) {
        axios.delete(`https://javanoteshubb-backend.onrender.com/notes/${id}`)
          .then(() => {
            alert("Note Deleted Successfully! 🗑️");
            // UI se instantly note remove karne ke liye:
            setNotes(notes.filter((note) => (note.id || note._id) !== id));
          })
          .catch((err) => {
            console.error("Delete Error:", err);
            alert(err.response?.data?.message || err.response?.data || "Error deleting note!");
          });
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
            <h2>Java Developer</h2>
          </div>
          <h3>{isSignup ? "Create Student Account" : "Welcome Back! Please Login"}</h3>

          <form onSubmit={handleAuthSubmit}>
            {isSignup && (
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Murari Pandey"
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

                 <div
                   style={{
                     display: "flex",
                     alignItems: "center",
                     gap: "10px",
                     marginLeft: "auto",
                   }}
                 >
                   {/* Add Note - Only Admin */}
                   {(currentUser?.role === "ADMIN" ||
                     currentUser?.email === "pandeymurari571@gmail.com") && (
                     <button className="add-btn" onClick={handleOpenAddModal}>
                       + Add Note
                     </button>
                   )}

               {currentUser ? (
                 <>
                   {/* 3 Line Menu Button */}
                   <div
                     className="menu-icon"
                     onClick={() => setShowMenu(!showMenu)}
                   >
                     ☰
                   </div>


                   {showMenu && (
                     <div className="menu-dropdown">

                       <button
                         className="menu-item home-item"
                         onClick={() => {
                           setSelectedTopic(null);
                           setShowMenu(false);
                           window.scrollTo({ top: 0, behavior: "smooth" });
                         }}
                       >
                         🏠 Back to Home
                       </button>

                            <hr />
                       <button
                         className="menu-item logout-item"
                         onClick={() => {
                           handleLogout();
                           setShowMenu(false);
                         }}
                       >
                         🚪 Logout
                       </button>

                       <hr />

                       <h4>📚 Topics</h4>

                       <input
                         type="text"
                         placeholder="Search Topic..."
                         value={menuSearch}
                         onChange={(e) => setMenuSearch(e.target.value)}
                         className="menu-search"
                       />

                       <div className="menu-topic-list">
                         {filteredMenuTopics.map((topic) => (
                           <div
                             key={topic}
                             className="menu-item"
                             onClick={() => {
                               setSelectedTopic(topic);
                               setShowMenu(false);
                             }}
                           >
                             📘 {topic}
                           </div>
                         ))}
                       </div>

                     </div>
                   )}
                 </>
               ) : (
                 <div className="auth-trigger-group">
                   <button
                     className="login-btn"
                     onClick={() => setIsSignup(false)}
                   >
                     Login
                   </button>

                   <button
                     className="signup-btn"
                     onClick={() => setIsSignup(true)}
                   >
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

                    {/* HOME VIEW */}
                    {!selectedTopic && (
                      <>
                        {!showTopics && (
                          <section className="hero">
                            <span className="hero-eyebrow">&lt;/&gt; developer.hub</span>
                            <h1 className="hero-title">Welcome to Java Developer Hub ☕</h1>
                            <p className="hero-subtitle">
                              Your notes, organized — from Core Java basics to Spring Boot in production.
                            </p>
                            <button className="start-btn" onClick={() => setShowTopics(true)}>
                              Start Learning
                            </button>
                          </section>
                        )}

                        {!showTopics && (
                          <>
                            <hr style={{ margin: '15px 0', borderColor: '#334155' }} />
                            <h2 className="topics-heading">Explore Topics</h2>
                            <div className="topics-grid">
                              {[
                                { icon: '{ }', name: 'Core Java', desc: 'OOPs, collections, streams, exceptions & the fundamentals every backend dev needs.' },
                                { icon: '☕', name: 'Advanced Java', desc: 'Multithreading, concurrency, JVM internals & memory management.' },
                                { icon: '🔌', name: 'JDBC', desc: 'Database connectivity, PreparedStatement, ResultSet & transaction management.' },
                                { icon: '🌐', name: 'Servlet', desc: 'HTTP request/response lifecycle, filters, session management & web app fundamentals.' },
                                { icon: '📄', name: 'JSP', desc: 'Java Server Pages, JSTL, EL expressions & dynamic web content generation.' },
                                { icon: '📦', name: 'Maven', desc: 'Build automation, dependency management, POM.xml & project lifecycle.' },
                                { icon: '🗄', name: 'Hibernate', desc: 'ORM mapping, sessions, caching & entity lifecycle.' },
                                { icon: '💎', name: 'JPA', desc: 'Repositories, queries, relationships & the Java persistence standard.' },
                                { icon: '🌱', name: 'Spring', desc: 'IoC, dependency injection, beans & the core of the Spring ecosystem.' },
                                { icon: '🚀', name: 'Spring Boot', desc: 'Auto-configuration, REST APIs, starters & building production-ready apps fast.' },
                                { icon: '🔐', name: 'Spring Security', desc: 'Authentication, authorization, JWT & securing your endpoints.' },
                                { icon: '🔗', name: 'REST API', desc: 'RESTful design, HTTP methods, status codes & API best practices.' },
                                { icon: '🧩', name: 'Microservices', desc: 'Service decomposition, Eureka, API Gateway & distributed systems patterns.' },
                                { icon: '🗃️', name: 'MySQL', desc: 'SQL queries, joins, indexes, stored procedures & database design.' },
                                { icon: '🐙', name: 'Git & GitHub', desc: 'Version control, branching, merging, pull requests & collaboration.' },
                                { icon: '🐳', name: 'Docker', desc: 'Containerization, Dockerfile, images & deploying Java apps with Docker Compose.' },
                                { icon: '☁️', name: 'AWS', desc: 'EC2, S3, RDS, IAM & deploying Spring Boot apps on the cloud.' },
                                { icon: '🎯', name: 'Interview Questions', desc: 'Top Java & Spring Boot interview questions & HR round preparation.' },
                                { icon: '🏗️', name: 'Projects', desc: 'End-to-end Java projects — REST APIs, microservices & full-stack apps.' },
                              ].map((topic) => (
                                <div key={topic.name} className="topic-card">
                                  <span className="topic-icon">{topic.icon}</span>
                                  <h3>{topic.name}</h3>
                                  <p>{topic.desc}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {showTopics && (
                          <>
                            <div className="topic-view-header">
                              <button className="back-home-btn" onClick={() => setShowTopics(false)}>
                                ← Back
                              </button>
                              <h2 className="topic-view-title">📚 Choose a Topic</h2>
                            </div>
                            <input
                              type="text"
                              className="topic-search-input"
                              placeholder="🔍 Search topic..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              style={{ margin: '0.75rem 0', width: '100%', boxSizing: 'border-box' }}
                            />
                            <hr style={{ margin: '15px 0', borderColor: '#334155' }} />
                            <div className="topics-grid">
                              {[
                                { icon: '{ }', name: 'Core Java', desc: 'OOPs, collections, streams, exceptions & the fundamentals every backend dev needs.' },
                                { icon: '☕', name: 'Advanced Java', desc: 'Multithreading, concurrency, JVM internals & memory management.' },
                                { icon: '🔌', name: 'JDBC', desc: 'Database connectivity, PreparedStatement, ResultSet & transaction management.' },
                                { icon: '🌐', name: 'Servlet', desc: 'HTTP request/response lifecycle, filters, session management & web app fundamentals.' },
                                { icon: '📄', name: 'JSP', desc: 'Java Server Pages, JSTL, EL expressions & dynamic web content generation.' },
                                { icon: '📦', name: 'Maven', desc: 'Build automation, dependency management, POM.xml & project lifecycle.' },
                                { icon: '🗄', name: 'Hibernate', desc: 'ORM mapping, sessions, caching & entity lifecycle.' },
                                { icon: '💎', name: 'JPA', desc: 'Repositories, queries, relationships & the Java persistence standard.' },
                                { icon: '🌱', name: 'Spring', desc: 'IoC, dependency injection, beans & the core of the Spring ecosystem.' },
                                { icon: '🚀', name: 'Spring Boot', desc: 'Auto-configuration, REST APIs, starters & building production-ready apps fast.' },
                                { icon: '🔐', name: 'Spring Security', desc: 'Authentication, authorization, JWT & securing your endpoints.' },
                                { icon: '🔗', name: 'REST API', desc: 'RESTful design, HTTP methods, status codes & API best practices.' },
                                { icon: '🧩', name: 'Microservices', desc: 'Service decomposition, Eureka, API Gateway & distributed systems patterns.' },
                                { icon: '🗃️', name: 'MySQL', desc: 'SQL queries, joins, indexes, stored procedures & database design.' },
                                { icon: '🐙', name: 'Git & GitHub', desc: 'Version control, branching, merging, pull requests & collaboration.' },
                                { icon: '🐳', name: 'Docker', desc: 'Containerization, Dockerfile, images & deploying Java apps with Docker Compose.' },
                                { icon: '☁️', name: 'AWS', desc: 'EC2, S3, RDS, IAM & deploying Spring Boot apps on the cloud.' },
                                { icon: '🎯', name: 'Interview Questions', desc: 'Top Java & Spring Boot interview questions & HR round preparation.' },
                                { icon: '🏗️', name: 'Projects', desc: 'End-to-end Java projects — REST APIs, microservices & full-stack apps.' },
                              ]
                                .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((topic) => (
                                  <div
                                    key={topic.name}
                                    className="topic-card"
                                    onClick={() => {
                                      setSelectedTopic(topic.name);
                                      setShowTopics(false);
                                      setSearchQuery("");
                                    }}
                                  >
                                    <span className="topic-icon">{topic.icon}</span>
                                    <h3>{topic.name}</h3>
                                    <p>{topic.desc}</p>
                                  </div>
                                ))}
                            </div>
                          </>
                        )}
                      </>
                    )}

                   {/* TOPIC VIEW - jab topic select ho */}
                   {selectedTopic && (
                     <>
                       {/* Topic Header */}
                       <div className="topic-view-header">
                         <button className="back-home-btn" onClick={() => setSelectedTopic(null)}>
                           ← Back to Home
                         </button>
                         <h2 className="topic-view-title">📘 {selectedTopic}</h2>

                         {/* Search + Add Note */}
                         <div className="topic-view-actions">
                           <input
                             type="text"
                             className="topic-search-input"
                             placeholder="🔍 Search notes..."
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                           />

                         </div>
                       </div>

                       <hr style={{ margin: '15px 0', borderColor: '#334155' }} />

                       {loading && <p>Loading notes...</p>}

                       {selectedSubtopic && (
                         <div className="subtopic-view-header">
                           <button className="back-home-btn" onClick={() => setSelectedSubtopic(null)}>
                             ← Back to Topics
                           </button>
                           <h3 className="topic-view-title">📘 {selectedSubtopic}</h3>

                           {/* Add Note - Sirf Admin */}
                           {(currentUser?.role === "ADMIN" || currentUser?.email === "pandeymurari571@gmail.com") && (
                             <button className="add-btn" onClick={handleOpenAddModal}>
                               + Add Note
                             </button>
                           )}
                         </div>
                       )}

                       {/* Core Java subtopics - jab notes nahi hain */}
                       {!loading && notes.length === 0 && selectedTopic === "Core Java" && (
                         <div className="subtopics-grid">
                           {[
                             { num: '01', name: 'Introduction to Java', desc: 'History, JDK/JRE/JVM, how Java works, platform independence.' },
                             { num: '02', name: 'Java Basics', desc: 'Data types, variables, operators, type casting & input/output.' },
                             { num: '03', name: 'Control Statements', desc: 'if-else, switch, loops (for, while, do-while) & break/continue.' },
                             { num: '04', name: 'Arrays', desc: 'Single & multi-dimensional arrays, array methods & common problems.' },
                             { num: '05', name: 'Methods (Functions)', desc: 'Method declaration, parameters, return types, overloading & recursion.' },
                             { num: '06', name: 'OOP (Class, Object, Constructor)', desc: 'Classes, objects, constructors, this keyword & instance vs static.' },
                             { num: '07', name: 'Packages', desc: 'Built-in & user-defined packages, import statements & access.' },
                             { num: '08', name: 'Access Modifiers', desc: 'public, private, protected, default & their scope rules.' },
                             { num: '09', name: 'String Handling', desc: 'String, StringBuilder, StringBuffer, methods & immutability.' },
                             { num: '10', name: 'Wrapper Classes', desc: 'Integer, Double, Character — autoboxing, unboxing & utility methods.' },
                             { num: '11', name: 'Exception Handling', desc: 'try-catch-finally, throws, custom exceptions & exception hierarchy.' },
                             { num: '12', name: 'Collections Framework', desc: 'List, Set, Map, Queue — ArrayList, HashMap, LinkedList & more.' },
                             { num: '13', name: 'Generics', desc: 'Generic classes, methods, wildcards & type safety.' },
                             { num: '14', name: 'Multithreading', desc: 'Thread class, Runnable, synchronization, deadlock & thread lifecycle.' },
                             { num: '15', name: 'Lambda Expressions', desc: 'Functional interfaces, arrow syntax & use in collections.' },
                             { num: '16', name: 'Stream API', desc: 'filter, map, reduce, collect & stream operations on collections.' },
                             { num: '17', name: 'File Handling (I/O)', desc: 'FileReader, FileWriter, BufferedReader, Scanner & file operations.' },
                             { num: '18', name: 'NIO', desc: 'Non-blocking I/O, Path, Files, Channels & Buffers.' },
                             { num: '19', name: 'Date & Time API', desc: 'LocalDate, LocalTime, LocalDateTime, DateTimeFormatter & Period.' },
                             { num: '20', name: 'Java Memory Management', desc: 'Stack vs Heap, Garbage Collection, GC types & memory leaks.' },
                             { num: '21', name: 'Inner Classes', desc: 'Static nested, inner, local & anonymous classes with use cases.' },
                             { num: '22', name: 'Enums', desc: 'Enum declaration, methods, constructors & use in switch.' },
                             { num: '23', name: 'Annotations', desc: '@Override, @Deprecated, custom annotations & retention policies.' },
                             { num: '24', name: 'Java 8+ Features', desc: 'Optional, default methods, method references & new API features.' },
                           ].map((sub) => (
                             <div key={sub.num} className="subtopic-card">
                               <span className="subtopic-num">{sub.num}</span>
                               <div>
                                 <h4>{sub.name}</h4>
                                 <p>{sub.desc}</p>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}

                      {!loading && notes.length === 0 && selectedTopic === "Advanced Java" && (
                        <div className="subtopics-grid">
                          {[
                            { num: '01', name: 'Synchronization', desc: 'synchronized keyword, locks, race conditions & thread-safe code.' },
                            { num: '02', name: 'Executor Framework', desc: 'ThreadPool, ExecutorService, Callable, Future & scheduled tasks.' },
                            { num: '03', name: 'Concurrency API', desc: 'CountDownLatch, Semaphore, CyclicBarrier & concurrent utilities.' },
                            { num: '04', name: 'Generics', desc: 'Generic classes, bounded types, wildcards & type erasure in depth.' },
                            { num: '05', name: 'Exception Handling', desc: 'Checked vs unchecked, custom exceptions, chaining & best practices.' },
                            { num: '06', name: 'Lambda Expressions', desc: 'Functional interfaces, arrow syntax, method references & closures.' },
                            { num: '07', name: 'Stream API', desc: 'filter, map, flatMap, reduce, collect & parallel streams.' },
                            { num: '08', name: 'Functional Interfaces', desc: 'Predicate, Function, Consumer, Supplier & BiFunction with examples.' },
                            { num: '09', name: 'JVM Architecture', desc: 'ClassLoader, runtime data areas, execution engine & JIT compiler.' },
                            { num: '10', name: 'Memory Management (Heap & Stack)', desc: 'Heap vs Stack, object lifecycle, memory allocation & OutOfMemoryError.' },
                            { num: '11', name: 'Garbage Collection (GC)', desc: 'GC algorithms, G1, ZGC, finalization & tuning GC performance.' },
                            { num: '12', name: 'Reflection API', desc: 'Class introspection, dynamic method invocation & annotation processing.' },
                            { num: '13', name: 'Annotations', desc: 'Built-in, custom annotations, retention policies & annotation processors.' },
                            { num: '14', name: 'Serialization', desc: 'Serializable, ObjectInputStream/OutputStream, transient & versioning.' },
                            { num: '15', name: 'Java I/O & NIO', desc: 'Streams, Readers/Writers, Path, Files, Channels & non-blocking I/O.' },
                            { num: '16', name: 'JDBC', desc: 'Connection, Statement, PreparedStatement, ResultSet & transactions.' },
                            { num: '17', name: 'Comparable vs Comparator', desc: 'Natural ordering, custom sorting, Comparator chaining & use cases.' },
                            { num: '18', name: 'HashMap Internal Working', desc: 'Hashing, buckets, collision, load factor & Java 8 treeification.' },
                            { num: '19', name: 'ConcurrentHashMap', desc: 'Segment locking, thread-safe operations & vs synchronized HashMap.' },
                            { num: '20', name: 'Design Patterns', desc: 'Singleton, Factory, Builder, Strategy, Observer & when to use them.' },
                            { num: '21', name: 'SOLID Principles', desc: 'SRP, OCP, LSP, ISP, DIP with real Java code examples.' },
                            { num: '22', name: 'Immutable Class', desc: 'final fields, defensive copying, String immutability & benefits.' },
                            { num: '23', name: 'Java 8 Features', desc: 'Optional, default methods, Date/Time API & Stream improvements.' },
                          ].map((sub) => (
                            <div key={sub.num} className="subtopic-card">
                              <span className="subtopic-num">{sub.num}</span>
                              <div>
                                <h4>{sub.name}</h4>
                                <p>{sub.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                       {/* Notes List */}
                       {!loading && notes
                         .filter(note => note.title?.toLowerCase().includes(searchQuery.toLowerCase()))
                         .map((note) => (
                           <div key={note.id || note._id} className="note-card">
                             <div className="note-header">
                               <h3>{note.title}</h3>
                               <div className="note-actions">

                                 {/* Download - sabke liye */}
                                 <button
                                   className="download-btn"
                                   onClick={() => handleDownloadPDF(note.title, `note-${note.id || note._id}`)}
                                 >
                                   ⬇️ Download
                                 </button>

                                 {/* Edit + Delete - Sirf Admin */}
                                 {(currentUser?.role === "ADMIN" || currentUser?.email === "pandeymurari571@gmail.com") && (
                                   <>
                                     <button className="edit-btn" onClick={() => handleOpenEditModal(note)}>
                                       ✏️ Edit
                                     </button>
                                     <button className="delete-btn" onClick={() => handleDeleteNote(note.id || note._id)}>
                                       🗑️ Delete
                                     </button>
                                   </>
                                 )}

                               </div>
                             </div>
                             <div id={`note-${note.id || note._id}`} className="note-content">
                               <ReactMarkdown
                                 children={note.content}
                                 components={{
                                   code({ node, inline, className, children, ...props }) {
                                     const match = /language-(\w+)/.exec(className || '');
                                     return !inline && match ? (
                                       <SyntaxHighlighter
                                         style={vscDarkPlus}
                                         language={match[1]}
                                         PreTag="div"
                                         {...props}
                                       >
                                         {String(children).replace(/\n$/, '')}
                                       </SyntaxHighlighter>
                                     ) : (
                                       <code className={className} {...props}>{children}</code>
                                     );
                                   }
                                 }}
                               />
                             </div>
                           </div>
                         ))}
                     </>
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