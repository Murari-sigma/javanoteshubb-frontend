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

   // 4. SERVLET QUESTIONS (20)
   const servletQuestions = [
     { question: "Which interface must all servlets implement directly or indirectly?", options: ["GenericServlet", "HttpServlet", "Servlet", "ServletConfig"], answer: "Servlet" },
     { question: "Which method is called only once in the entire lifecycle of a Servlet?", options: ["service()", "init()", "doGet()", "destroy()"], answer: "init()" },
     { question: "Which method is invoked by the servlet container to process client requests?", options: ["init()", "service()", "doGet()", "execute()"], answer: "service()" },
     { question: "Which package contains generic Servlet interfaces and classes?", options: ["javax.servlet.http", "javax.servlet", "java.servlet", "java.web"], answer: "javax.servlet" },
     { question: "Which HTTP method is invoked by default when accessing a URL via a browser address bar?", options: ["POST", "GET", "PUT", "HEAD"], answer: "GET" },
     { question: "Which interface is used to read data sent in the request body?", options: ["HttpServletRequest", "HttpServletResponse", "ServletConfig", "ServletContext"], answer: "HttpServletRequest" },
     { question: "Which method is used to forward a request to another resource?", options: ["response.sendRedirect()", "requestDispatcher.forward()", "request.forward()", "servlet.forward()"], answer: "requestDispatcher.forward()" },
     { question: "What is the difference between sendRedirect() and forward()?", options: ["sendRedirect works client-side, forward works server-side", "forward changes the URL in the browser", "sendRedirect preserves request attributes", "Both are identical"], answer: "sendRedirect works client-side, forward works server-side" },
     { question: "Which implicit scope in Servlet is shared across all users and servlets in the app?", options: ["Request scope", "Session scope", "Application/ServletContext scope", "Page scope"], answer: "Application/ServletContext scope" },
     { question: "Which annotation is used to map a Servlet class to a URL pattern in Servlet 3.0+?", options: ["@WebMapping", "@WebServlet", "@ServletMap", "@Controller"], answer: "@WebServlet" },
     { question: "How do you retrieve HTTP Session object in a Servlet?", options: ["request.getSession()", "response.getSession()", "new HttpSession()", "ServletContext.getSession()"], answer: "request.getSession()" },
     { question: "Which status code represents 'Not Found' in HTTP response?", options: ["200", "401", "404", "500"], answer: "404" },
     { question: "Which class provides a default abstract implementation of the Servlet interface?", options: ["HttpServlet", "GenericServlet", "BaseServlet", "WebComponent"], answer: "GenericServlet" },
     { question: "Which interface is used to intercept HTTP requests before they reach a Servlet?", options: ["Filter", "Interceptor", "ServletFilter", "RequestFilter"], answer: "Filter" },
     { question: "Which method of HttpServlet deals with form submissions sent via POST method?", options: ["doGet()", "doPost()", "processPost()", "handlePost()"], answer: "doPost()" },
     { question: "What is the default scope of a Servlet in a Web Container?", options: ["Prototype", "Singleton", "Request", "Session"], answer: "Singleton" },
     { question: "Which method removes an attribute stored in the HttpSession?", options: ["session.deleteAttribute()", "session.removeAttribute()", "session.clear()", "session.invalidate()"], answer: "session.removeAttribute()" },
     { question: "Which interface is used to read initialization parameters defined in web.xml for a specific servlet?", options: ["ServletContext", "ServletConfig", "FilterConfig", "ServletRequest"], answer: "ServletConfig" },
     { question: "Which method invalidates a session and unbinds any objects bound to it?", options: ["session.destroy()", "session.invalidate()", "session.close()", "session.end()"], answer: "session.invalidate()" },
     { question: "What deployment descriptor file is traditionally used to configure servlets?", options: ["context.xml", "web.xml", "application.xml", "pom.xml"], answer: "web.xml" }
   ];

   // 5. JSP QUESTIONS (20)
   const jspQuestions = [
     { question: "What does JSP stand for?", options: ["Java Server Pages", "Java Service Pages", "Java Scripting Page", "Java System Pages"], answer: "Java Server Pages" },
     { question: "Which JSP tag is used to write Java code directly inside HTML?", options: ["<%-- --%>", "<%! %>", "<%= %>", "<% %>"], answer: "<% %>" },
     { question: "Which tag is used for JSP Expressions to print output directly?", options: ["<% %>", "<%= %>", "<%! %>", "<%@ %>"], answer: "<%= %>" },
     { question: "Which JSP tag is used to declare variables and methods at the class level?", options: ["<%! %>", "<%= %>", "<% %>", "<%@ %>"], answer: "<%! %>" },
     { question: "Which JSP directive is used to import packages?", options: ["<%@ include %>", "<%@ page import=\"...\" %>", "<%@ taglib %>", "<%@ import %>"], answer: "<%@ page import=\"...\" %>" },
     { question: "How many implicit objects are available in JSP by default?", options: ["5", "7", "9", "11"], answer: "9" },
     { question: "Which implicit object in JSP corresponds to ServletConfig?", options: ["config", "context", "application", "page"], answer: "config" },
     { question: "Which implicit object is used to write text into the HTTP response stream?", options: ["response", "out", "writer", "print"], answer: "out" },
     { question: "What is the syntax for Expression Language (EL) in JSP?", options: ["${expression}", "#{expression}", "%{expression}", "*{expression}"], answer: "${expression}" },
     { question: "Which tag library is standardly used for iteration and condition checks in JSP?", options: ["EL", "JSTL", "Struts", "Spring Tags"], answer: "JSTL" },
     { question: "Which prefix is commonly used for JSTL Core tags?", options: ["jstl", "c", "core", "fmt"], answer: "c" },
     { question: "What is the life cycle transition of a JSP page?", options: ["JSP -> Servlet Class -> Compilation -> Execution", "JSP -> Translation to Servlet -> Class Compilation -> Execution", "JSP -> Direct Bytecode Execution", "JSP -> HTML Compilation"], answer: "JSP -> Translation to Servlet -> Class Compilation -> Execution" },
     { question: "Which directive includes a file during the translation phase of JSP?", options: ["<jsp:include>", "<%@ include file=\"...\" %>", "<c:import>", "<jsp:param>"], answer: "<%@ include file=\"...\" %>" },
     { question: "What is the difference between <jsp:include> and <%@ include %>?", options: ["<jsp:include> is runtime, <%@ include %> is compile time", "<jsp:include> is compile time, <%@ include %> is runtime", "Both are identical", "<jsp:include> works only with HTML"], answer: "<jsp:include> is runtime, <%@ include %> is compile time" },
     { question: "Which JSP implicit object holds page scope attributes?", options: ["page", "pageContext", "request", "session"], answer: "pageContext" },
     { question: "How do you disable session creation in a JSP page?", options: ["<%@ page session=\"false\" %>", "<%@ session off %>", "<jsp:session enable=\"false\"/>", "session.disable()"], answer: "<%@ page session=\"false\" %>" },
     { question: "Which standard action is used to instantiate or locate a JavaBean class?", options: ["<jsp:useBean>", "<jsp:setProperty>", "<jsp:getProperty>", "<jsp:plugin>"], answer: "<jsp:useBean>" },
     { question: "How do you write comments in JSP that won't be sent to the browser HTML?", options: ["<!-- comment -->", "// comment", "<%-- comment --%>", "/* comment */"], answer: "<%-- comment --%>" },
     { question: "Which implicit object in JSP represents the actual generated Servlet instance?", options: ["pageContext", "page", "config", "this"], answer: "page" },
     { question: "Which page directive attribute specifies an error page to handle unhandled exceptions?", options: ["isErrorPage", "errorPage", "catchError", "exceptionPage"], answer: "errorPage" }
   ];

   // 6. MAVEN QUESTIONS (20)
   const mavenQuestions = [
     { question: "What is the main configuration file used in a Maven project?", options: ["build.xml", "settings.xml", "pom.xml", "maven.json"], answer: "pom.xml" },
     { question: "What does POM stand for in Maven?", options: ["Project Object Model", "Program Execution Model", "Project Operation Module", "Package Management Model"], answer: "Project Object Model" },
     { question: "Which Maven lifecycle phase compiles the source code of the project?", options: ["validate", "compile", "test", "package"], answer: "compile" },
     { question: "Where does Maven store downloaded dependencies locally by default?", options: ["C:\\Program Files\\Maven", "~/.m2/repository", "/usr/bin/maven", "./target/lib"], answer: "~/.m2/repository" },
     { question: "Which Maven command removes the target directory containing compiled files?", options: ["mvn remove", "mvn clean", "mvn purge", "mvn delete"], answer: "mvn clean" },
     { question: "Which element in pom.xml uniquely identifies a group or company producing a project?", options: ["artifactId", "groupId", "version", "name"], answer: "groupId" },
     { question: "Which phase in Maven packages the compiled code into a JAR or WAR file?", options: ["compile", "test-compile", "package", "install"], answer: "package" },
     { question: "Which command installs the built package into the local Maven repository?", options: ["mvn install", "mvn deploy", "mvn package", "mvn publish"], answer: "mvn install" },
     { question: "What is the correct order of default Maven lifecycle phases?", options: ["compile -> test -> package -> install", "validate -> package -> compile -> install", "test -> compile -> package -> install", "clean -> build -> run"], answer: "compile -> test -> package -> install" },
     { question: "Which Maven command skips unit test execution during build?", options: ["mvn package -DskipTests", "mvn package --no-tests", "mvn install -ignoreTests", "mvn clean -noTest"], answer: "mvn package -DskipTests" },
     { question: "Which scope indicates a dependency is provided by the JDK or runtime container?", options: ["compile", "provided", "runtime", "system"], answer: "provided" },
     { question: "Which scope is default for Maven dependencies if none is specified?", options: ["compile", "provided", "test", "runtime"], answer: "compile" },
     { question: "Which dependency scope is only needed for compiling and running tests?", options: ["runtime", "compile", "test", "provided"], answer: "test" },
     { question: "What tool allows running Maven commands without installing Maven globally?", options: ["Maven Wrapper (mvnw)", "Maven Plugin", "Maven Daemon", "POM Runner"], answer: "Maven Wrapper (mvnw)" },
     { question: "Which Maven phase copies and deploys the final package to a remote repository?", options: ["install", "deploy", "site", "package"], answer: "deploy" },
     { question: "Where are global configuration parameters for Maven user mirrors stored?", options: ["pom.xml", "settings.xml", "maven.config", "web.xml"], answer: "settings.xml" },
     { question: "How do you specify plugins in pom.xml?", options: ["<plugins>", "<dependencies>", "<modules>", "<libraries>"], answer: "<plugins>" },
     { question: "What is Central Repository in Maven?", options: ["A local folder", "A default remote repository provided by Apache Maven community", "A private server", "A database"], answer: "A default remote repository provided by Apache Maven community" },
     { question: "What element defines child modules in a multi-module Maven project?", options: ["<modules>", "<projects>", "<children>", "<subprojects>"], answer: "<modules>" },
     { question: "Which command generates an archetype template for creating a new project?", options: ["mvn archetype:generate", "mvn create-project", "mvn init", "mvn new"], answer: "mvn archetype:generate" }
   ];

   // 7. HIBERNATE QUESTIONS (20)
   const hibernateQuestions = [
     { question: "What type of framework is Hibernate?", options: ["MVC Framework", "ORM Framework", "Testing Framework", "Build Tool"], answer: "ORM Framework" },
     { question: "What does ORM stand for?", options: ["Object Relational Mapping", "Object Reference Model", "Operational Resource Management", "Object Routing Mapping"], answer: "Object Relational Mapping" },
     { question: "Which file is default for Hibernate configuration?", options: ["hibernate.xml", "hibernate.cfg.xml", "orm.xml", "application.properties"], answer: "hibernate.cfg.xml" },
     { question: "Which interface is used to create and open Session objects in Hibernate?", options: ["SessionFactory", "SessionManager", "EntityManagerFactory", "Transaction"], answer: "SessionFactory" },
     { question: "Is SessionFactory thread-safe and lightweight?", options: ["Thread-safe and heavyweight", "Thread-safe and lightweight", "Not thread-safe and lightweight", "Not thread-safe and heavyweight"], answer: "Thread-safe and heavyweight" },
     { question: "Which object represents a single unit of work with database in Hibernate?", options: ["SessionFactory", "Session", "Query", "Transaction"], answer: "Session" },
     { question: "Is Hibernate Session thread-safe?", options: ["Yes", "No", "Depends on database", "Only in Spring environment"], answer: "No" },
     { question: "Which state describes an entity object not associated with a Session and has no DB representation?", options: ["Persistent", "Transient", "Detached", "Removed"], answer: "Transient" },
     { question: "Which state describes an object associated with an active Session and database row?", options: ["Transient", "Persistent", "Detached", "Garbage Collected"], answer: "Persistent" },
     { question: "Which method is used to save or update an entity depending on primary key existence?", options: ["save()", "update()", "saveOrUpdate()", "merge()"], answer: "saveOrUpdate()" },
     { question: "What language does Hibernate use for object-oriented queries?", options: ["SQL", "HQL (Hibernate Query Language)", "JPQL", "GraphQL"], answer: "HQL (Hibernate Query Language)" },
     { question: "What is the primary difference between get() and load() methods in Session?", options: ["get() returns null if not found; load() throws ObjectNotFoundException / returns Proxy", "load() returns null; get() throws exception", "get() hits DB lazily; load() hits DB immediately", "Both are exactly same"], answer: "get() returns null if not found; load() throws ObjectNotFoundException / returns Proxy" },
     { question: "What caching level is enabled by default in Hibernate?", options: ["First Level Cache (Session scope)", "Second Level Cache (SessionFactory scope)", "Query Cache", "No caching"], answer: "First Level Cache (Session scope)" },
     { question: "Which annotation marks a class as a persistent database entity?", options: ["@Table", "@Entity", "@Model", "@DatabaseObject"], answer: "@Entity" },
     { question: "Which annotation specifies the primary key of an entity?", options: ["@Key", "@PrimaryKey", "@Id", "@GeneratedValue"], answer: "@Id" },
     { question: "What does the cascade property in mappings do?", options: ["Automatically propagates operations from parent to child entities", "Deletes database tables", "Creates indexes", "Manages thread safety"], answer: "Automatically propagates operations from parent to child entities" },
     { question: "Which HQL statement fetches entities without writing native SQL?", options: ["SELECT e FROM Employee e", "SELECT * FROM Employee", "FETCH Employee", "GET Employee"], answer: "SELECT e FROM Employee e" },
     { question: "What exception occurs when an N+1 query problem happens?", options: ["It is a performance issue, not an exception", "HibernateException", "LazyInitializationException", "SQLException"], answer: "It is a performance issue, not an exception" },
     { question: "Which exception occurs when accessing uninitialized lazy association outside an active session?", options: ["NullPointerException", "LazyInitializationException", "SessionClosedException", "EntityNotFoundException"], answer: "LazyInitializationException" },
     { question: "Which generator strategy lets database handle auto-increment column?", options: ["GenerationType.AUTO", "GenerationType.IDENTITY", "GenerationType.SEQUENCE", "GenerationType.TABLE"], answer: "GenerationType.IDENTITY" }
   ];

   // 8. JPA QUESTIONS (20)
   const jpaQuestions = [
     { question: "What does JPA stand for?", options: ["Java Persistence API", "Java Programming Access", "Java Process Application", "Java Package Architecture"], answer: "Java Persistence API" },
     { question: "Is JPA a specification or an implementation?", options: ["Specification", "Implementation", "Library", "Database"], answer: "Specification" },
     { question: "Which interface is the main entry point for managing entity lifecycles in JPA?", options: ["Session", "EntityManager", "DbContext", "JpaRepository"], answer: "EntityManager" },
     { question: "Which interface creates EntityManager instances?", options: ["EntityManagerFactory", "SessionFactory", "PersistenceManager", "EntityBuilder"], answer: "EntityManagerFactory" },
     { question: "What file contains JPA configuration properties and persistence-unit definitions?", options: ["hibernate.cfg.xml", "persistence.xml", "application.yml", "jpa-config.xml"], answer: "persistence.xml" },
     { question: "Which annotation specifies the table name mapped to an entity class?", options: ["@Entity", "@Table", "@Column", "@DatabaseTable"], answer: "@Table" },
     { question: "Which method in EntityManager attaches a transient entity to persistence context?", options: ["persist()", "merge()", "find()", "flush()"], answer: "persist()" },
     { question: "Which method in EntityManager updates or copies state of detached entity into persistent context?", options: ["persist()", "merge()", "refresh()", "save()"], answer: "merge()" },
     { question: "What is the default FetchType for `@ManyToOne` and `@OneToOne` relationships in JPA?", options: ["LAZY", "EAGER", "DYNAMIC", "NONE"], answer: "EAGER" },
     { question: "What is the default FetchType for `@OneToMany` and `@ManyToMany` relationships in JPA?", options: ["EAGER", "LAZY", "JOIN", "BATCH"], answer: "LAZY" },
     { question: "Which annotation defines a composite primary key class?", options: ["@EmbeddedId", "@IdClass", "Both @EmbeddedId and @IdClass", "@CompositeKey"], answer: "Both @EmbeddedId and @IdClass" },
     { question: "Which method forces changes in persistence context to sync with the database immediately?", options: ["flush()", "commit()", "sync()", "save()"], answer: "flush()" },
     { question: "Which JPA query language is used to write DB-agnostic queries against entity models?", options: ["SQL", "JPQL", "HQL", "CQL"], answer: "JPQL" },
     { question: "Which annotation maps an Enum field to database as a String instead of Ordinal number?", options: ["@Enumerated(EnumType.STRING)", "@EnumString", "@MapEnum", "@Column(type=STRING)"], answer: "@Enumerated(EnumType.STRING)" },
     { question: "What annotation marks a field that should NOT be persisted in the database?", options: ["@Ignore", "@Transient", "@Skip", "@NonPersistent"], answer: "@Transient" },
     { question: "Which relationship type requires a join table by default?", options: ["@OneToOne", "@ManyToOne", "@OneToMany", "@ManyToMany"], answer: "@ManyToMany" },
     { question: "Which locking mechanism prevents concurrent modifications using a version field?", options: ["Pessimistic Locking", "Optimistic Locking", "Exclusive Locking", "Shared Locking"], answer: "Optimistic Locking" },
     { question: "Which annotation marks a field for Optimistic Locking control?", options: ["@Version", "@Lock", "@Revision", "@Sequence"], answer: "@Version" },
     { question: "What does `mappedBy` attribute indicate in bidirectional relationships?", options: ["It marks the owning side of the relationship", "It marks the non-owning (inverse) side of the relationship", "It creates a foreign key column", "It enables caching"], answer: "It marks the non-owning (inverse) side of the relationship" },
     { question: "Which popular ORM framework implements the JPA specification?", options: ["Hibernate", "EclipseLink", "Apache OpenJPA", "All of the above"], answer: "All of the above" }
   ];

   // 9. SPRING QUESTIONS (20)
   const springQuestions = [
     { question: "What is the central concept of the Spring Framework?", options: ["Inversion of Control (IoC) / Dependency Injection (DI)", "Direct Instantiation", "Tight Coupling", "Manual Memory Allocation"], answer: "Inversion of Control (IoC) / Dependency Injection (DI)" },
     { question: "Which interface represents the Spring IoC container?", options: ["BeanFactory", "ApplicationContext", "Both BeanFactory and ApplicationContext", "SpringContainer"], answer: "Both BeanFactory and ApplicationContext" },
     { question: "What is the default bean scope in Spring Framework?", options: ["Prototype", "Singleton", "Request", "Session"], answer: "Singleton" },
     { question: "Which scope creates a new bean instance every time it is requested from the container?", options: ["Singleton", "Prototype", "Request", "GlobalSession"], answer: "Prototype" },
     { question: "Which annotation marks a class as a Spring component for auto-detection?", options: ["@Component", "@Service", "@Repository", "All of the above"], answer: "All of the above" },
     { question: "Which annotation is used to inject dependencies automatically by type?", options: ["@Inject", "@Autowired", "@Resource", "All of the above"], answer: "@Autowired" },
     { question: "Which annotation is used along with @Autowired to resolve ambiguity when multiple beans of same type exist?", options: ["@Primary", "@Qualifier", "Both @Primary and @Qualifier", "@Select"], answer: "Both @Primary and @Qualifier" },
     { question: "What method is called immediately after a bean's properties are set by the container?", options: ["@PostConstruct", "@PreDestroy", "init()", "afterProperties()"], answer: "@PostConstruct" },
     { question: "What method is called before a bean is removed from the container?", options: ["@PostConstruct", "@PreDestroy", "destroy()", "cleanUp()"], answer: "@PreDestroy" },
     { question: "What programming paradigm does Spring AOP support?", options: ["Aspect-Oriented Programming", "Array-Oriented Programming", "Asynchronous Operations", "Applied Object Parsing"], answer: "Aspect-Oriented Programming" },
     { question: "In Spring AOP, what is a JoinPoint?", options: ["A point during execution of a program, such as method execution", "The advice logic", "The class containing aspects", "A config XML"], answer: "A point during execution of a program, such as method execution" },
     { question: "Which AOP advice runs both before and after a method execution?", options: ["@Before", "@After", "@Around", "@AfterReturning"], answer: "@Around" },
     { question: "Which annotation is used to declare Java-based configuration classes?", options: ["@Configuration", "@SpringConfig", "@EnableAutoConfiguration", "@Setup"], answer: "@Configuration" },
     { question: "Which annotation inside a @Configuration class indicates that a method returns a Spring Bean?", options: ["@Bean", "@Component", "@Service", "@Provide"], answer: "@Bean" },
     { question: "What is Dependency Injection?", options: ["Creating objects using 'new' keyword inside class", "Passing dependent objects into a class rather than class creating them itself", "Reading XML files", "Database connection pool"], answer: "Passing dependent objects into a class rather than class creating them itself" },
     { question: "Which injection type is recommended as best practice in Spring?", options: ["Field Injection", "Setter Injection", "Constructor Injection", "Interface Injection"], answer: "Constructor Injection" },
     { question: "Which module of Spring provides declarative transaction management?", options: ["Spring AOP", "Spring TX (Transactions)", "Spring Core", "Spring ORM"], answer: "Spring TX (Transactions)" },
     { question: "Which annotation enables declarative transaction management on methods or classes?", options: ["@Transactional", "@EnableTransaction", "@TransactionManagement", "@Tx"], answer: "@Transactional" },
     { question: "What is Spring MVC?", options: ["A module for building web applications following Model-View-Controller pattern", "A database tool", "A testing framework", "A security layer"], answer: "A module for building web applications following Model-View-Controller pattern" },
     { question: "Which annotation maps Web request URLs to specific handler methods in Spring MVC?", options: ["@RequestMapping", "@GetMapping", "@PostMapping", "All of the above"], answer: "All of the above" }
   ];

   // 10. SPRING BOOT QUESTIONS (20)
   const springBootQuestions = [
     { question: "What is the primary goal of Spring Boot?", options: ["To replace Java", "To simplify Spring application deployment and configuration (Convention over Configuration)", "To write frontend UI", "To manage SQL databases"], answer: "To simplify Spring application deployment and configuration (Convention over Configuration)" },
     { question: "Which annotation combines @Configuration, @EnableAutoConfiguration, and @ComponentScan?", options: ["@SpringBootApplication", "@EnableSpringBoot", "@SpringBootConfig", "@MainBoot"], answer: "@SpringBootApplication" },
     { question: "What file is commonly used for external configuration in Spring Boot?", options: ["application.properties or application.yml", "boot.xml", "spring.json", "config.properties"], answer: "application.properties or application.yml" },
     { question: "Which Spring Boot dependency provides embedded Tomcat web server and Web MVC starter?", options: ["spring-boot-starter-web", "spring-boot-starter-tomcat", "spring-boot-starter-core", "spring-boot-starter-rest"], answer: "spring-boot-starter-web" },
     { question: "What is the default embedded application server in Spring Boot Web?", options: ["Jetty", "Undertow", "Apache Tomcat", "GlassFish"], answer: "Apache Tomcat" },
     { question: "Which Spring Boot module provides production-ready features like metrics, health check, and env info?", options: ["Spring Boot DevTools", "Spring Boot Actuator", "Spring Boot CLI", "Spring Boot Starter"], answer: "Spring Boot Actuator" },
     { question: "Which Actuator endpoint checks if the application is running fine?", options: ["/metrics", "/health", "/info", "/env"], answer: "/health" },
     { question: "How do you run a Spring Boot application from Maven command line?", options: ["mvn spring-boot:run", "mvn boot:start", "mvn run", "mvn start-app"], answer: "mvn spring-boot:run" },
     { question: "Which dependency provides automatic restart and live-reload during development?", options: ["spring-boot-starter-actuator", "spring-boot-devtools", "spring-boot-reloader", "spring-boot-starter-test"], answer: "spring-boot-devtools" },
     { question: "How do you read a property value from application.properties in a Spring Bean?", options: ["@Value(\"${property.name}\")", "@Property(\"property.name\")", "@Config(\"property.name\")", "Environment.get()"], answer: "@Value(\"${property.name}\")" },
     { question: "Which annotation maps custom configuration properties classes to structured keys in application.yml?", options: ["@ConfigurationProperties", "@ValueProperties", "@BootProperties", "@AppProps"], answer: "@ConfigurationProperties" },
     { question: "What type of artifact is generated by Spring Boot that contains all dependencies packaged together?", options: ["Thin JAR", "Fat JAR / Executable JAR", "Plain WAR", "ZIP Bundle"], answer: "Fat JAR / Executable JAR" },
     { question: "Which annotation creates RESTful webservice controller returning JSON/XML directly?", options: ["@Controller", "@RestController", "@WebController", "@ResponseBodyController"], answer: "@RestController" },
     { question: "What annotation binds HTTP request body directly to a domain object method parameter?", options: ["@RequestParam", "@PathVariable", "@RequestBody", "@ModelAttribute"], answer: "@RequestBody" },
     { question: "Which annotation extracts dynamic path variables from request URI (e.g. /users/{id})?", options: ["@RequestParam", "@PathVariable", "@QueryParam", "@HeaderParam"], answer: "@PathVariable" },
     { question: "Which profile feature allows loading different configurations for Dev, Test, and Prod?", options: ["Spring Profiles (@Profile)", "Spring Environments", "Boot States", "Config Switcher"], answer: "Spring Profiles (@Profile)" },
     { question: "How do you set active profile via command line during JAR execution?", options: ["java -jar app.jar --spring.profiles.active=dev", "java -jar app.jar -profile=dev", "java -dev app.jar", "mvn active-profile=dev"], answer: "java -jar app.jar --spring.profiles.active=dev" },
     { question: "Which Spring Boot starter is used to integrate Spring Data JPA and Hibernate?", options: ["spring-boot-starter-data-jpa", "spring-boot-starter-hibernate", "spring-boot-starter-orm", "spring-boot-starter-db"], answer: "spring-boot-starter-data-jpa" },
     { question: "Interface provided by Spring Data JPA that gives CRUD operations out of the box?", options: ["CrudRepository", "JpaRepository", "PagingAndSortingRepository", "All of the above"], answer: "All of the above" },
     { question: "What default port does Spring Boot embedded Tomcat run on?", options: ["80", "8080", "8000", "3000"], answer: "8080" }
   ];

   // 11. SPRING SECURITY QUESTIONS (20)
   const springSecurityQuestions = [
     { question: "What is the main purpose of Spring Security?", options: ["Database caching", "Authentication and Authorization", "HTML rendering", "API routing"], answer: "Authentication and Authorization" },
     { question: "What is Authentication?", options: ["Verifying WHO a user is", "Verifying WHAT a user is allowed to do", "Encrypting passwords", "Generating tokens"], answer: "Verifying WHO a user is" },
     { question: "What is Authorization?", options: ["Verifying WHO a user is", "Verifying WHAT permissions a user has", "Validating form fields", "Connecting to DB"], answer: "Verifying WHAT permissions a user has" },
     { question: "Which architectural pattern is Spring Security based on in web applications?", options: ["Servlet Filters (Filter Chain)", "Aspect-Oriented Advice", "Database Triggers", "MVC Interceptors"], answer: "Servlet Filters (Filter Chain)" },
     { question: "What does JWT stand for?", options: ["Java Web Token", "JSON Web Token", "JavaScript Work Text", "Joint Web Transfer"], answer: "JSON Web Token" },
     { question: "What three parts make up a JSON Web Token (JWT)?", options: ["Header, Payload, Signature", "Header, Body, Footer", "Key, Secret, Value", "User, Role, Expiry"], answer: "Header, Payload, Signature" },
     { question: "Which interface in Spring Security is loaded to retrieve user credentials from DB or memory?", options: ["UserDetailsService", "AuthenticationManager", "PasswordEncoder", "SecurityContext"], answer: "UserDetailsService" },
     { question: "Which interface handles password hashing/verification in Spring Security?", options: ["BCryptEncoder", "PasswordEncoder", "SecurityHash", "DigestEncoder"], answer: "PasswordEncoder" },
     { question: "Which PasswordEncoder implementation is recommended by default in modern Spring Security?", options: ["NoOpPasswordEncoder", "MD5PasswordEncoder", "BCryptPasswordEncoder", "SHA256Encoder"], answer: "BCryptPasswordEncoder" },
     { question: "Where is the current authenticated user's details stored during a request execution?", options: ["HttpSession", "SecurityContextHolder", "ApplicationContext", "ServletRequest"], answer: "SecurityContextHolder" },
     { question: "Which annotation enables method-level security (e.g. @PreAuthorize)?", options: ["@EnableWebSecurity", "@EnableMethodSecurity", "@EnableSecurity", "@SecuredMethod"], answer: "@EnableMethodSecurity" },
     { question: "What cross-site security threat does Spring Security protect against using tokens by default?", options: ["XSS", "CSRF (Cross-Site Request Forgery)", "SQL Injection", "DDoS"], answer: "CSRF (Cross-Site Request Forgery)" },
     { question: "In stateless REST APIs using JWT, CSRF protection is usually:", options: ["Disabled", "Enabled", "Mandatory", "Replaced with CORS"], answer: "Disabled" },
     { question: "What HTTP header is standard for passing JWT tokens?", options: ["Authorization: Bearer <token>", "Authentication: Token <token>", "X-Access-Token: <token>", "Security: <token>"], answer: "Authorization: Bearer <token>" },
     { question: "Which interface evaluates credentials and returns an authenticated Authentication object?", options: ["AuthenticationManager", "UserDetailsService", "SecurityFilter", "TokenProvider"], answer: "AuthenticationManager" },
     { question: "Which annotation is applied to a configuration class to configure web security filter chain?", options: ["@EnableWebSecurity", "@SecurityConfig", "@EnableAuth", "@WebSecurity"], answer: "@EnableWebSecurity" },
     { question: "In SecurityFilterChain configuration, which method permits public access to specific endpoints without authentication?", options: ["permitSelf()", "permitAll()", "anonymous()", "allowPublic()"], answer: "permitAll()" },
     { question: "Which mechanism allows resources on a web page to be requested from another domain outside the domain from which the first resource was served?", options: ["CORS (Cross-Origin Resource Sharing)", "CSRF", "OAuth2", "JWT"], answer: "CORS (Cross-Origin Resource Sharing)" },
     { question: "What protocol framework is widely used for delegated authorization (e.g. Login with Google)?", options: ["OAuth2", "HTTP Basic", "Form Login", "SAML 1.0"], answer: "OAuth2" },
     { question: "Which HTTP status code is returned when authentication fails or is missing?", options: ["401 Unauthorized", "403 Forbidden", "400 Bad Request", "500 Internal Error"], answer: "401 Unauthorized" }
   ];

   // 12. REST API QUESTIONS (20)
   const restApiQuestions = [
     { question: "What does REST stand for?", options: ["Representational State Transfer", "Remote Execution Service System", "Responsive External State Transmission", "Restful Entity Storage Template"], answer: "Representational State Transfer" },
     { question: "Which HTTP method is idempotent and used to retrieve resources without changing server state?", options: ["POST", "GET", "PUT", "DELETE"], answer: "GET" },
     { question: "Which HTTP method is used to create a new resource on the server?", options: ["GET", "POST", "PUT", "PATCH"], answer: "POST" },
     { question: "Which HTTP method is used for full replacement/update of a resource?", options: ["POST", "PATCH", "PUT", "UPDATE"], answer: "PUT" },
     { question: "Which HTTP method is used for partial update of a resource?", options: ["PUT", "PATCH", "POST", "MODIFY"], answer: "PATCH" },
     { question: "What property guarantees that multiple identical requests produce the same result as a single request?", options: ["Idempotency", "Statelessness", "Caching", "Scalability"], answer: "Idempotency" },
     { question: "Which HTTP status code range represents Success?", options: ["1xx", "2xx", "3xx", "4xx"], answer: "2xx" },
     { question: "Which HTTP status code indicates a resource was successfully created?", options: ["200 OK", "201 Created", "202 Accepted", "204 No Content"], answer: "201 Created" },
     { question: "Which HTTP status code indicates authentication is required or failed?", options: ["400", "401", "403", "404"], answer: "401" },
     { question: "Which HTTP status code indicates authenticated user lacks permission to access a resource?", options: ["401 Unauthorized", "403 Forbidden", "404 Not Found", "409 Conflict"], answer: "403 Forbidden" },
     { question: "What architectural constraint requires REST requests to contain all necessary info without server storing session state?", options: ["Cacheable", "Stateless", "Layered System", "Uniform Interface"], answer: "Stateless" },
     { question: "What content format is most widely used in modern REST APIs?", options: ["XML", "JSON", "HTML", "YAML"], answer: "JSON" },
     { question: "What does HATEOAS stand for in advanced REST APIs?", options: ["Hypermedia As The Engine Of Application State", "HTTP And Text Encoding Over Application Service", "Hypertext Application Transfer Endpoint Operating System", "Header Authentication Towards External Operation State"], answer: "Hypermedia As The Engine Of Application State" },
     { question: "Which HTTP header specifies the format of the response expected by the client?", options: ["Content-Type", "Accept", "Authorization", "User-Agent"], answer: "Accept" },
     { question: "Which HTTP header specifies the format of data being sent in the request body?", options: ["Accept", "Content-Type", "Content-Encoding", "Host"], answer: "Content-Type" },
     { question: "Which HTTP status code is used when a request fails due to client input validation error?", options: ["400 Bad Request", "404 Not Found", "500 Internal Server Error", "405 Method Not Allowed"], answer: "400 Bad Request" },
     { question: "Which HTTP status code is returned when an API method succeeds but has no content to return in response body?", options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"], answer: "204 No Content" },
     { question: "What tool/specification is standard for documenting REST APIs interactively?", options: ["Swagger / OpenAPI", "Postman", "JUnit", "Docker"], answer: "Swagger / OpenAPI" },
     { question: "In RESTful URL conventions, resource names should preferably be:", options: ["Verbs (e.g., /getUser)", "Nouns in plural form (e.g., /users)", "CamelCase strings", "Database table column names"], answer: "Nouns in plural form (e.g., /users)" },
     { question: "Which HTTP status code indicates an unhandled exception occurred on the server side?", options: ["400", "404", "500 Internal Server Error", "503 Service Unavailable"], answer: "500 Internal Server Error" }
   ];

   // 13. MICROSERVICES QUESTIONS (20)
   const microservicesQuestions = [
     { question: "What is Microservices Architecture?", options: ["Building a single unified codebase for all features", "Architectural style decomposing application into small, independent, loosely-coupled services", "Running database on multiple servers", "Using microcontrollers"], answer: "Architectural style decomposing application into small, independent, loosely-coupled services" },
     { question: "What is the role of Netflix Eureka or Consul in Microservices?", options: ["Service Discovery and Registration", "API Routing", "Database Storage", "Distributed Tracing"], answer: "Service Discovery and Registration" },
     { question: "What is the primary role of an API Gateway (e.g. Spring Cloud Gateway)?", options: ["Entry point for clients, routing, rate limiting, authentication", "Running database queries", "Compiling Java code", "Managing Docker containers"], answer: "Entry point for clients, routing, rate limiting, authentication" },
     { question: "Which design pattern prevents cascading failures across microservices by cutting network calls when downstream service is down?", options: ["Circuit Breaker Pattern (Resilience4j / Hystrix)", "Saga Pattern", "CQRS Pattern", "Sidecar Pattern"], answer: "Circuit Breaker Pattern (Resilience4j / Hystrix)" },
     { question: "Which pattern manages distributed transactions across multiple microservices without 2-phase commit?", options: ["Saga Pattern", "Factory Pattern", "Singleton Pattern", "Strangler Fig Pattern"], answer: "Saga Pattern" },
     { question: "What pattern separates read operations from write operations for performance optimization?", options: ["CQRS (Command Query Responsibility Segregation)", "Saga", "Outbox Pattern", "API Gateway"], answer: "CQRS (Command Query Responsibility Segregation)" },
     { question: "Which component in Spring Cloud centralized configuration across environment profiles?", options: ["Spring Cloud Config Server", "Spring Cloud Eureka", "Spring Cloud Bus", "Spring Cloud Gateway"], answer: "Spring Cloud Config Server" },
     { question: "Which tool/library is commonly used for distributed tracing across microservices?", options: ["Zipkin / Jaeger / Spring Cloud Sleuth (Micrometer Tracing)", "JUnit", "Log4j", "Maven"], answer: "Zipkin / Jaeger / Spring Cloud Sleuth (Micrometer Tracing)" },
     { question: "How do microservices communicate synchronously?", options: ["REST APIs or gRPC", "Kafka / RabbitMQ", "Shared SQL Database", "File system"], answer: "REST APIs or gRPC" },
     { question: "How do microservices communicate asynchronously for event-driven systems?", options: ["Message Brokers like Apache Kafka / RabbitMQ", "Direct HTTP GET calls", "Shared memory", "Direct JDBC connections"], answer: "Message Brokers like Apache Kafka / RabbitMQ" },
     { question: "What database management strategy is recommended in Microservices?", options: ["Database-per-service", "Single shared database for all services", "No database at all", "Central Excel file"], answer: "Database-per-service" },
     { question: "What pattern gradually migrates a monolithic application to microservices by replacing features one by one?", options: ["Strangler Fig Pattern", "Bulkhead Pattern", "Saga Pattern", "Proxy Pattern"], answer: "Strangler Fig Pattern" },
     { question: "What is the Bulkhead Pattern used for?", options: ["Isolating resource pools (threads/connections) so failure in one area doesn't bring down whole service", "Routing HTTP traffic", "Centralized logging", "Encrypting passwords"], answer: "Isolating resource pools (threads/connections) so failure in one area doesn't bring down whole service" },
     { question: "In a microservice architecture, what propagates correlation IDs across request hops for tracking?", options: ["Distributed Tracing", "API Gateway", "Service Registry", "Load Balancer"], answer: "Distributed Tracing" },
     { question: "Which Spring Cloud tool is a declarative HTTP client simplifying calls between microservices?", options: ["OpenFeign", "RestTemplate", "WebClient", "HttpClient"], answer: "OpenFeign" },
     { question: "What is Client-Side Load Balancing tool in Spring Cloud ecosystem?", options: ["Spring Cloud LoadBalancer (formerly Ribbon)", "Eureka", "Zuul", "Sleuth"], answer: "Spring Cloud LoadBalancer (formerly Ribbon)" },
     { question: "What is the main challenge of Microservices architecture?", options: ["Complexity in monitoring, deployment, network latency, and distributed testing", "Slow single-thread performance", "Inability to use Java", "Limited memory"], answer: "Complexity in monitoring, deployment, network latency, and distributed testing" },
     { question: "What lightweight container technology is universally paired with Microservices?", options: ["Docker", "VirtualBox", "VMware", "Tomcat"], answer: "Docker" },
     { question: "What container orchestration engine manages deployment, scaling, and networking of microservices?", options: ["Kubernetes (K8s)", "Jenkins", "GitLab", "Nginx"], answer: "Kubernetes (K8s)" },
     { question: "Which pattern publishes domain events to a local DB table before sending to a message broker to ensure transactional consistency?", options: ["Transactional Outbox Pattern", "Circuit Breaker", "API Gateway", "Sidecar"], answer: "Transactional Outbox Pattern" }
   ];

   // 14. MYSQL QUESTIONS (20)
   const mysqlQuestions = [
     { question: "Which SQL command is used to retrieve data from a table?", options: ["FETCH", "SELECT", "GET", "EXTRACT"], answer: "SELECT" },
     { question: "Which clause filters rows based on a specified condition?", options: ["WHERE", "ORDER BY", "GROUP BY", "HAVING"], answer: "WHERE" },
     { question: "What is the main difference between WHERE and HAVING clauses?", options: ["WHERE filters individual rows before grouping; HAVING filters aggregated groups", "HAVING filters individual rows; WHERE filters groups", "WHERE is only used with JOIN", "They are identical"], answer: "WHERE filters individual rows before grouping; HAVING filters aggregated groups" },
     { question: "Which JOIN returns all records when there is a match in either left or right table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answer: "FULL OUTER JOIN" },
     { question: "Which JOIN returns all rows from the left table and matched rows from the right table?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"], answer: "LEFT JOIN" },
     { question: "What type of key uniquely identifies each record in a table and cannot contain NULL values?", options: ["Foreign Key", "Primary Key", "Unique Key", "Candidate Key"], answer: "Primary Key" },
     { question: "What type of key enforces referential integrity between two tables?", options: ["Primary Key", "Foreign Key", "Super Key", "Alternate Key"], answer: "Foreign Key" },
     { question: "Which MySQL constraint ensures all values in a column are distinct?", options: ["UNIQUE", "NOT NULL", "CHECK", "DEFAULT"], answer: "UNIQUE" },
     { question: "Which command is used to add, delete, or modify columns in an existing table?", options: ["UPDATE TABLE", "ALTER TABLE", "MODIFY TABLE", "CHANGE TABLE"], answer: "ALTER TABLE" },
     { question: "What is the difference between DELETE and TRUNCATE commands?", options: ["DELETE is DML (can rollback, row-by-row); TRUNCATE is DDL (faster, resets auto-increment)", "TRUNCATE can use WHERE clause; DELETE cannot", "DELETE resets primary key counter; TRUNCATE does not", "Both are DML commands"], answer: "DELETE is DML (can rollback, row-by-row); TRUNCATE is DDL (faster, resets auto-increment)" },
     { question: "Which aggregate function calculates the average value of a numeric column?", options: ["SUM()", "AVG()", "COUNT()", "MEAN()"], answer: "AVG()" },
     { question: "Which keyword is used to eliminate duplicate rows from query results?", options: ["UNIQUE", "DISTINCT", "DIFFERENT", "SINGLE"], answer: "DISTINCT" },
     { question: "What database structure speeds up data retrieval operations at the cost of additional storage and write speed?", options: ["Index", "Trigger", "Stored Procedure", "View"], answer: "Index" },
     { question: "What is a Stored Procedure?", options: ["A virtual table", "A prepared SQL code segment saved in DB that can be reused", "A backup mechanism", "A transaction log"], answer: "A prepared SQL code segment saved in DB that can be reused" },
     { question: "What is a MySQL Trigger?", options: ["A set of SQL statements that automatically execute when an INSERT, UPDATE, or DELETE occurs", "A schedule for backups", "A type of database index", "A user permission rule"], answer: "A set of SQL statements that automatically execute when an INSERT, UPDATE, or DELETE occurs" },
     { question: "Which ACID property ensures that all operations in a transaction complete successfully or none are applied?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: "Atomicity" },
     { question: "Which ACID property guarantees that committed transaction data is permanently saved even during power failure?", options: ["Atomicity", "Consistency", "Isolation", "Durability"], answer: "Durability" },
     { question: "Which default storage engine in MySQL supports ACID transactions and foreign keys?", options: ["MyISAM", "InnoDB", "Memory", "CSV"], answer: "InnoDB" },
     { question: "Which function returns the current date and time in MySQL?", options: ["NOW()", "CURRENT_DATE()", "GETDATE()", "TODAY()"], answer: "NOW()" },
     { question: "Which clause sorts the result set in descending order?", options: ["ORDER BY col ASC", "ORDER BY col DESC", "SORT BY col DESC", "GROUP BY col DESC"], answer: "ORDER BY col DESC" }
   ];

   // 15. GIT & GITHUB QUESTIONS (20)
   const gitQuestions = [
     { question: "What is Git?", options: ["A centralized cloud database", "A Distributed Version Control System (DVCS)", "A programming language", "A build tool"], answer: "A Distributed Version Control System (DVCS)" },
     { question: "Which command initializes a new Git repository in the current folder?", options: ["git start", "git init", "git create", "git new"], answer: "git init" },
     { question: "Which command stages modified files for the next commit?", options: ["git save", "git add .", "git stage", "git push"], answer: "git add ." },
     { question: "Which command records staged snapshots into project history with a message?", options: ["git commit -m \"message\"", "git push -m \"message\"", "git save -m \"message\"", "git log -m \"message\""], answer: "git commit -m \"message\"" },
     { question: "Which command checks the status of working directory and staging area?", options: ["git log", "git status", "git diff", "git info"], answer: "git status" },
     { question: "Which command shows the commit history log?", options: ["git history", "git log", "git commits", "git track"], answer: "git log" },
     { question: "Which command creates a new branch named 'feature-auth'?", options: ["git branch feature-auth", "git create feature-auth", "git checkout -b feature-auth", "Both git branch feature-auth and git checkout -b feature-auth"], answer: "Both git branch feature-auth and git checkout -b feature-auth" },
     { question: "Which command switches to an existing branch named 'dev'?", options: ["git switch dev or git checkout dev", "git move dev", "git branch dev", "git change dev"], answer: "git switch dev or git checkout dev" },
     { question: "Which command merges changes from branch 'dev' into current active branch?", options: ["git combine dev", "git merge dev", "git pull dev", "git join dev"], answer: "git merge dev" },
     { question: "What is a Merge Conflict in Git?", options: ["When Git cannot automatically resolve differences in code between two commits being merged", "When server is down", "When repository is full", "When a file is deleted locally"], answer: "When Git cannot automatically resolve differences in code between two commits being merged" },
     { question: "Which command fetches changes from remote repository and immediately merges them into current local branch?", options: ["git fetch", "git pull", "git sync", "git clone"], answer: "git pull" },
     { question: "What is the difference between git fetch and git pull?", options: ["git fetch updates remote-tracking branches without merging; git pull fetches and merges", "git pull does not merge; git fetch merges", "They are identical", "git fetch works offline"], answer: "git fetch updates remote-tracking branches without merging; git pull fetches and merges" },
     { question: "Which command uploads local commits to a remote repository?", options: ["git push", "git upload", "git send", "git publish"], answer: "git push" },
     { question: "Which command downloads an existing remote repository to local machine?", options: ["git download", "git clone", "git copy", "git checkout remote"], answer: "git clone" },
     { question: "What command temporarily shelves/stashes uncommitted local changes so you can work on something else?", options: ["git stash", "git hold", "git pause", "git hide"], answer: "git stash" },
     { question: "Which command reapplies previously stashed changes?", options: ["git stash pop", "git stash apply", "Both git stash pop and git stash apply", "git stash get"], answer: "Both git stash pop and git stash apply" },
     { question: "What GitHub feature allows developers to propose changes from their branch and request code reviews before merging?", options: ["Pull Request (PR)", "Issue", "Fork", "Action"], answer: "Pull Request (PR)" },
     { question: "What does 'Forking' a repository on GitHub mean?", options: ["Creating a copy of someone else's repository under your GitHub account", "Deleting a repository", "Creating a new branch", "Cloning to local disk"], answer: "Creating a copy of someone else's repository under your GitHub account" },
     { question: "What file specifies intentionally untracked files that Git should ignore (e.g. node_modules, target)?", options: [".gitconfig", ".gitignore", ".gitkeep", "ignore.txt"], answer: ".gitignore" },
     { question: "Which command rewrites history by applying commits on top of another base tip?", options: ["git rebase", "git reset", "git revert", "git cherry-pick"], answer: "git rebase" }
   ];

   // 16. DOCKER QUESTIONS (20)
   const dockerQuestions = [
     { question: "What is Docker?", options: ["An OS virtual machine manager", "A platform for containerizing applications and running them in isolated environments", "A Cloud Database", "A Java IDE"], answer: "A platform for containerizing applications and running them in isolated environments" },
     { question: "What is the main difference between a Docker Container and a Virtual Machine (VM)?", options: ["Containers share host OS kernel and are lightweight; VMs package full OS and are heavy", "VMs share host kernel; Containers do not", "Containers are slower than VMs", "VMs don't need hypervisors"], answer: "Containers share host OS kernel and are lightweight; VMs package full OS and are heavy" },
     { question: "What text file contains instructions to build a Docker image?", options: ["docker-compose.yml", "Dockerfile", "Docker.config", "Containerfile"], answer: "Dockerfile" },
     { question: "Which command builds a Docker image from a Dockerfile in current directory?", options: ["docker create -t myapp .", "docker build -t myapp .", "docker run -t myapp .", "docker compile ."], answer: "docker build -t myapp ." },
     { question: "Which Dockerfile instruction sets the base image for subsequent instructions?", options: ["START", "FROM", "BASE", "IMAGE"], answer: "FROM" },
     { question: "Which Dockerfile instruction sets executable default command when container runs?", options: ["RUN", "CMD", "ENTRYPOINT", "Both CMD and ENTRYPOINT"], answer: "Both CMD and ENTRYPOINT" },
     { question: "What is the difference between RUN and CMD in Dockerfile?", options: ["RUN executes during image build phase; CMD executes when container starts", "CMD builds image; RUN starts container", "They are identical", "RUN sets environment variables"], answer: "RUN executes during image build phase; CMD executes when container starts" },
     { question: "Which command creates and starts a container from a Docker image?", options: ["docker start", "docker run", "docker execute", "docker launch"], answer: "docker run" },
     { question: "Which flag runs a Docker container in detached (background) mode?", options: ["-d", "-b", "-bg", "--detach-mode"], answer: "-d" },
     { question: "How do you map host port 8080 to container port 80 during container run?", options: ["-p 8080:80", "-p 80:8080", "-port 8080->80", "-map 8080-80"], answer: "-p 8080:80" },
     { question: "Which command lists all currently running Docker containers?", options: ["docker ps", "docker list", "docker containers", "docker show"], answer: "docker ps" },
     { question: "Which command lists ALL containers (both running and stopped)?", options: ["docker ps -a", "docker ps --all", "Both docker ps -a and docker ps --all", "docker list all"], answer: "Both docker ps -a and docker ps --all" },
     { question: "Which command stops a running container gracefully?", options: ["docker kill <container_id>", "docker stop <container_id>", "docker remove <container_id>", "docker halt"], answer: "docker stop <container_id>" },
     { question: "Which command removes a stopped container?", options: ["docker rmi", "docker rm", "docker delete", "docker purge"], answer: "docker rm" },
     { question: "Which command removes a Docker image from local registry?", options: ["docker rm", "docker rmi", "docker delete image", "docker purge image"], answer: "docker rmi" },
     { question: "What central repository is used to search and download public Docker images?", options: ["Docker Hub", "GitHub Packages", "Maven Central", "Docker Store"], answer: "Docker Hub" },
     { question: "What tool allows defining and running multi-container Docker applications using a YAML file?", options: ["Docker Swarm", "Docker Compose", "Kubernetes", "Docker Engine"], answer: "Docker Compose" },
     { question: "What is the default filename used by Docker Compose?", options: ["docker-compose.yml", "docker-container.yml", "compose.json", "docker.yaml"], answer: "docker-compose.yml" },
     { question: "Which command starts all services defined in docker-compose.yml in background?", options: ["docker-compose start", "docker-compose up -d", "docker-compose run", "docker-compose launch"], answer: "docker-compose up -d" },
     { question: "What mechanism in Docker persists container data even after container is deleted?", options: ["Docker Volumes", "Docker Networks", "Docker Cache", "Host Memory"], answer: "Docker Volumes" }
   ];

   // 17. AWS QUESTIONS (20)
   const awsQuestions = [
     { question: "What does AWS stand for?", options: ["Amazon Web Services", "Amazon Web Storage", "Automated Web System", "Advanced Web Solutions"], answer: "Amazon Web Services" },
     { question: "Which AWS service provides resizable virtual compute servers in the cloud?", options: ["Amazon S3", "Amazon EC2", "Amazon RDS", "AWS Lambda"], answer: "Amazon EC2" },
     { question: "What does EC2 stand for?", options: ["Elastic Compute Cloud", "Elastic Central Computer", "Enterprise Cloud Computing", "External Cloud Engine"], answer: "Elastic Compute Cloud" },
     { question: "Which AWS service provides object storage for files, images, and backups?", options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "Amazon DynamoDB"], answer: "Amazon S3" },
     { question: "What does S3 stand for?", options: ["Simple Storage Service", "Secure Storage System", "Scalable Server Storage", "Shared Storage Service"], answer: "Simple Storage Service" },
     { question: "Which AWS managed service provides relational databases like MySQL, PostgreSQL, Oracle?", options: ["Amazon DynamoDB", "Amazon RDS", "Amazon Redshift", "Amazon ElastiCache"], answer: "Amazon RDS" },
     { question: "What service controls access permissions and user identities in AWS?", options: ["AWS IAM (Identity and Access Management)", "AWS KMS", "AWS Shield", "AWS Secrets Manager"], answer: "AWS IAM (Identity and Access Management)" },
     { question: "What service allows running serverless code in response to events without provisioning servers?", options: ["Amazon EC2", "AWS Lambda", "AWS Fargate", "Elastic Beanstalk"], answer: "AWS Lambda" },
     { question: "What virtual network service isolates your AWS resources in a logically defined cloud network?", options: ["AWS VPC (Virtual Private Cloud)", "AWS Direct Connect", "AWS Route 53", "AWS CloudFront"], answer: "AWS VPC (Virtual Private Cloud)" },
     { question: "Which AWS service acts as a virtual firewall controlling inbound/outbound traffic for EC2 instances?", options: ["Network ACL", "Security Group", "AWS WAF", "Route Table"], answer: "Security Group" },
     { question: "Which AWS service is a managed NoSQL key-value database?", options: ["Amazon RDS", "Amazon DynamoDB", "Amazon Aurora", "Amazon DocumentDB"], answer: "Amazon DynamoDB" },
     { question: "Which AWS service provides DNS routing and domain name registration?", options: ["AWS Route 53", "AWS CloudFront", "AWS API Gateway", "AWS Direct Connect"], answer: "AWS Route 53" },
     { question: "Which AWS service is a global Content Delivery Network (CDN) for fast static content distribution?", options: ["AWS CloudFront", "AWS Route 53", "AWS S3", "AWS Global Accelerator"], answer: "AWS CloudFront" },
     { question: "What AWS service automatically adjusts EC2 instance count based on application load?", options: ["AWS Auto Scaling", "Elastic Load Balancing", "AWS CloudWatch", "AWS Launch Template"], answer: "AWS Auto Scaling" },
     { question: "Which component automatically distributes incoming app traffic across multiple EC2 targets?", options: ["Elastic Load Balancer (ELB)", "Auto Scaling", "Route 53", "Internet Gateway"], answer: "Elastic Load Balancer (ELB)" },
     { question: "Which service monitors AWS resources and applications in real-time with metrics and alarms?", options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Config", "AWS X-Ray"], answer: "Amazon CloudWatch" },
     { question: "Which service records AWS API activity and account audit history for governance?", options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Trusted Advisor", "AWS GuardDuty"], answer: "AWS CloudTrail" },
     { question: "What block storage service provides persistent storage volumes for EC2 instances?", options: ["Amazon S3", "Amazon EBS (Elastic Block Store)", "Amazon EFS", "AWS Glacier"], answer: "Amazon EBS (Elastic Block Store)" },
     { question: "What service allows easy deployment and scaling of Spring Boot/Node apps without managing infrastructure?", options: ["AWS Elastic Beanstalk", "AWS CloudFormation", "AWS ECS", "AWS OpsWorks"], answer: "AWS Elastic Beanstalk" },
     { question: "What container registry service in AWS stores and manages Docker container images?", options: ["AWS ECR (Elastic Container Registry)", "AWS ECS", "AWS EKS", "Docker Hub"], answer: "AWS ECR (Elastic Container Registry)" }
   ];

 // 1. Sabhi 17 Topics ki Mapping Object
 const questionsMap = {
   "Core Java": coreJavaQuestions,
   "Advanced Java": advancedJavaQuestions,
   "JDBC": jdbcQuestions,
   "Servlet": servletQuestions,
   "JSP": jspQuestions,
   "Maven": mavenQuestions,
   "Hibernate": hibernateQuestions,
   "JPA": jpaQuestions,
   "Spring": springQuestions,
   "Spring Boot": springBootQuestions,
   "Spring Security": springSecurityQuestions,
   "REST API": restApiQuestions,
   "Microservices": microservicesQuestions,
   "MySQL": mysqlQuestions,
   "Git & GitHub": gitQuestions,
   "Docker": dockerQuestions,
   "AWS": awsQuestions
 };

 // 2. Direct 1-Line Dynamic Selector (Isne getQuestionsForTopic() ko replace kar diya)
 const currentQuestionsList = questionsMap[selectedQuizTopic] || [];


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
                   },
                   {
                     icon: "🌐",
                     name: "Servlet",
                     desc: "HTTP request/response lifecycle, filters, session management & web app fundamentals."
                   },
                   {
                     icon: "📄",
                     name: "JSP",
                     desc: "Java Server Pages, JSTL, EL expressions & dynamic web content generation."
                   },
                   {
                     icon: "📦",
                     name: "Maven",
                     desc: "Build automation, dependency management, POM.xml & project lifecycle."
                   },
                   {
                     icon: "🗄",
                     name: "Hibernate",
                     desc: "ORM mapping, sessions, caching & entity lifecycle."
                   },
                   {
                     icon: "💎",
                     name: "JPA",
                     desc: "Repositories, queries, relationships & the Java persistence standard."
                   },
                   {
                     icon: "🌱",
                     name: "Spring",
                     desc: "IoC, dependency injection, beans & the core of the Spring ecosystem."
                   },
                   {
                     icon: "🚀",
                     name: "Spring Boot",
                     desc: "Auto-configuration, REST APIs, starters & building production-ready apps fast."
                   },
                   {
                     icon: "🔐",
                     name: "Spring Security",
                     desc: "Authentication, authorization, JWT & securing your endpoints."
                   },
                   {
                     icon: "🔗",
                     name: "REST API",
                     desc: "RESTful design, HTTP methods, status codes & API best practices."
                   },
                   {
                     icon: "🧩",
                     name: "Microservices",
                     desc: "Service decomposition, Eureka, API Gateway & distributed systems patterns."
                   },
                   {
                     icon: "🗃️",
                     name: "MySQL",
                     desc: "SQL queries, joins, indexes, stored procedures & database design."
                   },
                   {
                     icon: "🐙",
                     name: "Git & GitHub",
                     desc: "Version control, branching, merging, pull requests & collaboration."
                   },
                   {
                     icon: "🐳",
                     name: "Docker",
                     desc: "Containerization, Dockerfile, images & deploying Java apps with Docker Compose."
                   },
                   {
                     icon: "☁️",
                     name: "AWS",
                     desc: "EC2, S3, RDS, IAM & deploying Spring Boot apps on the cloud."
                   }
                 ].map((topic) => (
                   <div
                     key={topic.name}
                     className="topic-card"
                     onClick={() => {
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

                      {/* DYNAMIC QUIZ PLAY SCREEN FOR ALL TOPICS */}
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

                            {/* Dynamic Topic Title */}
                            <h1>{selectedQuizTopic} Quiz</h1>
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

                                // DYNAMIC NEXT / SUBMIT LOGIC
                                if (currentQuestion < currentQuestionsList.length - 1) {
                                  setCorrectAnswers(newCorrectAnswers);
                                  setCurrentQuestion(currentQuestion + 1);
                                  setSelectedAnswer(null);
                                } else {
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

                            {/* ✅ FIX 1: Dynamic Topic Name (Pehele 'Core Java' hardcoded tha) */}
                            <h1>{quizResult.topic} Quiz</h1>

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
                                    {/* ✅ FIX 1 (Sub): Dynamic Topic in message */}
                                    <p>You have a strong understanding of {quizResult.topic}.</p>
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
                                    {/* ✅ FIX 1 (Sub): Dynamic Topic in message */}
                                    <p>Revise {quizResult.topic} concepts and try the quiz again.</p>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* BUTTONS */}
                            <div className="result-actions">
                              <button
                                className="result-primary-btn"
                                onClick={() => {
                                  // ✅ FIX 2: Selected topic ko dynamic quizResult.topic se set kiya gaya hai
                                  const currentTopic = quizResult.topic;
                                  setQuizResult(null);
                                  setSelectedQuizTopic(currentTopic);
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

  {/* MAIN ROUTING LOGIC */}
  {!selectedTopic && !selectedQuizTopic && !quizResult ? (
    !showTopics ? (
      <>
        {/* 1. HERO SECTION */}
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

        {/* 2. WHY LEARN WITH US */}
        <div className="why-learn-header">
          <h2 className="why-learn-title">Why learn with us?</h2>
          <p className="why-learn-subtitle">
            Everything you need to boost your technical career in one place.
          </p>
        </div>

        <div className="why-learn-card">
          <div className="feature-item">
            <div className="feature-icon-badge">🧠</div>
            <h3 className="feature-title">Data Structure</h3>
            <p className="feature-desc">
              You'll gain the basic to advance knowledge you need to do great in technical interviews and become a coding expert.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-badge">🎯</div>
            <h3 className="feature-title">Interactive Topic Quizzes</h3>
            <p className="feature-desc">
              Test your knowledge with multiple quizzes across various Java topics to enhance problem-solving skills and track your interview readiness.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-badge">📄</div>
            <h3 className="feature-title">ATS Resume Checker</h3>
            <p className="feature-desc">
              Free built-in ATS Resume Checker tool to analyze your resume against top industry standards and get instantly shortlisted.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-badge">📚</div>
            <h3 className="feature-title">Handwritten Notes Download</h3>
            <p className="feature-desc">
              Get direct access to comprehensive, high-quality PDF notes created by mentors to revise core Java concepts anytime.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-badge">💬</div>
            <h3 className="feature-title">Learn from the Best</h3>
            <p className="feature-desc">
              Get insights and guidance from an experienced software engineer who has trained over 15,000+ developers across platforms.
            </p>
          </div>
        </div>

        {/* 3. MENTOR SECTION */}
        <div className="mentor-card-wrapper">
          <div className="mentor-vertical-container">
            <img
              src={mentorPic}
              alt="Murari Pandey"
              className="mentor-avatar-glow"
            />
            <h2 className="mentor-badge-single">✨ MEET YOUR MENTOR</h2>
            <h1 className="mentor-name-shining">Murari Pandey</h1>
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

        {/* 4. FOOTER */}
        <footer className="footer-container">
          <div className="footer-content">
            <div className="footer-brand-badge">
              <img
                src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg"
                alt="Java Logo"
                width="22"
                height="22"
              />
              <span className="footer-brand-title">Java Developer</span>
            </div>
            <p className="footer-subtitle">
              Become a Software Engineer in top product-based companies. Master Java, Data Structures, System Design, and crack your interviews.
            </p>
            <div className="footer-nav-links">
              <a href="#privacy" className="footer-nav-link">Privacy Policy</a>
              <a href="#terms" className="footer-nav-link">Terms of Use</a>
              <button onClick={() => setShowContact(true)} className="footer-contact-btn">
                Contact Us
              </button>
              <a href="#refund" className="footer-nav-link">Refund Policy</a>
            </div>
            <div className="footer-social-wrapper">
              <a href="https://linkedin.com/in/murari-sigma7" target="_blank" rel="noreferrer" className="social-icon-card linkedin">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://github.com/Murari-sigma" target="_blank" rel="noreferrer" className="social-icon-card github">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://t.me/murari_ipandey01" target="_blank" rel="noreferrer" className="social-icon-card telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.55.84-1.12.52l-3.1-2.29-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.16 5.76-5.2c.25-.22-.05-.34-.39-.12l-7.12 4.48-3.07-.96c-.67-.21-.68-.67.14-.99l12.01-4.63c.56-.2 1.05.14.83.84z"/>
                </svg>
              </a>
              <a href="https://instagram.com/jupitar_xyz" target="_blank" rel="noreferrer" className="social-icon-card instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
            </div>
            <div className="footer-divider"></div>
            <p className="footer-copyright">
              © {new Date().getFullYear()} Java Developer. Designed for learning & tech interview prep.
            </p>
          </div>
          </footer>
              </>
            ) : (
              /* TOPICS SELECTION VIEW */
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
            )
          ) : (
            /* TOPIC VIEW - jab topic select ho */
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