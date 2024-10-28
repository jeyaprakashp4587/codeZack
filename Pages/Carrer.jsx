import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
} from 'react-native';
import {Colors, font, pageView} from '../constants/Colors';
import {useData} from '../Context/Contexter';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Dimensions} from 'react-native';
import Skeleton from '../Skeletons/Skeleton';
import {useNavigation} from '@react-navigation/native';
import BannerAdd from '../Adds/BannerAdd';
import VideoAdd from '../Adds/VideoAdd';

const Carrer = () => {
  // courses list
  const navigation = useNavigation();
  const {setSelectedCourse} = useData();
  const {width, height} = Dimensions.get('window');

  const {showAd, isLoaded, isCredited} = VideoAdd();
  const courses = useMemo(
    () => [
      {
        name: 'Front End Development',
        introduction:
          'Learn to create engaging and responsive web interfaces using HTML, CSS, and JavaScript. Master popular frameworks like React, Bootstrap',
        technologies: [
          {
            name: 'html',
            icon: <FontAwesome5 name="html5" size={35} color="#EF6C33" />,
            details:
              'HTML (HyperText Markup Language) is the standard language for creating web pages. It describes the structure of a webpage and is used alongside CSS and JavaScript to create visually appealing and interactive websites.',
            basics: [
              'Elements and Tags: Understanding the basic HTML elements like headings, paragraphs, links, images, and lists.',
              'Attributes: Learning how to use attributes to provide additional information about elements.',
              'Document Structure: Knowing how to structure an HTML document with doctype, html, head, and body tags.',
            ],
            web: 'https://www.w3schools.com/html/default.asp',
          },
          {
            name: 'css',
            icon: <FontAwesome5 name="css3" size={35} color="#0874C5" />,
            details:
              'CSS (Cascading Style Sheets) is used to style and layout web pages. It allows you to apply styles to HTML elements, control the layout of multiple web pages, and adapt the presentation to different devices.',
            basics: [
              'Selectors: Understanding how to select elements to apply styles.',
              'Box Model: Learning about the box model, including margins, borders, padding, and content.',
              'Flexbox and Grid: Using modern layout techniques like Flexbox and CSS Grid to create complex layouts.',
            ],
            web: 'https://www.w3schools.com/css/default.asp',
          },
          {
            name: 'js',
            icon: <Ionicons name="logo-javascript" size={35} color="#E2A534" />,
            details:
              'JavaScript is a programming language that allows you to create dynamically updating content, control multimedia, animate images, and much more. It is an essential technology for creating interactive web applications.',
            basics: [
              'Variables and Data Types: Understanding how to declare variables and work with different data types.',
              'Functions: Learning how to write reusable code blocks with functions.',
              'DOM Manipulation: Using JavaScript to interact with and manipulate the Document Object Model (DOM).',
            ],
            web: 'https://www.w3schools.com/js/default.asp',
          },
          {
            name: 'react',
            icon: <FontAwesome5 name="react" size={35} color="#9EE6F7" />,
            details:
              'React is a JavaScript library for building user interfaces. It allows developers to create large web applications that can update and render efficiently in response to data changes.',
            basics: [
              'Components: Building reusable components to create complex user interfaces.',
              'State and Props: Managing the state and passing data between components.',
              'JSX: Using JSX syntax to write HTML within JavaScript.',
            ],
            web: 'https://react.dev/learn',
          },
          {
            name: 'bootstrap',
            icon: <FontAwesome5 name="bootstrap" size={35} color="#A983FF" />,
            details:
              'Bootstrap is a popular front-end framework for developing responsive and mobile-first websites. It includes CSS- and JavaScript-based design templates for typography, forms, buttons, navigation, and other interface components.',
            basics: [
              "Grid System: Using Bootstrap's grid system to create responsive layouts.",
              'Components: Utilizing pre-built components like modals, carousels, and navbars.',
              'Utilities: Applying utility classes for spacing, alignment, and more.',
            ],
            web: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/',
          },
        ],
        topics: [
          'HTML Basics',
          'CSS Styling',
          'JavaScript Fundamentals',
          'Responsive Design',
          'State Management',
          'Component-based Architecture',
        ],
        img: 'https://i.ibb.co/vzxBjQM/webdevelopment.jpg',
        guidance:
          '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/s6156ZBcfGk?si=iCIRRTcLVqOJ-mNp&amp;start=60" title="YouTube video player" frameborder="0" borderradius="10" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        bgColor: '#b8b894',
        platform: [],
      },
      {
        name: 'Back End Development',
        introduction:
          'Discover server-side programming with Node.js, Express, Mongo DB, and more. Build REST APIs, manage databases, and implement authentication.',
        technologies: [
          {
            name: 'node',
            icon: <FontAwesome5 name="node" size={35} color="orange" />,
            details:
              "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server-side, enabling the creation of scalable network applications.",
            basics: [
              'Event-driven Programming: Understanding the event-driven architecture of Node.js.',
              'Modules: Using Node.js modules to organize code.',
              'Asynchronous Programming: Managing asynchronous operations with callbacks, promises, and async/await.',
            ],
            web: 'https://www.geeksforgeeks.org/nodejs/?ref=shm',
          },
          {
            name: 'express',
            icon: (
              <MaterialCommunityIcons
                name="microsoft-internet-explorer"
                size={35}
                color="#414141"
              />
            ),
            details:
              'Express is a minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications.',
            basics: [
              'Routing: Defining routes to handle different HTTP requests.',
              'Middleware: Using middleware functions to handle requests and responses.',
              'Templates: Rendering dynamic content using template engines like EJS or Pug.',
            ],
            web: 'https://www.geeksforgeeks.org/express-js/?ref=lbp',
          },
          {
            name: 'mongodb',
            icon: <Fontisto name="mongodb" size={35} color="#72B545" />,
            details:
              'MongoDB is a document-oriented NoSQL database used for high volume data storage. It stores data in flexible, JSON-like documents, making it easy to store and retrieve data.',
            basics: [
              'Documents and Collections: Understanding the basic building blocks of MongoDB.',
              'CRUD Operations: Performing create, read, update, and delete operations.',
              'Indexes: Improving query performance with indexes.',
            ],
            web: 'https://www.w3schools.com/mongodb/index.php',
          },
        ],
        topics: [
          'Server-side Programming',
          'RESTful APIs',
          'Database Integration',
          'Authentication & Authorization',
          'Middleware',
          'Microservices',
        ],
        img: 'https://i.ibb.co/frB3LrD/11668623-20945227.jpg',
        guidance:
          '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/G-EAVcMHEko?si=h-WzoTp5lCQ7idun" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        bgColor: '#008080',
      },
      {
        name: 'App Development',
        introduction:
          'Develop high-quality mobile applications with Swift, Kotlin, Flutter, and React Native. Focus on UI design, state management, and cross-platform solutions.',
        technologies: [
          {
            name: 'swift',
            icon: <FontAwesome5 name="swift" size={35} color="#DF833A" />,
            details:
              'Swift is a powerful and intuitive programming language for macOS, iOS, watchOS, and tvOS. It is designed to give developers more freedom than ever before.',
            basics: [
              'Syntax: Understanding the basic syntax and structure of Swift.',
              'Optionals: Using optionals to handle the absence of values.',
              'Protocols: Defining blueprints of methods, properties, and other requirements.',
            ],
            web: 'https://www.swift.org/getting-started/',
          },
          {
            name: 'react Native',
            icon: <FontAwesome5 name="react" size={35} color="#4CC1E0" />,
            details:
              'React Native is a framework for building native apps using React. It enables developers to use the same codebase for both iOS and Android applications.',
            basics: [
              'Components: Creating reusable UI components.',
              'Navigation: Implementing navigation between different screens.',
              'Native Modules: Integrating with native code to use platform-specific features.',
            ],
            web: 'https://reactnative.dev/docs/getting-started',
          },
          {
            name: 'kotlin',
            icon: (
              <MaterialCommunityIcons
                name="language-kotlin"
                size={35}
                color="#70D152"
              />
            ),
            details:
              'Kotlin is a modern programming language that makes developers happier. It is concise, safe, interoperable with Java, and provides many ways to reuse code.',
            basics: [
              'Syntax: Understanding the basic syntax and structure of Kotlin.',
              'Null Safety: Handling null values safely with nullable types.',
              'Coroutines: Simplifying asynchronous programming with coroutines.',
            ],
            web: 'https://kotlinlang.org/docs/basic-syntax.html',
          },
        ],
        topics: [
          'Mobile UI Design',
          'State Management',
          'APIs and Networking',
          'Cross-platform Development',
          'App Store Deployment',
          'Performance Optimization',
        ],
        img: 'https://i.ibb.co/Lvvq3kP/appdevelopment.jpg',
        guidance:
          '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/fwdiH3343oM?si=_7dmKfgbpqvCGnKT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        bgColor: '#8cb3d9',
      },
      {
        name: 'Java',
        introduction:
          'Gain expertise in Java for enterprise-level applications. Cover OOP, data structures, concurrency, and frameworks like Spring and Hibernate.',
        technologies: [
          {
            name: 'java',
            icon: <FontAwesome5 name="java" size={35} color="#158EC9" />,
            details:
              'Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is a widely-used language for building enterprise-scale applications.',
            basics: [
              'OOP Concepts: Understanding the principles of object-oriented programming.',
              'Java Syntax: Learning the basic syntax and structure of Java.',
              'Exception Handling: Handling errors and exceptions gracefully.',
            ],
            web: 'https://www.w3schools.com/java/',
          },
        ],
        topics: [
          'Object-oriented Programming',
          'Data Structures',
          'Java Collections Framework',
          'Exception Handling',
        ],
        img: 'https://i.ibb.co/2h2hz0h/icons8-java-480.png',
        guidance:
          '<iframe width="100%" height="100%"src="https://www.youtube.com/embed/vgm6AJLu6F4?si=1Oxz5wM2q8RNw7a5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        bgColor: '#b3b3ff',
      },
      {
        name: 'C++',
        introduction:
          'Master C++ programming for performance-critical applications. Learn advanced topics like templates, STL, memory management, and multithreading.',
        technologies: [
          {
            name: 'C++',
            icon: (
              <MaterialCommunityIcons
                name="language-cpp"
                size={35}
                color="#085E9F"
              />
            ),
            details:
              'C++ is a general-purpose programming language created as an extension of the C programming language. It has imperative, object-oriented, and generic programming features.',
            basics: [
              'Syntax: Understanding the basic syntax and structure of C++.',
              'OOP Concepts: Applying object-oriented programming principles in C++.',
              'Memory Management: Managing memory manually using pointers and dynamic allocation.',
            ],
            web: 'https://www.geeksforgeeks.org/c-plus-plus/',
          },
        ],
        topics: [
          'Object-oriented Programming',
          'Templates',
          'Standard Template Library (STL)',
          'Memory Management',
          'Multithreading',
          'Advanced Data Structures',
        ],
        img: 'https://i.ibb.co/fQ7bqp8/icons8-c-240.png',
        guidance:
          '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/x0xjvTIvmT4?si=D5w0dGGvYHI0k8fS" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        bgColor: '#ff6666',
      },
    ],
    [],
  );
  // render skeleton

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
    }, 200);
  }, []);
  if (!loading) {
    return (
      <View style={pageView}>
        <Skeleton width="100%" height={height * 0.06} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.5} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
        <Skeleton width="100%" height={height * 0.1} radius={10} mt={10} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{backgroundColor: 'white'}}>
      <View style={{paddingHorizontal: 15}}>
        <Text style={styles.titleText}>Choose Your Learning Carrer</Text>
        <Image
          source={{uri: 'https://i.ibb.co/vDwVGnW/carrer.jpg'}}
          style={{
            ...styles.careerImage,
            width: width * 0.7,
            height: width * 0.7,
          }}
        />
      </View>
      <View style={styles.courseContainer}>
        {courses.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCourse(item);
              navigation.navigate('course');
            }}
            key={index}
            style={{
              ...styles.courseButton,
              width: width * 0.9,
              backgroundColor: item.bgColor,
            }}>
            <Text style={styles.courseButtonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.footerText}>Other Courses will be added soon!</Text>
      <BannerAdd />
      <Button
        title="Watch Video Ad"
        onPress={() => {
          if (isLoaded) {
            showAd();
          }
        }}
      />
    </ScrollView>
  );
};

export default React.memo(Carrer);

const styles = StyleSheet.create({
  pageView: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  titleText: {
    fontFamily: font.poppins,
    color: Colors.mildGrey,
    fontSize: 25,
    // textAlign: 'center',
    marginBottom: 20,
  },
  careerImage: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  courseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    gap: 35,
    marginTop: 20,
  },
  courseButton: {
    height: 120,
    elevation: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 6,
  },
  courseButtonText: {
    fontFamily: font.poppins,
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 0.9,
  },
  footerText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 15,
    color: Colors.lightGrey,
    fontFamily: font.poppins,
  },
});
