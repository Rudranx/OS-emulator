import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollProgress from '../components/layout/ScrollProgress';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { slideInBottom,  staggerContainer, listItem, pageTransitions, fadeIn } from '../utils/animationHelpers';

const Home = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [conceptMapRef, conceptMapInView] = useInView({ triggerOnce: true, threshold: 0.1 });


  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-16 overflow-hidden"
      variants={pageTransitions}
    >
      <ScrollProgress />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative bg-gradient-to-br from-blue-700 to-indigo-900 text-white py-16 md:py-24 overflow-hidden"
        variants={slideInBottom}
        initial="initial"
        animate={heroInView ? "animate" : "initial"}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-8">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                custom={0.2}
              >
                Exploring the Core of <br className="hidden md:block" />
                <span className="text-blue-300">Computing Systems</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-blue-100 mb-8 max-w-2xl"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                custom={0.4}
              >
                Dive into an interactive journey through the fundamentals of operating systems. Learn through visualizations, simulations, and hands-on examples.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                custom={0.6}
              >
                <Link to="/journey" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Start Learning
                </Link>
                <Link to="/simulations" className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-500 transition-colors">
                  Explore Simulations
                </Link>
              </motion.div>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              <motion.div
                className="w-full h-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <DotLottieReact
                  src="https://lottie.host/f30f3a33-13c6-4e30-8186-904efcf38e8c/qjgM7fLvtp.lottie"
                  loop
                  autoplay
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </motion.section>

      {/* OS Concept Map */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/10 dark:to-indigo-900/10 z-0"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            ref={conceptMapRef}
            initial="initial"
            animate={conceptMapInView ? "animate" : "initial"}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.7, ease: "easeOut" }
              }
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Operating System Architecture
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Understand how different components of an operating system work together to 
              manage computer resources and provide services to applications.
            </p>
          </motion.div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">OS Components Overview</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                See how the kernel, system services, and user applications interact within a layered architecture
              </p>
            </div>
            
            {/* OS Architecture Diagram - Component-based visualization instead of image */}
            <div className="relative py-8">
              {/* OS Layer Visualization */}
              <div className="flex flex-col items-center relative">
                {/* Hardware Layer */}
                <div className="w-full max-w-3xl bg-gray-100 dark:bg-gray-900 rounded-lg p-3 sm:p-4 border-2 border-gray-300 dark:border-gray-700 mb-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <h4 className="text-center font-bold text-gray-800 dark:text-gray-200 mb-2 text-sm sm:text-base">Hardware</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2 text-center">
                    <div className="bg-gray-200 dark:bg-gray-800 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-700">CPU</div>
                    <div className="bg-gray-200 dark:bg-gray-800 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-700">Memory</div>
                    <div className="bg-gray-200 dark:bg-gray-800 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-700">Disks</div>
                    <div className="bg-gray-200 dark:bg-gray-800 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-700">Network</div>
                    <div className="bg-gray-200 dark:bg-gray-800 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-700">I/O Devices</div>
                  </div>
                </div>
                
                {/* Data flow arrow */}
                <div className="h-4 sm:h-6 w-8 flex justify-center">
                  <div className="w-0.5 h-full bg-blue-500 dark:bg-blue-400"></div>
                </div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-blue-500 dark:border-blue-400 transform rotate-135 -mt-1 sm:-mt-2 mb-1 sm:mb-2"></div>
                
                {/* Kernel Layer */}
                <div className="w-full max-w-3xl bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 sm:p-4 border-2 border-blue-300 dark:border-blue-700 mb-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <h4 className="text-center font-bold text-blue-800 dark:text-blue-300 mb-2 text-sm sm:text-base">Kernel</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2 text-center">
                    <div className="bg-blue-100 dark:bg-blue-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-blue-200 dark:hover:bg-blue-700/60">Process Management</div>
                    <div className="bg-blue-100 dark:bg-blue-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-blue-200 dark:hover:bg-blue-700/60">Memory Management</div>
                    <div className="bg-blue-100 dark:bg-blue-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-blue-200 dark:hover:bg-blue-700/60">File Systems</div>
                    <div className="bg-blue-100 dark:bg-blue-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-blue-200 dark:hover:bg-blue-700/60">Device Drivers</div>
                    <div className="bg-blue-100 dark:bg-blue-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-blue-200 dark:hover:bg-blue-700/60">Networking Stack</div>
                  </div>
                </div>
                
                {/* Data flow arrow */}
                <div className="h-4 sm:h-6 w-8 flex justify-center">
                  <div className="w-0.5 h-full bg-green-500 dark:bg-green-400"></div>
                </div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-green-500 dark:border-green-400 transform rotate-135 -mt-1 sm:-mt-2 mb-1 sm:mb-2"></div>
                
                {/* System Services Layer */}
                <div className="w-full max-w-3xl bg-green-50 dark:bg-green-900/30 rounded-lg p-3 sm:p-4 border-2 border-green-300 dark:border-green-700 mb-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <h4 className="text-center font-bold text-green-800 dark:text-green-300 mb-2 text-sm sm:text-base">System Services</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 text-center">
                    <div className="bg-green-100 dark:bg-green-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-700/60">System Libraries</div>
                    <div className="bg-green-100 dark:bg-green-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-700/60">Utilities</div>
                    <div className="bg-green-100 dark:bg-green-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-700/60">Shell</div>
                    <div className="bg-green-100 dark:bg-green-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-700/60">Window System</div>
                  </div>
                </div>
                
                {/* Data flow arrow */}
                <div className="h-4 sm:h-6 w-8 flex justify-center">
                  <div className="w-0.5 h-full bg-purple-500 dark:bg-purple-400"></div>
                </div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-purple-500 dark:border-purple-400 transform rotate-135 -mt-1 sm:-mt-2 mb-1 sm:mb-2"></div>
                
                {/* Applications Layer */}
                <div className="w-full max-w-3xl bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 sm:p-4 border-2 border-purple-300 dark:border-purple-700 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <h4 className="text-center font-bold text-purple-800 dark:text-purple-300 mb-2 text-sm sm:text-base">Applications</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2 text-center">
                    <div className="bg-purple-100 dark:bg-purple-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-purple-200 dark:hover:bg-purple-700/60">Web Browsers</div>
                    <div className="bg-purple-100 dark:bg-purple-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-purple-200 dark:hover:bg-purple-700/60">Office Software</div>
                    <div className="bg-purple-100 dark:bg-purple-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-purple-200 dark:hover:bg-purple-700/60">Media Players</div>
                    <div className="bg-purple-100 dark:bg-purple-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-purple-200 dark:hover:bg-purple-700/60">Development Tools</div>
                    <div className="bg-purple-100 dark:bg-purple-800/40 p-1 sm:p-2 rounded text-xs font-medium transition-colors hover:bg-purple-200 dark:hover:bg-purple-700/60">Games</div>
                  </div>
                </div>
                
                {/* Bidirectional data flow indicators - for larger screens */}
                <div className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 flex-col items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
                    ↑ Higher<br/>Abstraction
                  </div>
                  <div className="h-16 w-8 flex justify-center">
                    <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="h-16 w-8 flex justify-center">
                    <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
                    ↓ More<br/>Control
                  </div>
                </div>
                
                <div className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 flex-col items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
                    User<br/>Mode
                  </div>
                  <div className="h-16 w-8 flex justify-center">
                    <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="h-16 w-8 flex justify-center">
                    <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700"></div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-sm">
                    Kernel<br/>Mode
                  </div>
                </div>
                
                {/* Mobile indicators - simplified for small screens */}
                <div className="flex sm:hidden justify-between w-full mt-6 text-xs text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <span className="block">User Mode ↑</span>
                    <span className="block">Kernel Mode ↓</span>
                  </div>
                  <div className="text-center">
                    <span className="block">↑ Higher Abstraction</span>
                    <span className="block">↓ More Control</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-3">Kernel (Core Layer)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">The kernel is the central component that manages system resources. It provides low-level services to the upper layers through system calls, handles hardware interrupts, schedules processes, and manages memory. It runs in a privileged mode with direct hardware access.</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-green-700 dark:text-green-400 mb-3">System Services (Middle Layer)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">System services extend the kernel's functionality and provide standard APIs for applications. This layer includes system libraries (like C library), shells, window systems, and utilities. These services translate application requests into appropriate system calls.</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg">
                <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-3">Applications (User Layer)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">Applications are programs that users interact with directly. They rely on services provided by lower layers and run with limited privileges in user mode. Examples include web browsers, office software, media players, and games.</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg">
                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">Hardware (Physical Layer)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">The hardware layer consists of physical components like CPU, memory, storage devices, and I/O peripherals. The OS provides an abstraction over this hardware, allowing applications to use resources without knowing specific hardware details.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/journey"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start the OSCanvas Journey
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* OS Evolution Timeline */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Evolution of Operating Systems</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore how operating systems have evolved from basic batch processing to modern, sophisticated systems.
            </p>
          </div>
          
          {/* Timeline component - Vertical for desktop, horizontal scrollable for mobile */}
          <div className="hidden md:block relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 dark:bg-blue-900"></div>
            
            {/* Timeline entries */}
            <div className="space-y-24 relative">
              {/* 1950s - Batch Processing */}
              <div className="flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">1950s - Batch Processing</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    The earliest computers had no operating systems. Users had direct access to the machine and programmed it using punch cards or paper tape. Later, batch processing systems were introduced to automate the loading of programs.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 z-10">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <div className="w-5/12 pl-8">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <blockquote className="italic text-gray-600 dark:text-gray-400 text-sm">
                      "Programs were submitted on punch cards and executed one after another, with no way to interrupt the computer once a job started."
                    </blockquote>
                  </div>
                </div>
              </div>
              
              {/* 1960s - Multiprogramming */}
              <div className="flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Systems like IBM's OS/360 introduced multiprogramming capabilities, allowing multiple programs to be loaded into memory at once, improving CPU utilization.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 z-10">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <div className="w-5/12 pl-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">1960s - Multiprogramming</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    The concept of multiprogramming emerged where multiple programs were loaded into memory at once. When one program waited for I/O, the CPU would execute another program, improving resource utilization.
                  </p>
                </div>
              </div>
              
              {/* 1970s - Time-sharing */}
              <div className="flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">1970s - Time-sharing Systems</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Time-sharing systems like UNIX allowed multiple users to interact with a computer simultaneously, creating the illusion that each user had the entire computer to themselves.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 z-10">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <div className="w-5/12 pl-8">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <blockquote className="italic text-gray-600 dark:text-gray-400 text-sm">
                      "UNIX revolutionized operating systems with its modular design, hierarchical file system, and ability to support multiple concurrent users."
                    </blockquote>
                  </div>
                </div>
              </div>
              
              {/* 1980s - Personal Computers */}
              <div className="flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      MS-DOS and early versions of Windows focused on making computers accessible to individuals, prioritizing user interface over multitasking capabilities.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 z-10">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <div className="w-5/12 pl-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">1980s - Personal Computers</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    The rise of personal computers led to new operating systems designed for individual users rather than shared machines. MS-DOS and the Macintosh OS pioneered user-friendly interfaces.
                  </p>
                </div>
              </div>
              
              {/* 1990s - Modern GUIs */}
              <div className="flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">1990s - Modern GUIs</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Windows 95, Mac OS, and various Linux distributions brought sophisticated graphical user interfaces to the masses, making computers more accessible while maintaining advanced features.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 z-10">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <div className="w-5/12 pl-8">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <blockquote className="italic text-gray-600 dark:text-gray-400 text-sm">
                      "The transition to widespread GUI-based operating systems revolutionized how people interacted with computers, making them accessible to non-technical users."
                    </blockquote>
                  </div>
                </div>
              </div>
              
              {/* 2000s to present */}
              <div className="flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Modern operating systems support distributed computing, cloud technologies, virtualization, and advanced security features while maintaining intuitive user interfaces.
                    </p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 z-10">
                  <span className="text-white text-lg font-bold">+</span>
                </div>
                <div className="w-5/12 pl-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">2000s to Present</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Modern operating systems like Windows 10/11, macOS, and various Linux distributions focus on security, cloud integration, and supporting multiple device form factors from desktops to mobile devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Timeline (horizontal scrolling cards) */}
          <div className="md:hidden overflow-x-auto pb-6">
            <div className="inline-flex space-x-4 min-w-max px-2 pt-6 relative">
              {/* Horizontal line */}
              <div className="absolute top-0 left-2 right-2 h-0.5 bg-blue-200 dark:bg-blue-900"></div>
              
              {/* 1950s */}
              <div className="w-72 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 -mt-3 mb-4"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1950s - Batch Processing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    The earliest computers had no operating systems. Users had direct access to the machine and programmed it using punch cards or paper tape.
                  </p>
                  <blockquote className="italic text-gray-600 dark:text-gray-400 text-xs border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                    "Programs were submitted on punch cards and executed one after another."
                  </blockquote>
                </div>
              </div>
              
              {/* 1960s */}
              <div className="w-72 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 -mt-3 mb-4"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1960s - Multiprogramming</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Multiple programs loaded into memory at once. When one program waited for I/O, the CPU would execute another program, improving resource utilization.
                  </p>
                </div>
              </div>
              
              {/* 1970s */}
              <div className="w-72 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 -mt-3 mb-4"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1970s - Time-sharing Systems</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Time-sharing systems like UNIX allowed multiple users to interact with a computer simultaneously.
                  </p>
                  <blockquote className="italic text-gray-600 dark:text-gray-400 text-xs border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                    "UNIX revolutionized operating systems with its modular design."
                  </blockquote>
                </div>
              </div>
              
              {/* 1980s */}
              <div className="w-72 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 -mt-3 mb-4"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1980s - Personal Computers</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The rise of personal computers led to new operating systems designed for individual users rather than shared machines.
                  </p>
                </div>
              </div>
              
              {/* 1990s */}
              <div className="w-72 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 -mt-3 mb-4"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1990s - Modern GUIs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Windows 95, Mac OS, and various Linux distributions brought sophisticated graphical user interfaces to the masses.
                  </p>
                </div>
              </div>
              
              {/* 2000s */}
              <div className="w-72 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-600 border-4 border-white dark:border-gray-900 -mt-3 mb-4"></div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 h-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">2000s to Present</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Modern operating systems focus on security, cloud integration, and supporting multiple device form factors from desktops to mobile devices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Master Operating Systems?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Join us in exploring the fascinating world of operating systems through an interactive storytelling experience.
          </p>
          <Link
            to="/journey"
            className="inline-flex justify-center items-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
          >
            Begin Your Adventure
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default Home; 