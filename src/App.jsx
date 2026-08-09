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
    const [showContact, setShowContact] = useState(false);
    const [showQuizTopics, setShowQuizTopics] = useState(false);
    const [selectedQuizTopic, setSelectedQuizTopic] = useState(null);

    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [quizResult, setQuizResult] = useState(null);



    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const filteredMenuTopics = topicsList.filter(topic =>
      topic.toLowerCase().includes(menuSearch.toLowerCase())

    );

    const coreJavaQuestions = [
      {
        question: "Which keyword is used to create a class in Java?",
        options: ["class", "Class", "new", "object"],
        answer: "class",
      },
      {
        question: "Which method is the entry point of a Java program?",
        options: ["start()", "main()", "run()", "execute()"],
        answer: "main()",
      },
      {
        question: "Which of these is not a primitive data type?",
        options: ["int", "float", "String", "char"],
        answer: "String",
      },
      {
        question: "Which keyword is used to inherit a class?",
        options: ["implements", "extends", "inherits", "super"],
        answer: "extends",
      },
      {
        question: "Which keyword is used to implement an interface?",
        options: ["extends", "implements", "interface", "inherit"],
        answer: "implements",
      },
      {
        question: "Which concept allows the same method name with different parameters?",
        options: ["Inheritance", "Overriding", "Overloading", "Encapsulation"],
        answer: "Overloading",
      },
      {
        question: "Which keyword is used to prevent inheritance?",
        options: ["static", "final", "private", "const"],
        answer: "final",
      },
      {
        question: "Which collection does not allow duplicate elements?",
        options: ["List", "Set", "Map", "ArrayList"],
        answer: "Set",
      },
      {
        question: "Which collection stores key-value pairs?",
        options: ["List", "Set", "Map", "Queue"],
        answer: "Map",
      },
      {
        question: "Which class is commonly used to create a mutable string?",
        options: ["String", "StringBuilder", "Character", "StringBufferOnly"],
        answer: "StringBuilder",
      },
      {
        question: "Which keyword refers to the current object?",
        options: ["super", "this", "current", "self"],
        answer: "this",
      },
      {
        question: "Which keyword is used to call the parent class constructor?",
        options: ["this", "parent", "super", "base"],
        answer: "super",
      },
      {
        question: "Which exception occurs when dividing an integer by zero?",
        options: [
          "NullPointerException",
          "ArithmeticException",
          "IOException",
          "ClassNotFoundException",
        ],
        answer: "ArithmeticException",
      },
      {
        question: "Which block is used to handle exceptions?",
        options: ["if-else", "try-catch", "switch", "for"],
        answer: "try-catch",
      },
      {
        question: "Which keyword is used to create an object?",
        options: ["object", "create", "new", "instance"],
        answer: "new",
      },
      {
        question: "Which access modifier provides the widest access?",
        options: ["private", "protected", "public", "default"],
        answer: "public",
      },
      {
        question: "Which keyword is used to define a constant?",
        options: ["constant", "const", "final", "static"],
        answer: "final",
      },
      {
        question: "What is the default value of an int instance variable?",
        options: ["null", "0", "1", "undefined"],
        answer: "0",
      },
      {
        question: "Which interface is the root of the Java collection hierarchy?",
        options: ["Collection", "List", "Set", "Map"],
        answer: "Collection",
      },
      {
        question: "Which feature allows one class to have multiple forms?",
        options: ["Encapsulation", "Polymorphism", "Abstraction", "Inheritance"],
        answer: "Polymorphism",
      },
    ];


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

// Live Date & Time
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentDateTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

const currentDayDate = currentDateTime.toLocaleDateString("en-IN", {
  weekday: "short",
  day: "2-digit",
  month: "short"
});

const currentTime = currentDateTime.toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

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
  if (currentUser && selectedTopic) {
    if (selectedSubtopic) {
      setLoading(true);
      axios.get(`https://javanoteshubb-backend.onrender.com/notes/category/${selectedSubtopic}`)
        .then((response) => {
          setNotes(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
          setNotes([]);
          setLoading(false);
        });
    } else {
      fetchNotes();
    }
  }
}, [selectedTopic, selectedSubtopic, currentUser]);


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
  setNewCategory(selectedSubtopic || selectedTopic);
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
      category: selectedSubtopic || newCategory,
      content: newContent
    };

    if (editMode) {
      axios.put(`https://javanoteshubb-backend.onrender.com/notes/${currentNoteId}`, noteData)
        .then(() => {
          alert("Note updated successfully! ✨");
          setShowModal(false);
          // Subtopic ke notes refresh karo
          if (selectedSubtopic) {
            setLoading(true);
            axios.get(`https://javanoteshubb-backend.onrender.com/notes/category/${selectedSubtopic}`)
              .then((res) => { setNotes(res.data); setLoading(false); })
              .catch(() => { setNotes([]); setLoading(false); });
          } else {
            fetchNotes();
          }
        })
        .catch(() => alert("Error updating note"));
    } else {
      axios.post("https://javanoteshubb-backend.onrender.com/notes", noteData)
        .then(() => {
          alert("Note added successfully! 🎉");
          setShowModal(false);
          // Subtopic ke notes refresh karo
          if (selectedSubtopic) {
            setLoading(true);
            axios.get(`https://javanoteshubb-backend.onrender.com/notes/category/${selectedSubtopic}`)
              .then((res) => { setNotes(res.data); setLoading(false); })
              .catch(() => { setNotes([]); setLoading(false); });
          } else {
            fetchNotes();
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

// ================= FULL SCREEN CORE JAVA QUIZ =================
if (currentUser && selectedQuizTopic === "Core Java") {
  const question = coreJavaQuestions[currentQuestion];

  return (
    <div className="fullscreen-quiz">

      <div className="quiz-container">

        <button
          className="quiz-back-btn"
          onClick={() => {
            setSelectedQuizTopic(null);
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setShowQuizTopics(true);
          }}
        >
          ← Back to Quiz Topics
        </button>

        <div className="quiz-header">
          <span className="quiz-badge">☕ CORE JAVA</span>

          <h1>Core Java Quiz</h1>

          <p>
            Question {currentQuestion + 1} of {coreJavaQuestions.length}
          </p>
        </div>

        <div className="quiz-question-card">

          <h2>
            {question.question}
          </h2>

          <div className="quiz-options">

            {question.options.map((option, index) => (
              <button
                key={option}
                className={`quiz-option ${
                  selectedAnswer === option ? "selected" : ""
                }`}
                onClick={() => setSelectedAnswer(option)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span>{option}</span>
              </button>
            ))}

          </div>

          <button
            className="next-question-btn"
            disabled={!selectedAnswer}
            onClick={() => {
              const currentQuestionData = coreJavaQuestions[currentQuestion];

              const isCorrect =
                selectedAnswer === currentQuestionData.answer;

              const newCorrectAnswers = isCorrect
                ? correctAnswers + 1
                : correctAnswers;

              // Questions 1-19
              if (currentQuestion < coreJavaQuestions.length - 1) {
                setCorrectAnswers(newCorrectAnswers);
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
              }

              // Question 20 - Submit
              else {
                const totalQuestions = coreJavaQuestions.length;
                const correct = newCorrectAnswers;
                const wrong = totalQuestions - correct;
                const percentage = Math.round(
                  (correct / totalQuestions) * 100
                );

                setQuizResult({
                  total: totalQuestions,
                  correct: correct,
                  wrong: wrong,
                  percentage: percentage,
                });

                // Quiz ko hide karo
                setSelectedQuizTopic(null);
                setSelectedAnswer(null);
              }
            }}
          >
            {currentQuestion === coreJavaQuestions.length - 1
              ? "Submit Quiz ✅"
              : "Next Question →"}
          </button>

        </div>

      </div>

    </div>
  );
}

  // 🔒 IF NOT LOGGED IN -> SHOW LOGIN / SIGNUP SCREEN
  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img
              src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
              alt="Java Logo"
              width="28"
              height="28"
              style={{ display: 'block' }}
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
            width="28"
            height="28"
            style={{ display: 'block' }}
          />

          <h2>Java Developer</h2>
        </div>
          {/* Current Date & Time */}
                    <div className="current-datetime">
                      <div className="current-date">
                        {currentDateTime.toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short"
                        })}
                      </div>
                 <div className="current-time">
                                         {currentDateTime.toLocaleTimeString("en-IN", {
                                           hour: "2-digit",
                                           minute: "2-digit",
                                           second: "2-digit",
                                           hour12: false
                                         })}
                                       </div>
                                     </div>






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
                             setShowTopics(false);
                             setShowMenu(false);
                             window.scrollTo({ top: 0, behavior: "smooth" });
                           }}
                         >
                           🏠 Home
                         </button>

                         <hr />

                         <button
                           className="menu-item"
                           onClick={() => {
                             setShowContact(true);
                             setShowMenu(false);
                           }}
                         >
                           📞 Contact Us
                         </button>

                         <hr />

                        <button
                          className="menu-item"
                          onClick={() => {
                            setShowQuizTopics(true);
                            setShowMenu(false);
                          }}
                        >
                          🔔 Quiz
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
                       </div>

                        )}

                  {showQuizTopics && (
                    <>

                      {!selectedQuizTopic && !quizResult && (
                        <>
                          <button
                            className="back-home-btn"
                            onClick={() => setShowQuizTopics(false)}
                            style={{ marginBottom: "1rem" }}
                          >
                            ← Back
                          </button>

                          <div className="topics-grid">
                            {[
                              {
                                icon: "{ }",
                                name: "Core Java",
                                desc: "OOPs, collections, streams, exceptions & the fundamentals every backend dev needs."
                              },
                              {
                                icon: "☕",
                                name: "Advanced Java",
                                desc: "Multithreading, concurrency, JVM internals & memory management."
                              },
                              {
                                icon: "🔌",
                                name: "JDBC",
                                desc: "Database connectivity, PreparedStatement, ResultSet & transaction management."
                              },

                              // ... baaki aapke topics same rahenge

                            ].map((topic) => (
                              <div
                                key={topic.name}
                                className="topic-card"
                                onClick={() => {
                                  if (topic.name === "Core Java") {
                                    setSelectedQuizTopic("Core Java");
                                    setCurrentQuestion(0);
                                    setSelectedAnswer(null);
                                    setCorrectAnswers(0);
                                    setQuizResult(null);
                                  }
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

                      {/* ================= CORE JAVA QUIZ ================= */}

                      {selectedQuizTopic === "Core Java" && (
                        <div className="full-screen-quiz">

                          <div className="quiz-header">

                            <button
                              className="back-home-btn"
                              onClick={() => {
                                setSelectedQuizTopic(null);
                                setCurrentQuestion(0);
                                setSelectedAnswer(null);
                                setCorrectAnswers(0);
                                setQuizResult(null);
                              }}
                            >
                              ← Back to Quiz Topics
                            </button>

                            <h1>☕ Core Java Quiz</h1>

                            <p>
                              Question {currentQuestion + 1} of{" "}
                              {coreJavaQuestions.length}
                            </p>

                          </div>

                          <div className="quiz-question-card">

                            <h2>
                              {coreJavaQuestions[currentQuestion].question}
                            </h2>

                            <div className="quiz-options">

                              {coreJavaQuestions[currentQuestion].options.map(
                                (option, index) => (
                                  <button
                                    key={option}
                                    className={`quiz-option ${
                                      selectedAnswer === option
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() => setSelectedAnswer(option)}
                                  >
                                    {String.fromCharCode(65 + index)}. {option}
                                  </button>
                                )
                              )}

                            </div>

                            {/* ================= NEXT / SUBMIT BUTTON ================= */}

                            <button
                              className="next-question-btn"
                              disabled={!selectedAnswer}
                              onClick={() => {

                                const currentQuestionData =
                                  coreJavaQuestions[currentQuestion];

                                const isCorrect =
                                  selectedAnswer === currentQuestionData.answer;

                                const newCorrectAnswers = isCorrect
                                  ? correctAnswers + 1
                                  : correctAnswers;

                                // ================= QUESTIONS 1 - 19 =================

                                if (
                                  currentQuestion <
                                  coreJavaQuestions.length - 1
                                ) {

                                  setCorrectAnswers(newCorrectAnswers);

                                  setCurrentQuestion(
                                    currentQuestion + 1
                                  );

                                  setSelectedAnswer(null);

                                }

                                // ================= QUESTION 20 =================

                                else {

                                  const totalQuestions =
                                    coreJavaQuestions.length;

                                  const correct =
                                    newCorrectAnswers;

                                  const wrong =
                                    totalQuestions - correct;

                                  const percentage =
                                    Math.round(
                                      (correct / totalQuestions) * 100
                                    );

                                  setCorrectAnswers(correct);

                                  setQuizResult({
                                    total: totalQuestions,
                                    correct: correct,
                                    wrong: wrong,
                                    percentage: percentage,
                                  });

                                  // Quiz hide karo
                                  setSelectedQuizTopic(null);

                                  setSelectedAnswer(null);
                                  setShowQuizTopics(false);
                                }

                              }}
                            >
                              {currentQuestion ===
                              coreJavaQuestions.length - 1
                                ? "Submit Quiz ✅"
                                : "Next Question →"}
                            </button>

                          </div>

                        </div>
                            )}

                            </>
                          )}


                      {/* ================= RESULT PAGE ================= */}

                      {quizResult && (
                        <div className="quiz-result-fullscreen">

                          <div className="quiz-result-container">

                            <div className="result-trophy">
                              🏆
                            </div>

                            <p className="result-completed">
                              QUIZ COMPLETED
                            </p>

                            <h1>Core Java Quiz</h1>

                            <p className="result-subtitle">
                              Great job! Here is your final performance.
                            </p>

                            {/* SCORE */}
                            <div className="result-circle">
                              <div className="result-percentage">
                                {quizResult.percentage}%
                              </div>

                              <div className="result-score-text">
                                Score
                              </div>
                            </div>

                            <div className="result-main-score">
                              {quizResult.correct}
                              <span> / {quizResult.total}</span>
                            </div>

                            {/* STATS */}
                            <div className="result-stats-grid">

                              <div className="result-box correct-box">
                                <div className="result-box-icon">
                                  ✓
                                </div>

                                <div>
                                  <p>Correct Answers</p>
                                  <strong>{quizResult.correct}</strong>
                                </div>
                              </div>

                              <div className="result-box wrong-box">
                                <div className="result-box-icon">
                                  ✕
                                </div>

                                <div>
                                  <p>Wrong Answers</p>
                                  <strong>{quizResult.wrong}</strong>
                                </div>
                              </div>

                              <div className="result-box total-box">
                                <div className="result-box-icon">
                                  📋
                                </div>

                                <div>
                                  <p>Total Questions</p>
                                  <strong>{quizResult.total}</strong>
                                </div>
                              </div>

                            </div>

                            {/* MESSAGE */}
                            <div className="result-message-box">

                              {quizResult.percentage >= 80 ? (
                                <>
                                  <span>🔥</span>
                                  <div>
                                    <strong>Excellent Performance!</strong>
                                    <p>
                                      You have a strong understanding of Core Java.
                                    </p>
                                  </div>
                                </>
                              ) : quizResult.percentage >= 60 ? (
                                <>
                                  <span>👏</span>
                                  <div>
                                    <strong>Good Job!</strong>
                                    <p>
                                      You are doing well. Keep practicing to improve further.
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span>💪</span>
                                  <div>
                                    <strong>Keep Practicing!</strong>
                                    <p>
                                      Revise Core Java concepts and try the quiz again.
                                    </p>
                                  </div>
                                </>
                              )}

                            </div>

                            {/* BUTTONS */}
                            <div className="result-actions">

                              <button
                                className="result-primary-btn"
                                onClick={() => {
                                  setQuizResult(null);
                                  setSelectedQuizTopic("Core Java");
                                  setCurrentQuestion(0);
                                  setSelectedAnswer(null);
                                  setCorrectAnswers(0);
                                }}
                              >
                                🔄 Try Again
                              </button>

                              <button
                                className="result-secondary-btn"
                                onClick={() => {
                                  setQuizResult(null);
                                  setSelectedQuizTopic(null);
                                  setCurrentQuestion(0);
                                  setSelectedAnswer(null);
                                  setCorrectAnswers(0);
                                  setShowQuizTopics(true);
                                }}
                              >
                                ← Quiz Topics
                              </button>

                            </div>

                          </div>

                        </div>
                      )}




                    {showContact && (
                      <div className="modal-overlay" onClick={() => setShowContact(false)}>
                        <div className="contact-page" onClick={(e) => e.stopPropagation()}>

                          <button className="back-home-btn" onClick={() => setShowContact(false)}
                            style={{marginBottom: '1rem'}}>
                            ← Back
                          </button>

                          <h2 className="contact-title">📬 Contact Us</h2>
                          <p className="contact-subtitle">Feel free to reach out — always here to help!</p>

                            <div className="contact-cards">

                              <a href="mailto:pandeymurari571@gmail.com" className="contact-card">
                                <div className="contact-card-icon" style={{background: 'rgba(234,67,53,0.15)'}}>
                                  📧
                                </div>
                                <div>
                                  <p className="contact-card-label">Email</p>
                                  <p className="contact-card-value">pandeymurari571@gmail.com</p>
                                </div>
                              </a>

                              <a href="https://linkedin.com/in/murari-sigma7" target="_blank"
                                rel="noreferrer" className="contact-card">
                                <div className="contact-card-icon" style={{background: 'rgba(10,102,194,0.15)'}}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                  </svg>
                                </div>
                                <div>
                                  <p className="contact-card-label">LinkedIn</p>
                                  <p className="contact-card-value">murari-sigma7</p>
                                </div>
                              </a>

                              <a href="https://github.com/Murari-sigma" target="_blank"
                                rel="noreferrer" className="contact-card">
                                <div className="contact-card-icon" style={{background: 'rgba(255,255,255,0.08)'}}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                </div>
                                <div>
                                  <p className="contact-card-label">GitHub</p>
                                  <p className="contact-card-value">Murari-sigma</p>
                                </div>
                              </a>

                              <a href="https://instagram.com/jupitar_xyz" target="_blank"
                                rel="noreferrer" className="contact-card">
                                <div className="contact-card-icon" style={{background: 'rgba(228,64,95,0.15)'}}>
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#instaGrad)">
                                    <defs>
                                      <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#f09433"/>
                                        <stop offset="25%" stopColor="#e6683c"/>
                                        <stop offset="50%" stopColor="#dc2743"/>
                                        <stop offset="75%" stopColor="#cc2366"/>
                                        <stop offset="100%" stopColor="#bc1888"/>
                                      </linearGradient>
                                    </defs>
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                                  </svg>
                                </div>
                                <div>
                                  <p className="contact-card-label">Instagram</p>
                                  <p className="contact-card-value">@jupitar_xyz</p>
                                </div>
                              </a>

                              <a href="tel:+91XXXXXXXXXX" className="contact-card">
                                <div className="contact-card-icon" style={{background: 'rgba(56,189,248,0.15)'}}>
                                  📞
                                </div>
                                <div>
                                  <p className="contact-card-label">Phone</p>
                                  <p className="contact-card-value">+91 8235070324</p>
                                </div>
                              </a>

                            </div>
                        </div>
                      </div>
                    )}

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
                        <>
                          <div className="subtopic-view-header">
                            <button className="back-home-btn" onClick={() => {
                              setSelectedSubtopic(null);
                              setNotes([]);
                              setSearchQuery("");
                            }}>
                              ← Back to Topics
                            </button>
                            <h3 className="topic-view-title">📘 {selectedSubtopic}</h3>
                            {(currentUser?.role === "ADMIN" ||
                              currentUser?.email === "pandeymurari571@gmail.com") && (
                              <button className="add-btn" onClick={handleOpenAddModal}>
                                + Add Note
                              </button>
                            )}
                          </div>

                          <hr style={{ margin: '15px 0', borderColor: '#334155' }} />

                          {loading && <p style={{color:'#94a3b8'}}>Loading notes...</p>}

                          {!loading && notes.length === 0 && (
                            <div className="empty-state">
                              <p
                                style={{
                                  color: "#64748b",
                                  textAlign: "center",
                                  marginTop: "2rem"
                                }}
                              >
                                📭 No notes yet for{" "}
                                <strong style={{ color: "#38bdf8" }}>
                                  {selectedSubtopic}
                                </strong>

                                {(currentUser?.role === "ADMIN" ||
                                  currentUser?.email === "pandeymurari571@gmail.com") &&
                                  " — Click + Add Note to add content!"}
                              </p>
                            </div>
                          )}




                   {!loading &&
                     notes
                       .filter(note =>
                         note.title?.toLowerCase().includes(searchQuery.toLowerCase())
                       )
                       .map((note) => (
                         <div
                           key={note.id || note._id}
                           className="note-card"
                         >
                           <div className="note-header">
                             <h3>{note.title}</h3>

                             <div className="note-actions">

                               {/* Download */}
                               <button
                                 className="download-btn"
                                 onClick={() =>
                                   handleDownloadPDF(
                                     note.title,
                                     `note-${note.id || note._id}`
                                   )
                                 }
                               >
                                 ⬇️ Download
                               </button>

                               {/* Edit + Delete */}
                               {(currentUser?.role === "ADMIN" ||
                                 currentUser?.email === "pandeymurari571@gmail.com") && (
                                 <>
                                   <button
                                     className="edit-btn"
                                     onClick={() => handleOpenEditModal(note)}
                                   >
                                     ✏️ Edit
                                   </button>

                                   <button
                                     className="delete-btn"
                                     onClick={() =>
                                       handleDeleteNote(note.id || note._id)
                                     }
                                   >
                                     🗑️ Delete
                                   </button>
                                 </>
                               )}

                             </div>
                           </div>

                           <div
                             id={`note-${note.id || note._id}`}
                             className="note-content"
                           >
                             <ReactMarkdown
                               children={note.content}
                               components={{
                                 code({
                                   node,
                                   inline,
                                   className,
                                   children,
                                   ...props
                                 }) {
                                   const match =
                                     /language-(\w+)/.exec(className || "");

                                   return !inline && match ? (
                                     <SyntaxHighlighter
                                       style={vscDarkPlus}
                                       language={match[1]}
                                       PreTag="div"
                                       {...props}
                                     >
                                       {String(children).replace(/\n$/, "")}
                                     </SyntaxHighlighter>
                                   ) : (
                                     <code
                                       className={className}
                                       {...props}
                                     >
                                       {children}
                                     </code>
                                   );
                                 }
                               }}
                             />
                           </div>
                         </div>
                       ))}
                       </>
                        )}

                       {/* Core Java subtopics - jab notes nahi hain */}
                       {!loading && notes.length === 0 && selectedTopic === "Core Java" && !selectedSubtopic && (
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
                           ]
                       .filter(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
                       .map((sub) => (
                             <div key={sub.num} className="subtopic-card"
                               onClick={() => setSelectedSubtopic(sub.name)}>
                               <span className="subtopic-num">{sub.num}</span>
                               <div>
                                 <h4>{sub.name}</h4>
                                 <p>{sub.desc}</p>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}

                      {!loading && notes.length === 0 && selectedTopic === "Advanced Java" && !selectedSubtopic && (
                        <div className="subtopics-grid">
                          {[
                            { num: '01', name: 'MVC Architecture', desc: 'Model-View-Controller pattern — separation of concerns, request flow & how Spring MVC implements it.' },
                            { num: '02', name: '1-Tier, 2-Tier & 3-Tier Architecture', desc: 'Application architecture types — single layer, client-server & web-based three-tier model with real-world examples.' },
                            { num: '03', name: 'Synchronization', desc: 'synchronized keyword, locks, race conditions & thread-safe code.' },
                            { num: '04', name: 'Executor Framework', desc: 'ThreadPool, ExecutorService, Callable, Future & scheduled tasks.' },
                            { num: '05', name: 'Concurrency API', desc: 'CountDownLatch, Semaphore, CyclicBarrier & concurrent utilities.' },
                            { num: '06', name: 'Generics', desc: 'Generic classes, bounded types, wildcards & type erasure in depth.' },
                            { num: '07', name: 'Exception Handling', desc: 'Checked vs unchecked, custom exceptions, chaining & best practices.' },
                            { num: '08', name: 'Lambda Expressions', desc: 'Functional interfaces, arrow syntax, method references & closures.' },
                            { num: '09', name: 'Stream API', desc: 'filter, map, flatMap, reduce, collect & parallel streams.' },
                            { num: '10', name: 'Functional Interfaces', desc: 'Predicate, Function, Consumer, Supplier & BiFunction with examples.' },
                            { num: '11', name: 'JVM Architecture', desc: 'ClassLoader, runtime data areas, execution engine & JIT compiler.' },
                            { num: '12', name: 'Memory Management (Heap & Stack)', desc: 'Heap vs Stack, object lifecycle, memory allocation & OutOfMemoryError.' },
                            { num: '13', name: 'Garbage Collection (GC)', desc: 'GC algorithms, G1, ZGC, finalization & tuning GC performance.' },
                            { num: '14', name: 'Reflection API', desc: 'Class introspection, dynamic method invocation & annotation processing.' },
                            { num: '15', name: 'Annotations', desc: 'Built-in, custom annotations, retention policies & annotation processors.' },
                            { num: '16', name: 'Serialization', desc: 'Serializable, ObjectInputStream/OutputStream, transient & versioning.' },
                            { num: '17', name: 'Java I/O & NIO', desc: 'Streams, Readers/Writers, Path, Files, Channels & non-blocking I/O.' },
                            { num: '18', name: 'JDBC', desc: 'Connection, Statement, PreparedStatement, ResultSet & transactions.' },
                            { num: '19', name: 'Comparable vs Comparator', desc: 'Natural ordering, custom sorting, Comparator chaining & use cases.' },
                            { num: '20', name: 'HashMap Internal Working', desc: 'Hashing, buckets, collision, load factor & Java 8 treeification.' },
                            { num: '21', name: 'ConcurrentHashMap', desc: 'Segment locking, thread-safe operations & vs synchronized HashMap.' },
                            { num: '22', name: 'Design Patterns', desc: 'Singleton, Factory, Builder, Strategy, Observer & when to use them.' },
                            { num: '23', name: 'SOLID Principles', desc: 'SRP, OCP, LSP, ISP, DIP with real Java code examples.' },
                            { num: '24', name: 'Immutable Class', desc: 'final fields, defensive copying, String immutability & benefits.' },
                            { num: '25', name: 'Java 8 Features', desc: 'Optional, default methods, Date/Time API & Stream improvements.' },
                          ]
                      .filter(sub => sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((sub) => (
                            <div key={sub.num} className="subtopic-card"
                            onClick={() => setSelectedSubtopic(sub.name)}>
                              <span className="subtopic-num">{sub.num}</span>
                              <div>
                                <h4>{sub.name}</h4>
                                <p>{sub.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

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


                       </nav>

                       </div>
                   );
               }

                 export default App;