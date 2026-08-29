import React, { useState, useEffect } from 'react';
import mentorPic from './murari.jpg';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ATSChecker from "./ATSChecker";
import './App.css';

const topicsList = [
  "Core Java", "Advanced Java", "JDBC", "Servlet", "JSP",
  "Maven", "Hibernate", "JPA", "Spring", "Spring Boot",
  "Spring Security", "REST API", "Microservices", "MySQL",
  "Git & GitHub", "Docker", "AWS", "Interview Questions", "Projects"
];

// Dynamic PDF Streamer (Har subtopic ke liye alag direct PDF load karega)
const getSubtopicPdfUrl = (subtopicName) => {
  if (!subtopicName) return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  // Topic name ke according clean PDF document URL
  const cleanTopic = encodeURIComponent(subtopicName.trim());

  // Direct PDF Stream API Link (Bina about:blank ke 100% Direct Open hoga)
  return `https://raw.githubusercontent.com/yadav-sourabh/Java-Notes/main/${cleanTopic}.pdf`;
};

// Open-Source Standard Java PDFs Map (Backup Engine)
// Har ek subtopic ke liye Dedicated aur High-Quality Java PDF Links
const javaSubtopicPdfs = {
  "Introduction to Java": "https://www.tutorialspoint.com/java/java_tutorial.pdf",
  "Java Basics": "https://ocw.mit.edu/courses/6-092-introduction-to-programming-in-java-january-iap-2010/readings/MIT6_092IAP10_ses01.pdf",
  "Control Statements": "https://ocw.mit.edu/courses/6-092-introduction-to-programming-in-java-january-iap-2010/readings/MIT6_092IAP10_ses02.pdf",
  "Arrays": "https://ocw.mit.edu/courses/6-092-introduction-to-programming-in-java-january-iap-2010/readings/MIT6_092IAP10_ses04.pdf",
  "Methods (Functions)": "https://ocw.mit.edu/courses/6-092-introduction-to-programming-in-java-january-iap-2010/readings/MIT6_092IAP10_ses03.pdf"
};

    function App() {

    const [showMenu, setShowMenu] = useState(false);
    const [menuSearch, setMenuSearch] = useState("");
    const [showTopics, setShowTopics] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showQuizTopics, setShowQuizTopics] = useState(false);
    const [selectedQuizTopic, setSelectedQuizTopic] = useState(null);
    const [showATS, setShowATS] = useState(false);
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

    // 2. ADVANCED JAVA QUESTIONS (20)
    const advancedJavaQuestions = [
      { question: "Which state is NOT a valid lifecycle state of a Thread?", options: ["New", "Running", "Suspended", "Terminated"], answer: "Suspended" },
      { question: "Which method is used to start the execution of a thread?", options: ["run()", "start()", "execute()", "init()"], answer: "start()" },
      { question: "Which keyword is used to achieve thread synchronization?", options: ["lock", "volatile", "synchronized", "static"], answer: "synchronized" },
      { question: "Which interface is functional and represents an operation that accepts a single input argument?", options: ["Supplier", "Consumer", "Predicate", "Function"], answer: "Function" },
      { question: "Which JVM component converts bytecode into machine code at runtime?", options: ["ClassLoader", "JIT Compiler", "Garbage Collector", "Interpreter"], answer: "JIT Compiler" },
      { question: "Where are local variables stored in Java memory?", options: ["Heap Memory", "Stack Memory", "Method Area", "Metaspace"], answer: "Stack Memory" },
      { question: "Which class loader is the parent of all built-in class loaders?", options: ["Extension ClassLoader", "Bootstrap ClassLoader", "Application ClassLoader", "System ClassLoader"], answer: "Bootstrap ClassLoader" },
      { question: "Which Java 8 feature allows adding method implementations inside interfaces?", options: ["Abstract Methods", "Static Blocks", "Default Methods", "Lambda Expressions"], answer: "Default Methods" },
      { question: "Which stream operation is a terminal operation?", options: ["map()", "filter()", "collect()", "sorted()"], answer: "collect()" },
      { question: "Which class in java.util.concurrent is used to prevent thread safety issues in HashMaps?", options: ["Hashtable", "SynchronizedMap", "ConcurrentHashMap", "TreeMap"], answer: "ConcurrentHashMap" },
      { question: "Which functional interface returns a boolean value?", options: ["Function", "Consumer", "Supplier", "Predicate"], answer: "Predicate" },
      { question: "Which garbage collector is default in Java 17?", options: ["Serial GC", "Parallel GC", "G1 GC", "ZGC"], answer: "G1 GC" },
      { question: "Which keyword prevents a variable from being serialized?", options: ["volatile", "transient", "static", "final"], answer: "transient" },
      { question: "Which class is used for dynamically examining classes and methods at runtime?", options: ["ClassIntrospector", "Reflection API (java.lang.reflect)", "JVM Inspector", "RuntimeLoader"], answer: "Reflection API (java.lang.reflect)" },
      { question: "Which annotation specifies the retention strategy of an annotation?", options: ["@Target", "@Retention", "@Inherited", "@Documented"], answer: "@Retention" },
      { question: "Which interface allows Callable tasks to return results?", options: ["Runnable", "Callable", "Future", "Executor"], answer: "Callable" },
      { question: "What does NIO stand for in Java?", options: ["Network I/O", "New I/O (Non-blocking I/O)", "Next-gen I/O", "Native I/O"], answer: "New I/O (Non-blocking I/O)" },
      { question: "Which Design Pattern limits class instantiation to a single instance?", options: ["Factory", "Builder", "Singleton", "Prototype"], answer: "Singleton" },
      { question: "Which SOLID principle states that classes should be open for extension, closed for modification?", options: ["Single Responsibility", "Open-Closed Principle", "Liskov Substitution", "Dependency Inversion"], answer: "Open-Closed Principle" },
      { question: "Which class is container object used to contain non-null values to avoid NullPointerException?", options: ["Wrapper", "Optional", "Box", "Holder"], answer: "Optional" }
    ];

    // 3. JDBC QUESTIONS (20)
    const jdbcQuestions = [
      { question: "Which package contains JDBC classes and interfaces?", options: ["java.io", "java.sql", "java.net", "java.db"], answer: "java.sql" },
      { question: "Which interface is used to execute parameterized SQL queries?", options: ["Statement", "PreparedStatement", "CallableStatement", "ResultSet"], answer: "PreparedStatement" },
      { question: "Which method is used to execute SELECT queries in JDBC?", options: ["executeUpdate()", "execute()", "executeQuery()", "runQuery()"], answer: "executeQuery()" },
      { question: "Which method is used to execute INSERT, UPDATE, or DELETE statements?", options: ["executeQuery()", "executeUpdate()", "executeBatch()", "runUpdate()"], answer: "executeUpdate()" },
      { question: "What does `executeQuery()` return?", options: ["int", "boolean", "ResultSet", "Statement"], answer: "ResultSet" },
      { question: "Which interface is used to call stored procedures in JDBC?", options: ["PreparedStatement", "Statement", "CallableStatement", "StoredStatement"], answer: "CallableStatement" },
      { question: "How do you disable auto-commit mode in JDBC?", options: ["connection.setAutoCommit(false)", "connection.commit(false)", "connection.stopAutoCommit()", "connection.disableCommit()"], answer: "connection.setAutoCommit(false)" },
      { question: "Which method is used to save changes manually in JDBC?", options: ["connection.save()", "connection.commit()", "connection.flush()", "connection.persist()"], answer: "connection.commit()" },
      { question: "Which method rolls back transactions in case of failure?", options: ["connection.undo()", "connection.rollback()", "connection.revert()", "connection.cancel()"], answer: "connection.rollback()" },
      { question: "Which interface provides methods to get database metadata?", options: ["ResultSetMetaData", "DatabaseMetaData", "ConnectionMetaData", "DriverMetaData"], answer: "DatabaseMetaData" },
      { question: "Which interface provides information about table columns in a ResultSet?", options: ["DatabaseMetaData", "ResultSetMetaData", "QueryMetaData", "TableMetaData"], answer: "ResultSetMetaData" },
      { question: "Which type of JDBC driver is also known as Thin Driver?", options: ["Type-1", "Type-2", "Type-3", "Type-4"], answer: "Type-4" },
      { question: "Which method loads a JDBC driver class dynamically?", options: ["Class.forName()", "DriverManager.load()", "Driver.create()", "ClassLoader.loadDriver()"], answer: "Class.forName()" },
      { question: "Which method closes a database Connection?", options: ["connection.stop()", "connection.close()", "connection.exit()", "connection.disconnect()"], answer: "connection.close()" },
      { question: "What is the return type of `executeUpdate()`?", options: ["ResultSet", "boolean", "int (row count)", "void"], answer: "int (row count)" },
      { question: "Which method is used to move the cursor to the next row in ResultSet?", options: ["next()", "move()", "forward()", "getRow()"], answer: "next()" },
      { question: "Which interface manages a set of JDBC drivers?", options: ["ConnectionManager", "DriverManager", "DriverService", "DatabaseManager"], answer: "DriverManager" },
      { question: "Which statement type prevents SQL Injection attacks?", options: ["Statement", "PreparedStatement", "SimpleStatement", "DirectStatement"], answer: "PreparedStatement" },
      { question: "Which exception is thrown when a database access error occurs?", options: ["DatabaseException", "SQLException", "IOException", "DataAccessException"], answer: "SQLException" },
      { question: "What is the default auto-commit mode in JDBC?", options: ["true", "false", "null", "depends on database"], answer: "true" }
    ];

 // Topic ke according questions select karne ke liye:
 const getQuestionsForTopic = () => {
   if (selectedQuizTopic === "Core Java") return coreJavaQuestions;
   if (selectedQuizTopic === "Advanced Java") return advancedJavaQuestions;
   if (selectedQuizTopic === "JDBC") return jdbcQuestions;
   return [];
 };

 const currentQuestionsList = getQuestionsForTopic();


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


 // Selected Subtopic ki Exact PDF Open karne ka Handler
   const handlePdfDownload = (subtopicName) => {
     // Agar topic ka specific link hai toh wo open hoga, warna default Tutorialspoint wali PDF
     const targetPdf = javaSubtopicPdfs[subtopicName] || "https://www.tutorialspoint.com/java/java_tutorial.pdf";
     window.open(targetPdf, '_blank');
   };

   // App.jsx ke andar Subtopic Fetching Function Update Karein:
   const handleTopicClick = async (topicName) => {
     setSelectedTopic(topicName);

     // Check if data already exists in LocalStorage Cache
     const cachedData = localStorage.getItem(`subtopics_${topicName}`);
     if (cachedData) {
       setSubtopics(JSON.parse(cachedData));
       return; // Instant Load!
     }

     // Otherwise Fetch from Server
     setLoading(true);
     try {
       const res = await fetch(`/api/subtopics?topic=${topicName}`);
       const data = await res.json();

       // Save to Cache & State
       localStorage.setItem(`subtopics_${topicName}`, JSON.stringify(data));
       setSubtopics(data);
     } catch (err) {
       console.error(err);
     } finally {
       setLoading(false);
     }
   };

  useEffect(() => {
    // App open hote hi server ko wakeup ping bhej do
    fetch('/api/subtopics?topic=Core Java').catch(() => {});
  }, []);

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

  // 1. Topic Filtering Logic
  const filteredTopics = topicsList ? topicsList.filter(topic =>
    topic.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  ) : [];

  // 2. FULL SCREEN CORE JAVA QUIZ
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
            <h2>{question.question}</h2>

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
                const isCorrect = selectedAnswer === currentQuestionData.answer;
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
                  const percentage = Math.round((correct / totalQuestions) * 100);

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

  // 3. ATS CHECKER VIEW
  if (currentUser && showATS) {
    return (
      <ATSChecker onBack={() => setShowATS(false)} />
    );
  }

  // 4. IF NOT LOGGED IN -> SHOW LOGIN / SIGNUP SCREEN
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
                setShowATS(true);
                setShowMenu(false);
                setShowTopics(false);
                setSelectedTopic(null);
              }}
            >
              📄 ATS Resume Checker
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
      </nav>

      {/* Main Content Area */}
      {showQuizTopics && !selectedQuizTopic && !quizResult && (
        <div className="quiz-topics-container" style={{ padding: '2rem' }}>
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
                       }
                     ].map((topic) => (
                       <div
                         key={topic.name}
                         className="topic-card"
                         onClick={() => {
                           // ✅ FIX: 'if' condition hata kar dynamic 'topic.name' pass kar diya
                           setSelectedQuizTopic(topic.name);
                           setCurrentQuestion(0);
                           setSelectedAnswer(null);
                           setCorrectAnswers(0);
                           setQuizResult(null);
                         }}
                       >
                         <span className="topic-icon">{topic.icon}</span>
                         <h3>{topic.name}</h3>
                         <p>{topic.desc}</p>
                       </div>
                     ))}
                   </div>
        </div>
      )}

                      {/* DYNAMIC QUIZ PLAY SCREEN FOR ALL 3 TOPICS */}
                      {selectedQuizTopic && currentQuestionsList.length > 0 && !quizResult && (
                        <div className="full-screen-quiz" style={{ padding: '2rem' }}>
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

                            <h1>☕ {selectedQuizTopic} Quiz</h1>
                            <p>Question {currentQuestion + 1} of {currentQuestionsList.length}</p>
                          </div>

                          <div className="quiz-question-card">
                            <h2>{currentQuestionsList[currentQuestion].question}</h2>

                            <div className="quiz-options">
                              {currentQuestionsList[currentQuestion].options.map((option, index) => (
                                <button
                                  key={option}
                                  className={`quiz-option ${selectedAnswer === option ? "selected" : ""}`}
                                  onClick={() => setSelectedAnswer(option)}
                                >
                                  {String.fromCharCode(65 + index)}. {option}
                                </button>
                              ))}
                            </div>

                            <button
                              className="next-question-btn"
                              disabled={!selectedAnswer}
                              onClick={() => {
                                const currentQuestionData = currentQuestionsList[currentQuestion];
                                const isCorrect = selectedAnswer === currentQuestionData.answer;
                                const newCorrectAnswers = isCorrect
                                  ? correctAnswers + 1
                                  : correctAnswers;

                                // QUESTIONS 1 - 19
                                if (currentQuestion < currentQuestionsList.length - 1) {
                                  setCorrectAnswers(newCorrectAnswers);
                                  setCurrentQuestion(currentQuestion + 1);
                                  setSelectedAnswer(null);
                                }
                                // QUESTION 20 (SUBMIT)
                                else {
                                  const totalQuestions = currentQuestionsList.length;
                                  const correct = newCorrectAnswers;
                                  const wrong = totalQuestions - correct;
                                  const percentage = Math.round((correct / totalQuestions) * 100);

                                  setCorrectAnswers(correct);
                                  setQuizResult({
                                    topic: selectedQuizTopic,
                                    total: totalQuestions,
                                    correct: correct,
                                    wrong: wrong,
                                    percentage: percentage,
                                  });

                                  setSelectedQuizTopic(null);
                                  setSelectedAnswer(null);
                                  setShowQuizTopics(false);
                                }
                              }}
                            >
                              {currentQuestion === currentQuestionsList.length - 1
                                ? "Submit Quiz ✅"
                                : "Next Question →"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* ================= RESULT PAGE ================= */}
                      {quizResult && (
                        <div className="quiz-result-fullscreen">
                          <div className="quiz-result-container">
                            <div className="result-trophy">🏆</div>

                            <p className="result-completed">QUIZ COMPLETED</p>

                            <h1>Core Java Quiz</h1>

                            <p className="result-subtitle">
                              Great job! Here is your final performance.
                            </p>

                            {/* SCORE */}
                            <div className="result-circle">
                              <div className="result-percentage">{quizResult.percentage}%</div>
                              <div className="result-score-text">Score</div>
                            </div>

                            <div className="result-main-score">
                              {quizResult.correct}
                              <span> / {quizResult.total}</span>
                            </div>

                            {/* STATS */}
                            <div className="result-stats-grid">
                              <div className="result-box correct-box">
                                <div className="result-box-icon">✓</div>
                                <div>
                                  <p>Correct Answers</p>
                                  <strong>{quizResult.correct}</strong>
                                </div>
                              </div>

                              <div className="result-box wrong-box">
                                <div className="result-box-icon">✕</div>
                                <div>
                                  <p>Wrong Answers</p>
                                  <strong>{quizResult.wrong}</strong>
                                </div>
                              </div>

                              <div className="result-box total-box">
                                <div className="result-box-icon">📋</div>
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
                                    <p>You have a strong understanding of Core Java.</p>
                                  </div>
                                </>
                              ) : quizResult.percentage >= 60 ? (
                                <>
                                  <span>👏</span>
                                  <div>
                                    <strong>Good Job!</strong>
                                    <p>You are doing well. Keep practicing to improve further.</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span>💪</span>
                                  <div>
                                    <strong>Keep Practicing!</strong>
                                    <p>Revise Core Java concepts and try the quiz again.</p>
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

                  {showATS && (
                      <ATSChecker onBack={() => setShowATS(false)} />
                    )}

                   {/* HOME VIEW */}
                   {!selectedTopic && (
                     <>
                       {!showTopics && (
                         <>
                         {/* Hero Section */}
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

                        {/* Why Learn With Us Section */}
                        <div className="why-learn-header">
                          <h2 className="why-learn-title">Why learn with us?</h2>
                          <p className="why-learn-subtitle">
                            Everything you need to boost your technical career in one place.
                          </p>
                        </div>

                        <div className="why-learn-card">
                          {/* Feature 1: Data Structure */}
                          <div className="feature-item">
                            <div className="feature-icon-badge">🧠</div>
                            <h3 className="feature-title">Data Structure</h3>
                            <p className="feature-desc">
                              You'll gain the basic to advance knowledge you need to do great in technical interviews and become a coding expert.
                            </p>
                          </div>

                          {/* Feature 2: Interactive Topic Quizzes */}
                          <div className="feature-item">
                            <div className="feature-icon-badge">🎯</div>
                            <h3 className="feature-title">Interactive Topic Quizzes</h3>
                            <p className="feature-desc">
                              Test your knowledge with multiple quizzes across various Java topics to enhance problem-solving skills and track your interview readiness.
                            </p>
                          </div>

                          {/* Feature 3: ATS Resume Checker */}
                          <div className="feature-item">
                            <div className="feature-icon-badge">📄</div>
                            <h3 className="feature-title">ATS Resume Checker</h3>
                            <p className="feature-desc">
                              Free built-in ATS Resume Checker tool to analyze your resume against top industry standards and get instantly shortlisted.
                            </p>
                          </div>

                          {/* Feature 4: Download Handwritten Notes */}
                          <div className="feature-item">
                            <div className="feature-icon-badge">📚</div>
                            <h3 className="feature-title">Handwritten Notes Download</h3>
                            <p className="feature-desc">
                              Get direct access to comprehensive, high-quality PDF notes created by mentors to revise core Java concepts anytime.
                            </p>
                          </div>

                          {/* Feature 5: Learn from the Best */}
                          <div className="feature-item">
                            <div className="feature-icon-badge">💬</div>
                            <h3 className="feature-title">Learn from the Best</h3>
                            <p className="feature-desc">
                              Get insights and guidance from an experienced software engineer who has trained over 15,000+ developers across platforms.
                            </p>
                          </div>
                        </div>

                         {/* Mentor Section */}
                         <div className="mentor-card-wrapper">
                           <div className="mentor-vertical-container">
                             {/* 1. TOP PHOTO */}
                             <img
                               src={mentorPic}
                               alt="Murari Pandey"
                               className="mentor-avatar-glow"
                             />

                             {/* 2. MEET YOUR MENTOR (SINGLE LINE) */}
                             <h2 className="mentor-badge-single">✨ MEET YOUR MENTOR</h2>

                             {/* 3. SHINING NAME */}
                             <h1 className="mentor-name-shining">Murari Pandey</h1>

                             {/* 4. LIGHT CLEAR TEXT */}
                             <p className="mentor-text-light">
                               Hey! I am a software engineer by profession and a teacher by heart. I strongly believe
                               <strong style={{ color: "#fde047", fontWeight: "700" }}> "Anyone Can Code"</strong>! No matter what your background and past skill set are, you can learn to program if it is taught in a simplistic way.
                             </p>

                             <p className="mentor-text-light">
                               I love to see my community generating success results as I have trained more than
                               <span style={{ color: "#4ade80", fontWeight: "700" }}> 15,000+ Developer professionals</span> on various platforms like YouTube, LinkedIn, UpGrad, etc.
                             </p>

                             <p className="mentor-mission-light">
                               🎯 My mission is to help professionals like you make sure you are also getting into your dream organizations. Cracked interviews at top brands!
                             </p>
                           </div>
                         </div>
                       </>
                     )}


                 {/* Professional Footer Section */}
                 <footer style={{
                   background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(2, 6, 23, 0.95) 100%)',
                   backdropFilter: 'blur(16px)',
                   borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                   padding: '3.5rem 1.5rem 2rem 1.5rem',
                   marginTop: '5rem',
                   color: '#f8fafc'
                 }}>
                   <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>

                     {/* Brand Logo & Name */}
                     <div style={{
                       display: 'inline-flex',
                       alignItems: 'center',
                       gap: '10px',
                       background: 'rgba(255, 255, 255, 0.04)',
                       padding: '8px 18px',
                       borderRadius: '999px',
                       border: '1px solid rgba(255, 255, 255, 0.1)',
                       marginBottom: '1rem'
                     }}>
                       <img
                         src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
                         alt="Java Logo"
                         width="22"
                         height="22"
                       />
                       <span style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.5px', color: '#f8fafc' }}>
                         Java Developer
                       </span>
                     </div>

                     {/* Subtitle / Tagline */}
                     <p style={{
                       color: '#94a3b8',
                       fontSize: '0.95rem',
                       maxWidth: '520px',
                       margin: '0.5rem auto 2.5rem auto',
                       lineHeight: '1.6'
                     }}>
                       Become a Software Engineer in top product-based companies. Master Java, Data Structures, System Design, and crack your interviews.
                     </p>

                     {/* Navigation Links */}
                     <div style={{
                       display: 'flex',
                       justify: 'center',
                       alignItems: 'center',
                       gap: '2rem',
                       flexWrap: 'wrap',
                       marginBottom: '2.5rem',
                       fontSize: '0.9rem',
                       fontWeight: '500'
                     }}>
                       <a href="#privacy" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.target.style.color = '#38bdf8'}
                          onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                         Privacy Policy
                       </a>
                       <a href="#terms" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.target.style.color = '#38bdf8'}
                          onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                         Terms of Use
                       </a>
                       <button
                         onClick={() => setShowContact(true)}
                         style={{
                           background: 'none',
                           border: 'none',
                           color: '#cbd5e1',
                           fontSize: '0.9rem',
                           fontWeight: '500',
                           cursor: 'pointer',
                           padding: 0,
                           fontFamily: 'inherit',
                           transition: 'all 0.2s'
                         }}
                         onMouseOver={(e) => e.target.style.color = '#38bdf8'}
                         onMouseOut={(e) => e.target.style.color = '#cbd5e1'}
                       >
                         Contact Us
                       </button>
                       <a href="#refund" style={{ color: '#cbd5e1', textDecoration: 'none', transition: 'all 0.2s' }}
                          onMouseOver={(e) => e.target.style.color = '#38bdf8'}
                          onMouseOut={(e) => e.target.style.color = '#cbd5e1'}>
                         Refund Policy
                       </a>
                     </div>

                     {/* Social Icons with Glass Cards */}
                     <div style={{
                       display: 'flex',
                       justify: 'center',
                       alignItems: 'center',
                       gap: '1rem',
                       marginBottom: '2.5rem'
                     }}>
                       <a href="https://linkedin.com/in/murari-sigma7" target="_blank" rel="noreferrer" style={{
                         width: '42px', height: '42px', borderRadius: '12px',
                         background: 'rgba(10, 102, 194, 0.12)', border: '1px solid rgba(10, 102, 194, 0.3)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8',
                         transition: 'transform 0.2s'
                       }}
                       onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                       onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                         </svg>
                       </a>

                       <a href="https://github.com/Murari-sigma" target="_blank" rel="noreferrer" style={{
                         width: '42px', height: '42px', borderRadius: '12px',
                         background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc',
                         transition: 'transform 0.2s'
                       }}
                       onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                       onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                         </svg>
                       </a>

                       <a href="https://instagram.com/jupitar_xyz" target="_blank" rel="noreferrer" style={{
                         width: '42px', height: '42px', borderRadius: '12px',
                         background: 'rgba(225, 48, 108, 0.12)', border: '1px solid rgba(225, 48, 108, 0.3)',
                         display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e',
                         transition: 'transform 0.2s'
                       }}
                       onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                       onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                         </svg>
                       </a>
                     </div>

                     {/* Divider */}
                     <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', width: '100%', marginBottom: '1.5rem' }}></div>

                     {/* Copyright Notice */}
                     <p style={{ color: '#64748b', fontSize: '0.825rem', margin: 0 }}>
                       © {new Date().getFullYear()} Java Developer. Designed for learning & tech interview prep.
                     </p>
                   </div>
                 </footer>


                     {/* Topics Selection View */}
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
                          {/* Subtopic Header Bar */}
                          <div className="subtopic-view-header">
                            <button
                              className="back-home-btn"
                              onClick={() => {
                                setSelectedSubtopic(null);
                                setNotes([]);
                                setSearchQuery("");
                              }}
                            >
                              ← Back to Topics
                            </button>

                            <h3 className="topic-view-title">📘 {selectedSubtopic}</h3>

                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              {/* Admin ke liye Add Note Button */}
                              {(currentUser?.role === "ADMIN" ||
                                currentUser?.email === "pandeymurari571@gmail.com") && (
                                <button className="add-btn" onClick={handleOpenAddModal}>
                                  + Add Note
                                </button>
                              )}

                              {/* 📄 NOTES PDF BUTTON (Sirf Drive Link Open Karega) */}
                              <button
                                className="download-pdf-btn"
                                onClick={() => handlePdfDownload(selectedSubtopic)}
                              >
                                📄 Notes PDF
                              </button>
                            </div>
                          </div>

                          <hr style={{ margin: '15px 0', borderColor: '#334155' }} />

                          {loading && <p style={{ color: '#94a3b8' }}>Loading notes...</p>}

                          {/* Notes Display Area */}
                          <div>
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
                                        {/* Purana download button yahan bilkul nahi hai */}

                                        {/* Admin Edit/Delete Buttons */}
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

                                    <div className="note-content">
                                      <ReactMarkdown
                                        children={note.content}
                                        components={{
                                          code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || "");
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
                                              <code className={className} {...props}>
                                                {children}
                                              </code>
                                            );
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                ))}
                          </div>
                        </>
                      )}

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

                          {/* Full Notes Container for PDF Generation */}
                              <div id="full-notes-area">
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
                                            {/* PURANA DOWNLOAD BUTTON HATA DIYA GAYA HAI */}

                                            {/* Sirf Admin ke liye Edit aur Delete Buttons */}
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
                              </div>




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

                                       </div>
                                   );
                                 };

                                 export default App;