const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Subject = require('../models/subject.model');
const Unit = require('../models/unit.model');

const academicData = [
  {
    name: "Semester 1",
    number: 1,
    subjects: [
      {
        code: "BCA101",
        name: "IT Tools and Applications",
        units: [
          { title: "Unit 1: Computer Basics", topics: ["Characteristics of Computers", "Input", "Output", "Storage units", "CPU", "Computer system", "Binary number system", "Binary to Decimal Conversion", "Decimal to Binary Conversion", "Binary Coded Decimal (BCD) Code", "ASCII Code", "Applications of IT in different fields"] },
          { title: "Unit 2: Computer Organization", topics: ["Central Processing Unit", "Control Unit", "Arithmetic Unit", "Memory", "Main Memory", "Storage Evaluation Criteria", "Memory Organization", "Capacity", "RAM", "Read Only Memories", "Secondary Storage Devices", "Input Devices", "Output Devices"] },
          { title: "Unit 3: Computer Software", topics: ["Hardware and Software", "System Software", "Application Software", "Operating System", "Types of Operating System", "Functions of Operating System", "DOS commands", "File operations", "Directory commands", "Windows overview", "File management in Windows"] },
          { title: "Unit 4: Multimedia and Word Processing", topics: ["Multimedia", "Text", "Graphics", "Animation", "Audio", "Images", "Video", "Applications of Multimedia", "Word Processing", "Editing text", "Formatting", "Printing", "Mail merge", "Page layout"] },
          { title: "Unit 5: Spreadsheet and Presentation", topics: ["Spreadsheet basics", "Workbook handling", "Formulas", "Functions", "Charts", "Graphs", "Presentation tools", "Slides", "Animations", "Slide show"] }
        ]
      },
      {
        code: "BCA102",
        name: "Principles of Mathematics",
        units: [
          { title: "Unit 1: Sets and Relations", topics: ["Set concepts", "Types of sets", "Venn diagrams", "Union", "Intersection", "Difference", "Partitioning", "Relations", "Binary relations", "Equivalence relations", "Composition of relations"] },
          { title: "Unit 2: Functions", topics: ["Functions", "Types of functions", "Inverse functions", "Composition of functions", "Trigonometric functions", "Binomial theorem", "Mathematical induction"] },
          { title: "Unit 3: Matrices and Determinants", topics: ["Matrices", "Properties", "Determinants", "Minors", "Cofactors", "Matrix operations"] },
          { title: "Unit 4: Progression", topics: ["Arithmetic progression", "Geometric progression", "Harmonic progression", "Means (AM, GM, HM)"] },
          { title: "Unit 5: Statistics", topics: ["Data collection", "Charts", "Mean", "Median", "Mode"] }
        ]
      },
      {
        code: "BCA103",
        name: "Functional English",
        units: [
          { title: "Unit 1: Communication", topics: ["Meaning of communication", "Objectives", "Process", "Barriers", "Types"] },
          { title: "Unit 2: Phonetics", topics: ["Phonetics basics", "Symbols", "Stress", "Transcription"] },
          { title: "Unit 3: Grammar", topics: ["Sentence structure", "Types of sentences", "Articles", "Prepositions"] },
          { title: "Unit 4: Vocabulary", topics: ["Synonyms", "Antonyms", "Idioms", "One word substitution"] },
          { title: "Unit 5: Communication Skills", topics: ["Precis writing", "Comprehension", "CV writing", "Letter writing", "Dialogue writing"] }
        ]
      },
      {
        code: "BCA104",
        name: "Programming in C",
        units: [
          { title: "Unit 1: Basics", topics: ["Algorithms", "Flowcharts", "Compilation", "Variables", "Data types", "Operators", "Input output"] },
          { title: "Unit 2: Control Statements", topics: ["If", "If-else", "Switch", "Loops", "Goto"] },
          { title: "Unit 3: Arrays and Functions", topics: ["Arrays", "Matrix operations", "Functions", "Recursion"] },
          { title: "Unit 4: Structures and Pointers", topics: ["Structures", "Unions", "Pointers", "Pointer arithmetic"] },
          { title: "Unit 5: File Handling", topics: ["File operations", "Reading files", "Writing files"] }
        ]
      }
    ]
  },
  {
    name: "Semester 2",
    number: 2,
    subjects: [
      {
        code: "BCA201",
        name: "Discrete Mathematics",
        units: [
          { title: "Unit 1: Set Theory, Relations and Functions", topics: ["Set notation and description", "Subsets", "Basic set operations", "Venn diagrams", "Laws of set theory", "Partition of sets", "Min sets", "Duality principle", "Relations", "Properties of relations", "Functions", "Injective functions", "Surjective functions", "Bijective functions", "Composition of functions"] },
          { title: "Unit 2: Permutation, Combination and Algebraic Systems", topics: ["Rule of product", "Permutations", "Combinations", "Binary operations", "Associativity", "Identity element", "Universal element", "Group", "Subgroup", "Ring", "Field"] },
          { title: "Unit 3: Algebra of Logic", topics: ["Propositions", "Logical operators", "Negation", "Conjunction", "Disjunction", "Conditional", "Biconditional", "Truth tables", "Tautologies", "Contradictions", "Equivalence of formulas", "Well-formed formulas", "Normal forms"] },
          { title: "Unit 4: Recursion and Recurrence", topics: ["Recursion", "Recursion vs iteration", "Closed form expression", "Sequence of integers", "Recurrence relations", "Linear homogeneous recurrence relations", "Non-homogeneous recurrence relations", "Generating functions"] },
          { title: "Unit 5: Graphs and Trees", topics: ["Types of graphs", "Simple graphs", "Multigraphs", "Directed graphs", "Undirected graphs", "Graph representation in memory", "Adjacency matrix", "Incidence matrix", "Linked representation", "Tree terminology", "Types of trees", "Binary tree", "Tree traversal", "Binary search tree"] }
        ]
      },
      {
        code: "BCA202",
        name: "Accounting and Financial Management",
        units: [
          { title: "Unit 1: Introduction to Accounting", topics: ["Meaning of accounting", "Characteristics of accounting", "Purposes of accounting", "Limitations of accounting", "Accounting concepts", "Accounting conventions", "Generally accepted accounting principles"] },
          { title: "Unit 2: Financial Accounting", topics: ["Double entry system", "Journal", "Ledger", "Purchase book", "Sales book", "Cash book", "Trading account", "Profit and loss account", "Balance sheet"] },
          { title: "Unit 3: Management Accounting", topics: ["Nature of management accounting", "Scope", "Advantages", "Limitations", "Difference between management and financial accounting"] },
          { title: "Unit 4: Raising Funds", topics: ["Sources of funds", "Issue of shares", "Forfeiture of shares", "Reissue of forfeited shares"] },
          { title: "Unit 5: Computer Applications in Accounting", topics: ["Role of computers in accounting", "Accounting software packages"] }
        ]
      },
      {
        code: "BCA203",
        name: "Digital Circuit and Logic Design",
        units: [
          { title: "Unit 1: Number Systems", topics: ["Decimal number system", "Binary number system", "Octal number system", "Hexadecimal number system", "Conversions between number systems", "Gray code", "ASCII code", "Floating point numbers"] },
          { title: "Unit 2: Logic Gates and Boolean Algebra", topics: ["Logic gates", "Gate propagation delay", "Applications of logic gates", "Boolean operations", "SOP form", "POS form", "Karnaugh maps", "Universal gates"] },
          { title: "Unit 3: Combinational Circuits", topics: ["Half adder", "Full adder", "Serial adder", "Parallel adder", "Carry look ahead adder", "Full subtractor", "Code converters", "Multiplexer (MUX)", "Demultiplexer (DEMUX)", "Encoders", "Decoders", "Seven segment display"] },
          { title: "Unit 4: Sequential Circuits", topics: ["Latches", "Flip flops (SR, JK, D, T)", "Master slave flip flop", "Counters", "Synchronous counter", "Mod-10 counter", "Up-down counter", "Shift registers", "Parity generator", "Pulse synchronization"] },
          { title: "Unit 5: Microprocessor Basics", topics: ["Microcomputer architecture", "I/O ports", "Buses", "Microprocessor architecture", "Fetch-decode-execute cycle", "Memory mapped I/O", "I/O mapped ports", "I/O control"] }
        ]
      },
      {
        code: "BCA204",
        name: "Object Oriented Programming with C++",
        units: [
          { title: "Unit 1: OOP Concepts", topics: ["Basic concepts of OOP", "Procedural vs OOP", "Advantages of OOP", "Classes and objects", "Inheritance", "Encapsulation", "Operator overloading", "Dynamic binding", "C++ program structure"] },
          { title: "Unit 2: Elements of C++", topics: ["Tokens", "Identifiers", "Keywords", "Variables", "Constants", "Data types", "Arrays", "Strings", "Operators", "Type casting", "Input output (cin, cout)", "Control statements", "Functions", "Passing arguments", "Return values", "Inline functions", "Default arguments", "Pointers"] },
          { title: "Unit 3: Classes and Objects", topics: ["Class declaration", "Member functions", "Objects", "Array of objects", "Constructors", "Parameterized constructors", "Copy constructor", "Dynamic initialization", "Destructors"] },
          { title: "Unit 4: Operator Overloading", topics: ["Unary operator overloading", "Binary operator overloading", "Arithmetic operators", "Comparison operators", "Assignment operators", "Type conversion"] },
          { title: "Unit 5: Inheritance", topics: ["Base class", "Derived class", "Access specifiers", "Types of inheritance", "Function overriding", "Virtual functions", "Abstract classes"] }
        ]
      }
    ]
  },
  {
    name: "Semester 3",
    number: 3,
    subjects: [
      {
        code: "BCA301",
        name: "Operating System",
        units: [
          { title: "Unit 1: Introduction to Operating System", topics: ["Introduction to Operating System", "Need of Operating System", "Functions of OS", "Services of OS", "Types of OS", "Single user system", "Multi-user system", "Batch processing", "Multiprogramming", "Multitasking", "Parallel systems", "Distributed systems", "Real-time systems"] },
          { title: "Unit 2: Process Management and CPU Scheduling", topics: ["Process concept", "Process states", "Process scheduling", "Threads", "Inter-process communication", "CPU scheduling", "Scheduling criteria", "FIFO scheduling", "SJF scheduling", "Priority scheduling", "Round Robin", "Multilevel scheduling"] },
          { title: "Unit 3: Process Synchronization and Deadlock", topics: ["Process synchronization", "Critical section problem", "Semaphores", "Monitors", "Hardware synchronization", "Deadlock", "Deadlock characteristics", "Deadlock prevention", "Deadlock avoidance", "Deadlock detection", "Deadlock recovery"] },
          { title: "Unit 4: Memory Management", topics: ["Logical vs physical address", "Swapping", "Contiguous allocation", "Single partition", "Multiple partition", "Fragmentation", "Paging", "Segmentation", "Virtual memory", "Page replacement", "FIFO algorithm", "Optimal algorithm", "LRU algorithm", "Thrashing", "Working set model", "Page fault frequency"] },
          { title: "Unit 5: File Management and Security", topics: ["File concept", "Access methods", "Directory structure", "File protection", "Contiguous allocation", "Linked allocation", "Indexed allocation", "Authentication", "Program threats", "System threats", "Encryption"] }
        ]
      },
      {
        code: "BCA302",
        name: "Computer Oriented Mathematics",
        units: [
          { title: "Unit 1: Statistics", topics: ["Frequency distribution", "Arithmetic mean", "Geometric mean", "Harmonic mean", "Median", "Mode", "Range", "Mean deviation", "Standard deviation", "Coefficient of variation", "Moments", "Skewness", "Kurtosis"] },
          { title: "Unit 2: Calculus", topics: ["Differentiation", "Derivative of functions", "Power function", "Sum and product rule", "Function of a function", "Substitution method", "Maxima and minima", "Indefinite integration", "Integration by substitution", "Integration by parts", "Partial fractions", "Definite integration"] },
          { title: "Unit 3: Numerical Methods", topics: ["Numerical computing", "Significant digits", "Errors", "Error propagation", "Roots of equations", "Bisection method", "False position method", "Newton Raphson method", "Secant method"] },
          { title: "Unit 4: Linear Equations", topics: ["Matrix equations", "System of linear equations", "Pivotal condensation", "Gauss elimination", "Gauss Jordan method", "Gauss Seidel method"] },
          { title: "Unit 5: Numerical Differentiation and Integration", topics: ["Linear interpolation", "Lagrange interpolation", "Newton interpolation", "Differentiating functions", "Newton Cotes methods", "Trapezoidal rule", "Simpson 1/3 rule", "Simpson 3/8 rule"] }
        ]
      },
      {
        code: "BCA303",
        name: "Data Structure",
        units: [
          { title: "Unit 1: Basics of Data Structures", topics: ["Abstract data types", "Primitive data structures", "Derived data structures", "Algorithm definition", "Algorithm analysis", "Time complexity", "Space complexity", "Top-down approach", "Bottom-up approach"] },
          { title: "Unit 2: Arrays, Searching and Sorting", topics: ["Array representation", "Multidimensional arrays", "Address calculation", "Matrix multiplication", "Sparse matrices", "Sequential search", "Binary search", "Sorting algorithms", "Insertion sort", "Selection sort", "Bubble sort", "Quick sort", "Merge sort"] },
          { title: "Unit 3: Linked Lists", topics: ["Singly linked list", "Circular linked list", "Doubly linked list", "Polynomial representation", "Generalized list", "Sparse matrix using lists"] },
          { title: "Unit 4: Stacks and Queues", topics: ["Stack implementation", "Queue implementation", "Circular queue", "Priority queue", "Deque", "Infix to postfix", "Postfix evaluation"] },
          { title: "Unit 5: Trees and Graphs", topics: ["Binary tree", "Tree traversal", "Preorder", "Inorder", "Postorder", "Graph representation", "Adjacency matrix", "Adjacency list", "DFS", "BFS", "Spanning tree", "Prim’s algorithm", "Kruskal’s algorithm"] }
        ]
      },
      {
        code: "BCA304",
        name: "Computer Organization and Architecture",
        units: [
          { title: "Unit 1: Digital Components", topics: ["Logic gates", "Adders", "Flip flops", "Encoders", "Decoders", "Multiplexers", "Registers", "Shift registers", "Counters", "RAM", "ROM"] },
          { title: "Unit 2: Data Representation", topics: ["Number systems", "ASCII code", "Complements", "Addition", "Subtraction", "Overflow", "Floating point", "Multiplication", "Division"] },
          { title: "Unit 3: Register Transfer and Micro Operations", topics: ["Bus transfer", "Memory transfer", "Binary adder", "Arithmetic circuits", "Logic operations", "Shift operations", "ALU"] },
          { title: "Unit 4: Basic Computer Organization", topics: ["Instruction codes", "Addressing modes", "Timing signals", "Instruction cycle", "Memory reference instruction", "I/O instruction", "Interrupts"] },
          { title: "Unit 5: I/O and Memory Organization", topics: ["Input devices", "Synchronous communication", "Asynchronous communication", "DMA", "Memory hierarchy", "Cache memory", "Virtual memory"] }
        ]
      }
    ]
  },
  {
    name: "Semester 4",
    number: 4,
    subjects: [
      {
        code: "BCA401",
        name: "Introduction to Database Management System",
        units: [
          { title: "Unit 1: Introduction", topics: ["Why database", "Characteristics of data in database", "DBMS", "Significance of database", "Database system applications", "Data independence", "Advantages of DBMS", "Disadvantages of DBMS", "DBMS vs RDBMS"] },
          { title: "Unit 2: Database Architecture and Modeling", topics: ["Three level architecture", "Conceptual model", "Logical model", "Physical model", "Role of DBA", "Database design", "Entity Relationship Model", "ER components", "ER symbols", "Super class and sub class", "Attribute inheritance", "Specialization", "Generalization", "Categorization"] },
          { title: "Unit 3: Relational Model and Algebra", topics: ["Relational DBMS", "RDBMS terminology", "Database normalization", "Keys", "Relationships", "First Normal Form (1NF)", "Functional dependency", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "BCNF", "Fourth Normal Form (4NF)", "Fifth Normal Form (5NF)", "Case study", "Relational algebra operations", "Tuple relational calculus (TRC)", "Domain relational calculus (DRC)"] },
          { title: "Unit 4: SQL", topics: ["History of SQL", "Characteristics of SQL", "Advantages of SQL", "SQL data types", "SQL commands", "SQL operators", "Tables", "Views", "Indexes", "Queries", "Subqueries", "Aggregate functions", "Insert", "Update", "Delete", "Joins", "Union", "Intersection", "Minus", "Cursors", "Embedded SQL"] },
          { title: "Unit 5: Backup, Recovery and Security", topics: ["Database backup", "Backup planning", "Hardware protection", "Transaction logs", "Database recovery", "Integrity constraints", "Restrictions on constraints", "Data security risks", "Authentication"] }
        ]
      },
      {
        code: "BCA402",
        name: "Operation Research",
        units: [
          { title: "Unit 1: Introduction", topics: ["History of OR", "Meaning of OR", "Modeling in OR", "Principles of modeling", "Applications of OR", "Role in decision making"] },
          { title: "Unit 2: Linear Programming Problem", topics: ["Components of LPP", "Formulation of LPP", "Convex set", "Graphical solution", "Slack variables", "Surplus variables", "Matrix form", "Simplex method"] },
          { title: "Unit 3: Assignment Problem", topics: ["Introduction to assignment problem", "Mathematical formulation", "Fundamental theorems", "Applications", "Balanced assignment", "Unbalanced assignment", "Hungarian method"] },
          { title: "Unit 4: Transportation Problem", topics: ["Transportation matrix", "Mathematical model", "Balanced TP", "Unbalanced TP", "Matrix minima method", "Column minima method", "Vogel’s approximation method"] },
          { title: "Unit 5: Network Analysis and Game Theory", topics: ["Network analysis", "Fulkerson’s rules", "Network construction", "PERT", "CPM", "Game theory introduction", "Competitive games", "Finite games", "Infinite games", "Zero sum games", "Fundamental theorems"] }
        ]
      },
      {
        code: "BCA403",
        name: "Computer Graphics",
        units: [
          { title: "Unit 1: Introduction and Devices", topics: ["Computer graphics overview", "Interactive graphics", "Visualization", "RGB model", "CMYK model", "Graphics system", "CRT", "Raster scan display", "3D devices", "Plotters", "Printers", "Digitizers", "Light pen", "Active devices", "Passive devices", "Graphics software"] },
          { title: "Unit 2: Raster Algorithms", topics: ["Line drawing basics", "DDA algorithm", "Bresenham line algorithm", "Midpoint line algorithm", "Circle representation", "Trigonometric method", "Bresenham circle algorithm", "Midpoint circle algorithm"] },
          { title: "Unit 3: Clipping and Filling", topics: ["Types of polygons", "Concave polygon", "Convex polygon", "Seed fill", "Boundary fill", "Flood fill", "Scan line algorithm", "Polygon filling", "Pattern filling", "Line clipping", "Cohen Sutherland", "Cyrus Beck", "Liang Barsky", "Clipping circles", "Clipping ellipses", "Sutherland Hodgeman"] },
          { title: "Unit 4: Geometric Transformations", topics: ["2D transformations", "Translation", "Rotation", "Scaling", "Homogeneous coordinates", "Matrix representation", "Reflection", "Shear", "Inverse transformation", "Viewing transformation", "Normalization", "Workstation transformation", "3D transformation"] },
          { title: "Unit 5: 3D Viewing", topics: ["3D viewing", "View reference point", "View plane normal", "Viewing coordinates", "Parallel projection", "Perspective projection", "Orthographic projection", "Oblique projection"] }
        ]
      },
      {
        code: "BCA404",
        name: "Software Engineering",
        units: [
          { title: "Unit 1: Introduction", topics: ["Software characteristics", "Software components", "Applications", "SDLC models", "Waterfall model", "Spiral model", "Prototyping", "RAD", "Incremental model", "Project management", "Metrics and measurements"] },
          { title: "Unit 2: Project Planning", topics: ["Objectives", "Decomposition", "Software sizing", "Problem based estimation", "Process based estimation", "COCOMO model", "Software equation"] },
          { title: "Unit 3: Analysis", topics: ["Structured analysis", "Object oriented analysis", "Requirement analysis", "DFD", "ER diagram", "Data dictionary"] },
          { title: "Unit 4: Design", topics: ["Design objectives", "Design principles", "Data design", "Architectural design", "Procedural design", "Object oriented design"] },
          { title: "Unit 5: Testing", topics: ["Testing objectives", "Testability", "Test cases", "White box testing", "Black box testing", "Unit testing", "Integration testing", "Verification", "Validation", "System testing"] }
        ]
      }
    ]
  },
  {
    name: "Semester 5",
    number: 5,
    subjects: [
      {
        code: "BCA501",
        name: "Internet and JAVA Programming",
        units: [
          { title: "Unit 1: Internet", topics: ["Internet basics", "Connecting to Internet", "Telephone connection", "Cable connection", "Satellite connection", "Choosing ISP", "Internet services", "E-mail concepts", "Sending secure email", "Receiving secure email", "Voice conferencing", "Video conferencing"] },
          { title: "Unit 2: Core Java", topics: ["Introduction to Java", "Operators", "Data types", "Variables", "Arrays", "Control statements", "Methods", "Classes", "Inheritance", "Packages", "Interfaces", "Exception handling", "Multithreading", "I/O", "Applet", "String handling", "Networking", "Event handling", "AWT", "AWT controls", "Layout managers", "Menus", "Graphics"] },
          { title: "Unit 3: Java Swing", topics: ["Swing applications", "Swing applets", "Panes", "Look and feel", "Labels", "Text fields", "Buttons", "Toggle buttons", "Checkboxes", "Radio buttons", "View ports", "Scroll panes", "Scroll bars", "Lists", "Combo box", "Progress bar", "Menus", "Toolbars", "Layered panes", "Tabbed panes", "Split panes", "Layouts", "Windows", "Dialog boxes", "Internal frames"] },
          { title: "Unit 4: JDBC", topics: ["JDBC model", "JDBC-ODBC bridge", "java.sql package", "Database connectivity", "Remote database connection", "Result set navigation"] },
          { title: "Unit 5: Servlets and JSP", topics: ["Servlet basics", "Servlet API", "Servlet lifecycle", "Running servlets", "Debugging servlets", "Thread-safe servlets", "HTTP redirects", "Cookies", "JSP basics", "RMI", "Client-server application"] }
        ]
      },
      {
        code: "BCA502",
        name: "ORACLE and PL/SQL",
        units: [
          { title: "Unit 1: SQL Language", topics: ["Oracle architecture", "Client-server architecture", "SQL characteristics", "SQL Plus", "Data definition", "Data manipulation", "SQL commands", "SQL operators", "Queries", "Functions", "Constraints"] },
          { title: "Unit 2: Backup and Recovery", topics: ["Database recovery", "Transaction recovery", "System recovery", "Exporting data", "Importing data", "Dump files", "Hardware protection", "Transaction logs", "Importance of backups"] },
          { title: "Unit 3: Integrity and Security", topics: ["Security controls", "Audit trails", "Data encryption", "Integrity rules", "Grant privileges", "Revoke privileges", "SQL security tools"] },
          { title: "Unit 4: PL/SQL", topics: ["PL/SQL basics", "Advantages of PL/SQL", "Execution environment", "SQL in PL/SQL", "Cursors", "Triggers", "Transaction management", "Locks", "Concurrency control", "Error handling"] },
          { title: "Unit 5: Oracle Database Objects", topics: ["Oracle installation", "Procedures", "Functions", "Packages", "Overloading", "Triggers"] }
        ]
      },
      {
        code: "BCA503",
        name: "Computer Networks",
        units: [
          { title: "Unit 1: Data Communication", topics: ["Digital communication", "Analog communication", "Parallel transmission", "Serial transmission", "Synchronous communication", "Asynchronous communication", "Simplex", "Half duplex", "Full duplex", "Multiplexing", "Encoding", "Decoding", "Error detection", "Error recovery", "Network topologies", "Modulation", "OSI model", "TCP/IP model"] },
          { title: "Unit 2: Communication Channels", topics: ["UTP", "STP", "Telephone lines", "Coaxial cable", "Optical fiber", "Microwave transmission", "Infrared transmission", "Laser transmission", "Radio transmission", "Satellite transmission", "VSAT", "Switching devices"] },
          { title: "Unit 3: Data Link Layer", topics: ["Framing", "Error control", "Flow control", "HDLC", "SDLC", "SLIP", "PPP", "ALOHA", "CSMA/CD", "IEEE standards", "FDMA", "TDMA", "CDMA", "Frame relay", "ATM"] },
          { title: "Unit 4: LAN and WAN", topics: ["LAN protocols", "Ethernet", "Token ring", "FDDI", "Wireless LAN", "VLAN", "Routing", "Static routing", "Dynamic routing", "Distance vector", "Link state", "OSPF", "IP addressing", "ICMP", "ARP", "DHCP", "UDP", "TCP", "Congestion control"] },
          { title: "Unit 5: Application Layer", topics: ["Client-server model", "NFS", "Telnet", "FTP", "SMTP", "POP", "WWW", "DNS", "HTTP", "HTML"] }
        ]
      },
      {
        code: "BCA504",
        name: "Software Project Management",
        units: [
          { title: "Unit 1: Introduction", topics: ["Management spectrum", "People", "Process", "Project", "Product", "Organizational structures", "Hierarchical structure", "Flat structure", "Matrix structure", "Networked structure", "Roles in software development", "Stakeholders", "Project communication", "Project phases", "Project charter"] },
          { title: "Unit 2: Planning and Budgeting", topics: ["Work breakdown structure", "Planning methods", "Lifecycle models", "Cost estimation", "COCOMO", "Budgeting", "NPV", "ROI", "Payback model"] },
          { title: "Unit 3: Scheduling and Risk", topics: ["PERT", "Gantt chart", "Critical path", "Risk management", "Risk identification", "Risk categories", "Risk prioritization"] },
          { title: "Unit 4: Configuration Management", topics: ["Baseline", "SCI", "Version control", "Change control", "Configuration audit", "Status reporting"] },
          { title: "Unit 5: Closure and Quality", topics: ["SQA", "FTR", "Standards", "Reliability", "Maintainability", "Efficiency", "SQA plan", "Project closure", "Closure report"] }
        ]
      }
    ]
  },
  {
    name: "Semester 6",
    number: 6,
    subjects: [
      {
        code: "BCA601",
        name: "Advance Networks and Network Security",
        units: [
          { title: "Unit 1: Internetworking", topics: ["Internetworking basics", "Internetworking models", "Cisco three hierarchical model", "Switching services", "STP", "LAN switch types", "Switch configuration", "VLAN", "Routing and VLAN configuration"] },
          { title: "Unit 2: Cisco IOS and Network Management", topics: ["Flow control", "Networking methods", "Routing protocols", "Access lists", "Router operation", "Congestion problems", "Router boot sequence", "Register configuration", "IOS commands", "Backup/Restore IOS", "Router configuration"] },
          { title: "Unit 3: Information Security Fundamentals", topics: ["Security background", "National/International scenario", "Authentication", "Confidentiality", "Privacy", "Integrity", "Non-repudiation", "Availability", "Prevention/Detection/Recovery", "E-commerce security", "Security threats", "Buffer overflow", "Brute force", "Protocol attacks", "Cross-site attacks", "Spoofing", "DoS"] },
          { title: "Unit 4: System and Network Security", topics: ["OS security", "Backup strategies", "Secure protocols", "SSL/TLS", "IPSec", "Application security", "Web security", "Secure email", "Access control"] },
          { title: "Unit 5: Tools and Technologies", topics: ["Firewalls", "IDS", "Antivirus", "Log analysis", "Cryptography", "Key management", "Hashing", "PKI", "VPN", "Network scanners", "Digital forensics", "Security audits", "Asset classification", "Risk analysis", "Security policies", "Procedures", "International standards"] }
        ]
      },
      {
        code: "BCA602",
        name: "Web Development Tools and Techniques",
        units: [
          { title: "Unit 1: Introduction to Web Technology", topics: ["Introduction to web", "Web protocols", "Web development strategies", "Web applications", "Web project lifecycle", "Web team roles"] },
          { title: "Unit 2: Web Page Designing", topics: ["HTML basics", "Lists", "Tables", "Images", "Frames", "Forms", "CSS", "XML", "DTD", "XML schema"] },
          { title: "Unit 3: Scripting", topics: ["JavaScript basics", "DOM", "Forms handling", "Statements", "Functions", "Objects", "Events", "Event handling", "AJAX", "VBScript"] },
          { title: "Unit 4: Server Side Programming", topics: ["ASP", "ASP.NET", "JSP", "Tomcat server", "JSP objects", "Variables/Methods", "Debugging", "Session handling", "Application scope", "Database interaction", "JavaBeans", "COM", "DCOM"] },
          { title: "Unit 5: PHP", topics: ["PHP introduction", "Syntax", "Variables", "Strings", "Operators", "If-else", "Loops", "Switch", "Arrays", "Functions", "Forms", "Mail handling", "File upload", "Sessions", "Error/Exception handling", "Filters", "PHP ODBC"] }
        ]
      },
      {
        code: "BCA603",
        name: "Project Work",
        units: [
          { title: "Project Work and Documentation", topics: ["Project title", "Certificates", "Abstract", "Organization overview", "Problem definition", "Requirements", "Solution strategy", "Feasibility", "Planning", "Team structure", "Gantt chart", "Tools/Technologies", "DFD/Data dictionary", "Design diagrams", "Pseudo code", "Testing plan", "Implementation", "Future recommendations", "Bibliography", "Source code"] }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for final Academic seeding...');

    await Subject.deleteMany({});
    await Unit.deleteMany({});
    console.log('Cleared existing academic data');

    for (const semData of academicData) {
      for (const sub of semData.subjects) {
        const subject = await Subject.create({
          code: sub.code,
          name: sub.name,
          semester: semData.number,
        });

        const unitDocs = sub.units.map((unit, index) => ({
          subjectId: subject._id,
          unitNumber: index + 1,
          title: unit.title,
          topics: unit.topics,
        }));

        await Unit.insertMany(unitDocs);
        console.log(`Seeded Detailed Subject: ${sub.code} - ${sub.name} (Semester ${semData.number})`);
      }
    }

    console.log('Final academic seeding completed successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
