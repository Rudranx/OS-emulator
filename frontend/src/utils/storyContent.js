// This file contains all the content for the OSCanvas platform
// It uses a structured format that can be easily consumed by different components

const storyContent = {
  meta: {
    title: 'OSCanvas: Painting OS concepts clearly',
    description: 'An interactive platform that brings operating system concepts to life through visualizations and simulations',
    author: 'OSCanvas Team',
  },
  
  // Main storyline sections
  sections: [
    {
      id: 'introduction',
      title: 'Introduction: The Hidden Guardian',
      shortTitle: 'Introduction',
      content: `
        <p>
          Imagine your computer as a bustling city. Applications are the residents, hardware components are the infrastructure, 
          and the operating system is the invisible government that keeps everything running smoothly. Without this silent guardian, 
          your digital city would descend into chaos.
        </p>
        
        <p>
          Welcome to <strong>OSCanvas</strong> - where we paint operating system concepts clearly. 
          Through this interactive journey, you'll discover the fascinating world of operating systems and the 
          elegant solutions they provide to complex computing problems.
        </p>
        
        <p>
          What exactly does your OS do? It's the crucial middleware that sits between your hardware and your applications. 
          It allocates resources, manages memory, schedules tasks, handles security, and much more - all while staying largely invisible to you.
          Our journey will take you through all these aspects, with interactive simulations to reinforce your understanding.
        </p>
      `,
      quote: {
        text: "An operating system is the set of basic programs and utilities that make your computer run.",
        author: "Linus Torvalds",
      },
      illustration: 'os_layers.svg',
    },
    
    {
      id: 'processes',
      title: 'Process Management: The Art of Multitasking',
      shortTitle: 'Process Management',
      content: `
        <p>
          As you read this text, your computer is simultaneously running dozens, perhaps hundreds of processes. 
          Your music player streams audio, your browser renders web pages, background services check for updates, 
          and system utilities monitor hardware - all seemingly at once.
        </p>
        
        <p>
          This multitasking magic is powered by <strong>process management</strong>, a fundamental responsibility 
          of your operating system. A process is essentially a program in execution, complete with code, data, 
          and execution state. The OS must create, schedule, and eventually terminate these processes, all while 
          maintaining the illusion that each has the computer's full attention.
        </p>
        
        <p>
          The concept of a process is central to modern operating systems. Each process has its own address space, 
          set of registers, program counter, and other resources. The OS keeps track of all these through the Process 
          Control Block (PCB), which serves as the ID card for each process in the system.
        </p>
      `,
      quote: {
        text: "The process is the central abstraction in an operating system.",
        author: "Andrew S. Tanenbaum",
      },
      illustration: 'process_states.svg',
    },
    
    {
      id: 'system_calls',
      title: 'System Calls: The Bridge Between User and Kernel',
      shortTitle: 'System Calls',
      content: `
        <p>
          Applications need to interact with hardware resources, but direct access would be chaotic and insecure. 
          This is where <strong>system calls</strong> come in - they are the controlled entry points that allow 
          user programs to request services from the kernel safely.
        </p>
        
        <p>
          System calls form the fundamental interface between an application and the operating system. When a program
          needs to read a file, allocate memory, or create a process, it uses system calls to request these services.
          The system call acts as a gateway, transitioning from user mode to kernel mode where privileged operations
          can be performed.
        </p>
        
        <p>
          Modern operating systems offer hundreds of system calls for various operations. In Unix-like systems, common 
          system calls include <code>open()</code>, <code>read()</code>, <code>write()</code>, <code>fork()</code>, 
          <code>exec()</code>, and <code>exit()</code>. Windows systems have their own set of system calls exposed through
          the Win32 API.
        </p>
      `,
      quote: {
        text: "To err is human, but to really foul things up you need a computer.",
        author: "Paul R. Ehrlich",
      },
      illustration: 'system_calls.svg',
    },
    
    {
      id: 'process_creation',
      title: 'Process Creation: Building Multitasking Systems',
      shortTitle: 'Process Creation',
      content: `
        <p>
          How do operating systems create and manage multiple processes? This is a fundamental question that leads us to 
          explore <strong>process creation</strong> mechanisms that enable everything from starting applications to 
          building complex multitasking environments.
        </p>
        
        <p>
          In Unix-like systems, processes are created using the <code>fork()</code> system call, which creates an exact copy 
          of the calling process. The new process (child) gets a copy of the parent's memory space and resources. Often, this 
          is followed by the <code>exec()</code> family of system calls to load a new program into the child process.
        </p>
        
        <p>
          Modern systems extend this concept with <strong>threads</strong> - lightweight processes that share the same 
          memory space. Threads enable true parallelism on multi-core processors, allowing different parts of the same 
          program to execute simultaneously. Understanding multi-core and multi-processor environments is essential for 
          building efficient modern software.
        </p>
      `,
      quote: {
        text: "The most effective debugging tool is still careful thought, coupled with judiciously placed print statements.",
        author: "Brian Kernighan",
      },
      illustration: 'multithreading.svg',
    },
    
    {
      id: 'memory',
      title: 'Memory Management: The Art of Space Allocation',
      shortTitle: 'Memory Management',
      content: `
        <p>
          Memory is a precious resource in your computer, and managing it efficiently is one of the most 
          challenging aspects of operating system design. From the early days of computing to modern systems, 
          memory management techniques have evolved significantly.
        </p>
        
        <p>
          At its core, <strong>memory management</strong> involves allocating and deallocating memory spaces to 
          processes, ensuring protection and isolation, and optimizing usage to accommodate as many processes as possible. 
          The OS creates the illusion of abundant memory even when physical resources are limited.
        </p>
        
        <p>
          Modern systems use <strong>virtual memory</strong>, a technique that provides an idealized abstraction of the 
          storage resources actually available. This allows each process to operate as if it has its own large, contiguous 
          memory space, while the OS handles the complex mapping to physical memory and disk storage.
        </p>
      `,
      quote: {
        text: "Memory is like an orgasm. It's a lot better if you don't have to fake it.",
        author: "Seymour Cray",
      },
      illustration: 'virtual_memory.svg',
    },
    
    {
      id: 'scheduling',
      title: 'CPU Scheduling: The Art of Time Management',
      shortTitle: 'CPU Scheduling',
      content: `
        <p>
          In a modern computer, the CPU operates at billions of cycles per second, 
          executing instructions at an astounding rate. Yet, this incredible speed 
          is a finite resource that must be carefully allocated among competing processes.
        </p>
        
        <p>
          <strong>CPU scheduling</strong> is the method by which an operating system 
          decides which process gets CPU time, when, and for how long. It's like a 
          traffic controller for computational tasks, ensuring fair access while 
          maximizing overall system performance and responsiveness.
        </p>
        
        <p>
          Different scheduling algorithms optimize for different metrics: First-Come-First-Served (FCFS) 
          is simple but can lead to the "convoy effect" where short processes wait behind long ones; 
          Shortest Job First (SJF) minimizes average waiting time but requires knowing job lengths in advance; 
          Round Robin (RR) allocates small time slices to each process in a circular fashion, providing good 
          response time for interactive systems.
        </p>
      `,
      quote: {
        text: "The difference between genius and stupidity is that genius has its limits.",
        author: "Albert Einstein",
      },
      illustration: 'scheduling_algorithms.svg',
    },
    
    {
      id: 'interrupts',
      title: 'Interrupts: Managing the Unexpected',
      shortTitle: 'Interrupts',
      content: `
        <p>
          Computers need to respond to external events - keyboard presses, mouse movements, network packets, 
          or disk operations completing. <strong>Interrupts</strong> provide the mechanism for handling these 
          events efficiently without constant polling.
        </p>
        
        <p>
          When an interrupt occurs, the CPU pauses its current execution, saves its state, and jumps to a 
          special routine called an <strong>Interrupt Service Routine (ISR)</strong> or interrupt handler. 
          After the handler completes its task, the CPU resumes its previous work exactly where it left off.
        </p>
        
        <p>
          There are several types of interrupts: hardware interrupts from devices, software interrupts generated 
          by programs, and exceptions caused by errors like division by zero or invalid memory access. Each type 
          has its own priority level and handling mechanism. <strong>Context switching</strong>, the process of 
          saving and restoring process state during task switching, is closely tied to interrupt handling.
        </p>
      `,
      quote: {
        text: "An interrupt is basically a signal that tells the processor to immediately stop what it's doing and do something else.",
        author: "Computer Architecture Principles",
      },
      illustration: 'interrupt_handling.svg',
    },
    
    {
      id: 'synchronization',
      title: 'Process Synchronization: The Art of Coordination',
      shortTitle: 'Process Synchronization',
      content: `
        <p>
          Modern operating systems are marvels of concurrency, with multiple processes and 
          threads executing simultaneously. But this parallelism introduces a fundamental 
          challenge: how to coordinate access to shared resources without creating conflicts.
        </p>
        
        <p>
          <strong>Process synchronization</strong> addresses this challenge through various 
          mechanisms that control the timing of process execution. From simple locks to 
          sophisticated condition variables, these tools help prevent race conditions, 
          deadlocks, and other concurrency hazards.
        </p>
        
        <p>
          The field of synchronization is rich with classic problems that illustrate common challenges: 
          the Producer-Consumer problem involves coordinating processes that produce and consume data at 
          different rates; the Readers-Writers problem balances multiple readers against exclusive writers; 
          and the Dining Philosophers problem demonstrates the complex interplay of resource allocation and 
          potential deadlock.
        </p>
      `,
      quote: {
        text: "The hardest bugs to find are those where your mind is so convinced that something is correct that it skips right over the error.",
        author: "Brian Kernighan",
      },
      illustration: 'synchronization.svg',
    },
    
    {
      id: 'booting',
      title: 'Booting Process: From Power On to User Interface',
      shortTitle: 'Booting Process',
      content: `
        <p>
          Have you ever wondered what happens when you press the power button on your computer? The journey from 
          a cold, powered-off state to a fully functional operating system is fascinating and complex.
        </p>
        
        <p>
          The <strong>booting process</strong> begins with the Basic Input/Output System (BIOS) or Unified Extensible 
          Firmware Interface (UEFI) performing a Power-On Self Test (POST) to verify hardware functionality. This firmware 
          then locates a bootable device and loads a small program called a bootloader.
        </p>
        
        <p>
          The bootloader, such as GRUB in Linux systems or the Windows Boot Manager, loads the operating system kernel 
          into memory. The kernel initializes core components, mounts filesystems, starts system processes, and finally 
          launches the user interface - whether a command line or graphical environment. This entire sequence involves 
          a careful orchestration of hardware and software components working together in a precisely defined order.
        </p>
      `,
      quote: {
        text: "Always design a thing by considering it in its next larger context.",
        author: "Eliel Saarinen",
      },
      illustration: 'boot_sequence.svg',
    },
    {
      id: 'deadlock',
      title: 'Deadlock: The System Standstill',
      shortTitle: 'Deadlock',
      content: `
        <p>
          In the complex world of operating systems, deadlocks represent a critical challenge where processes become permanently blocked,
          waiting for resources that will never become available. This creates a system standstill where no progress can be made.
        </p>
        
        <p>
          A deadlock occurs when four conditions are met simultaneously:
          <ul>
            <li><strong>Mutual Exclusion:</strong> Resources cannot be shared simultaneously</li>
            <li><strong>Hold and Wait:</strong> Processes hold resources while waiting for others</li>
            <li><strong>No Preemption:</strong> Resources cannot be forcibly taken from processes</li>
            <li><strong>Circular Wait:</strong> A circular chain of processes waiting for resources</li>
          </ul>
        </p>
        
        <p>
          Operating systems employ various strategies to handle deadlocks:
          <ul>
            <li><strong>Prevention:</strong> Eliminating one of the four necessary conditions</li>
            <li><strong>Avoidance:</strong> Using algorithms like the Banker's Algorithm to prevent unsafe states</li>
            <li><strong>Detection:</strong> Identifying when deadlocks occur and resolving them</li>
          </ul>
        </p>
      `,
      quote: {
        text: "A deadlock is like a traffic jam where everyone is waiting for someone else to move first.",
        author: "Operating Systems Textbook",
      },
      illustration: 'deadlock.svg',
    },
    {
      id: 'page_replacement',
      title: 'Page Replacement Simulator',
      description: 'See how different page replacement algorithms like FIFO, LRU, and Optimal work',
      topics: ['Memory Management', 'Virtual Memory'],
      componentName: 'PageReplacementSimulation',
      subSimulations: [
        {
          id: 'fifo',
          title: 'First-In-First-Out (FIFO)',
          description: 'The simplest page replacement algorithm that replaces the oldest page in memory',
          image: 'fifo.svg'
        },
        {
          id: 'lru',
          title: 'Least Recently Used (LRU)',
          description: 'Replaces the page that has not been used for the longest period of time',
          image: 'lru.svg'
        },
        {
          id: 'optimal',
          title: 'Optimal Algorithm',
          description: 'The theoretical best algorithm that replaces the page that will not be used for the longest period in the future',
          image: 'optimal.svg'
        }
      ]
    },
  ],
  
  // Concept maps to visualize relationships
  conceptMaps: {
    os_overview: {
      title: 'Operating System Components',
      nodes: [
        { id: 1, label: 'OS Kernel', color: '#3B82F6' },
        { id: 2, label: 'Process Mgmt', color: '#10B981' },
        { id: 3, label: 'Memory Mgmt', color: '#F59E0B' },
        { id: 4, label: 'File System', color: '#EF4444' },
        { id: 5, label: 'Device Drivers', color: '#8B5CF6' },
        { id: 6, label: 'Security', color: '#EC4899' },
      ],
      edges: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 1, target: 4 },
        { source: 1, target: 5 },
        { source: 1, target: 6 },
        { source: 2, target: 3, label: 'allocates' },
        { source: 3, target: 4, label: 'caches' },
        { source: 5, target: 4, label: 'accesses' },
      ],
    },
    
    process_states: {
      title: 'Process State Transitions',
      nodes: [
        { id: 1, label: 'New', color: '#10B981' },
        { id: 2, label: 'Ready', color: '#3B82F6' },
        { id: 3, label: 'Running', color: '#F59E0B' },
        { id: 4, label: 'Waiting', color: '#8B5CF6' },
        { id: 5, label: 'Terminated', color: '#EF4444' },
      ],
      edges: [
        { source: 1, target: 2, label: 'admit' },
        { source: 2, target: 3, label: 'dispatch' },
        { source: 3, target: 2, label: 'timeout' },
        { source: 3, target: 4, label: 'I/O request' },
        { source: 4, target: 2, label: 'I/O complete' },
        { source: 3, target: 5, label: 'exit' },
      ],
    },
    
    memory_hierarchy: {
      title: 'Memory Hierarchy',
      nodes: [
        { id: 1, label: 'Registers', color: '#EF4444' },
        { id: 2, label: 'Cache', color: '#F59E0B' },
        { id: 3, label: 'RAM', color: '#10B981' },
        { id: 4, label: 'SSD/HDD', color: '#3B82F6' },
        { id: 5, label: 'Network Storage', color: '#8B5CF6' },
      ],
      edges: [
        { source: 1, target: 2, label: 'faster ↔ smaller' },
        { source: 2, target: 3, label: 'faster ↔ smaller' },
        { source: 3, target: 4, label: 'faster ↔ smaller' },
        { source: 4, target: 5, label: 'faster ↔ smaller' },
      ],
    }
  },
  
  // System call examples
  systemCalls: {
    process: [
      { name: 'fork()', description: 'Creates a new process by duplicating the calling process', return: 'Process ID' },
      { name: 'exec()', description: 'Replaces the current process image with a new process image', return: 'No return on success' },
      { name: 'wait()', description: 'Waits for a child process to terminate', return: 'Process ID of terminated child' },
      { name: 'exit()', description: 'Terminates the calling process', return: 'Does not return' },
    ],
    file: [
      { name: 'open()', description: 'Opens a file or creates it if it doesn\'t exist', return: 'File descriptor' },
      { name: 'read()', description: 'Reads data from a file descriptor', return: 'Number of bytes read' },
      { name: 'write()', description: 'Writes data to a file descriptor', return: 'Number of bytes written' },
      { name: 'close()', description: 'Closes a file descriptor', return: '0 on success' },
    ],
    memory: [
      { name: 'malloc()', description: 'Allocates memory from the heap', return: 'Pointer to allocated memory' },
      { name: 'free()', description: 'Frees previously allocated memory', return: 'Void' },
      { name: 'mmap()', description: 'Maps files or devices into memory', return: 'Pointer to mapped area' },
      { name: 'brk()', description: 'Changes the location of the program break', return: '0 on success' },
    ],
  },
  
  // Simulation descriptions
  simulations: [
    {
      id: 'cpu_scheduling',
      title: 'CPU Scheduling Simulator',
      description: 'Compare different CPU scheduling algorithms like FCFS, SJF, RR, and Priority Scheduling',
      topics: ['CPU Scheduling', 'Process Management'],
      componentName: 'CPUSchedulingSimulation',
      subSimulations: [
        {
          id: 'fcfs',
          title: 'First-Come-First-Served (FCFS)',
          description: 'Explore the simplest CPU scheduling algorithm where processes are executed in order of arrival',
          image: 'fcfs.svg'
        },
        {
          id: 'sjf',
          title: 'Shortest Job First (SJF)',
          description: 'Visualize how selecting the process with the smallest execution time minimizes average waiting time',
          image: 'sjf.svg'
        },
        {
          id: 'rr',
          title: 'Round Robin (RR)',
          description: 'See how time slices are allocated to each process in a circular manner for better response time',
          image: 'rr.svg'
        },
        {
          id: 'priority',
          title: 'Priority Scheduling',
          description: 'Understand how processes with higher priority are executed first',
          image: 'priority.svg'
        }
      ]
    },
    {
      id: 'memory_management',
      title: 'Memory Allocation Simulator',
      description: 'Visualize memory allocation strategies like First-Fit, Best-Fit, and Worst-Fit',
      topics: ['Memory Management'],
      componentName: 'MemoryAllocationSimulation',
      subSimulations: [
        {
          id: 'first_fit',
          title: 'First-Fit Algorithm',
          description: 'Allocate memory to the first available space that is large enough',
          image: 'first_fit.svg'
        },
        {
          id: 'best_fit',
          title: 'Best-Fit Algorithm',
          description: 'Allocate memory to the smallest space that is large enough',
          image: 'best_fit.svg'
        },
        {
          id: 'worst_fit',
          title: 'Worst-Fit Algorithm',
          description: 'Allocate memory to the largest available space',
          image: 'worst_fit.svg'
        },
        {
          id: 'buddy_system',
          title: 'Buddy System',
          description: 'See how memory is allocated and deallocated using power-of-2 sized blocks',
          image: 'buddy.svg'
        }
      ]
    },
    {
      id: 'disk_scheduling',
      title: 'Disk Scheduling Simulator',
      description: 'Compare different disk scheduling algorithms like FCFS, SSTF, SCAN, and C-SCAN',
      topics: ['Disk Management'],
      componentName: 'DiskSchedulingSimulation',
      subSimulations: [
        {
          id: 'fcfs_disk',
          title: 'First-Come-First-Served (FCFS)',
          description: 'Process disk requests in the order they arrive',
          image: 'fcfs_disk.svg'
        },
        {
          id: 'sstf',
          title: 'Shortest Seek Time First (SSTF)',
          description: 'Select the request that requires the least head movement from the current position',
          image: 'sstf.svg'
        },
        {
          id: 'scan',
          title: 'SCAN (Elevator) Algorithm',
          description: 'The disk arm moves in one direction servicing requests until it reaches the end, then reverses',
          image: 'scan.svg'
        },
        {
          id: 'c_scan',
          title: 'Circular SCAN (C-SCAN)',
          description: 'A variant of SCAN that treats the disk as a circular list',
          image: 'c_scan.svg'
        }
      ]
    },
    {
      id: 'deadlock',
      title: 'Deadlock Detection Simulator',
      description: 'Visualize resource allocation graphs and detect potential deadlocks',
      topics: ['Deadlock', 'Process Synchronization'],
      componentName: 'DeadlockSimulation',
      subSimulations: [
        {
          id: 'detection',
          title: 'Deadlock Detection',
          description: 'Identify when a deadlock has occurred in the system',
          image: 'deadlock_detection.svg'
        },
        {
          id: 'prevention',
          title: 'Deadlock Prevention',
          description: 'Techniques to ensure that deadlocks never occur by addressing one of the four necessary conditions',
          image: 'deadlock_prevention.svg'
        },
        {
          id: 'avoidance',
          title: 'Deadlock Avoidance',
          description: 'The Banker\'s Algorithm for safe resource allocation to avoid deadlock',
          image: 'deadlock_avoidance.svg'
        }
      ]
    },
    {
      id: 'process_sync',
      title: 'Process Synchronization Simulator',
      description: 'Experience classic synchronization problems like Dining Philosophers and Producer-Consumer',
      topics: ['Process Synchronization'],
      componentName: 'SynchronizationSimulation',
      subSimulations: [
        {
          id: 'dining_philosophers',
          title: 'Dining Philosophers Problem',
          description: 'Classic synchronization problem illustrating concurrent access to limited resources',
          image: 'dining_philosophers.svg'
        },
        {
          id: 'producer_consumer',
          title: 'Producer-Consumer Problem',
          description: 'Synchronizing processes that produce and consume data at different rates',
          image: 'producer_consumer.svg'
        },
        {
          id: 'readers_writers',
          title: 'Readers-Writers Problem',
          description: 'Coordinating access to a shared resource between multiple readers and writers',
          image: 'readers_writers.svg'
        }
      ]
    },
    {
      id: 'booting_system',
      title: 'Booting System Simulator',
      description: 'Explore the boot process from BIOS/UEFI to the operating system loading sequence',
      topics: ['Booting Process', 'System Initialization'],
      componentName: 'BootingSystemSimulation',
      subSimulations: [
        {
          id: 'bios_boot',
          title: 'BIOS Boot Sequence',
          description: 'Observe the traditional BIOS boot process and POST (Power-On Self Test)',
          image: 'bios.svg'
        },
        {
          id: 'uefi_boot',
          title: 'UEFI Boot Process',
          description: 'Modern UEFI firmware initialization and secure boot features',
          image: 'uefi.svg'
        },
        {
          id: 'bootloader',
          title: 'Bootloader Operation',
          description: 'How bootloaders like GRUB load the operating system kernel',
          image: 'bootloader.svg'
        },
        {
          id: 'kernel_init',
          title: 'Kernel Initialization',
          description: 'The final steps where the OS kernel takes control and initializes system components',
          image: 'kernel_init.svg'
        }
      ]
    },
    {
      id: 'system_calls',
      title: 'System Calls Simulator',
      description: 'Understand how applications interface with the kernel through system calls',
      topics: ['System Calls', 'Kernel Interface'],
      componentName: 'SystemCallsSimulation',
      subSimulations: [
        {
          id: 'file_syscalls',
          title: 'File System Calls',
          description: 'Explore open(), read(), write(), and close() system calls for file operations',
          image: 'file_syscalls.svg'
        },
        {
          id: 'process_syscalls',
          title: 'Process Control System Calls',
          description: 'Understand fork(), exec(), wait(), and exit() for process management',
          image: 'process_syscalls.svg'
        },
        {
          id: 'memory_syscalls',
          title: 'Memory Management System Calls',
          description: 'See how mmap(), brk(), and other calls are used to manage memory',
          image: 'memory_syscalls.svg'
        },
        {
          id: 'user_kernel_transition',
          title: 'User-Kernel Mode Transition',
          description: 'Visualize the mechanisms for transitioning between user and kernel mode',
          image: 'mode_transition.svg'
        }
      ]
    },
    {
      id: 'process_creation',
      title: 'Process Creation Simulator',
      description: 'Visualize process creation, threads, and execution in multi-core and multi-processor environments',
      topics: ['Process Management', 'Threading', 'Multiprocessing'],
      componentName: 'ProcessCreationSimulation',
      subSimulations: [
        {
          id: 'process_lifecycle',
          title: 'Process Lifecycle',
          description: 'Follow a process through its various states from creation to termination',
          image: 'process_lifecycle.svg'
        },
        {
          id: 'thread_creation',
          title: 'Thread Creation and Management',
          description: 'See how threads are created and managed within a process',
          image: 'thread_creation.svg'
        },
        {
          id: 'multicore_execution',
          title: 'Multi-core Execution',
          description: 'Visualize parallel execution across multiple CPU cores',
          image: 'multicore.svg'
        },
        {
          id: 'process_hierarchy',
          title: 'Process Hierarchy',
          description: 'Understand parent-child relationships and process trees',
          image: 'process_hierarchy.svg'
        }
      ]
    },
    {
      id: 'interrupts',
      title: 'Interrupts & Context Switching',
      description: 'Explore the mechanism of interrupts, ISRs, interrupt types, and context switching between processes',
      topics: ['Interrupts', 'Context Switching', 'CPU Management'],
      componentName: 'InterruptsSimulation',
      subSimulations: [
        {
          id: 'hardware_interrupts',
          title: 'Hardware Interrupts',
          description: 'See how external devices trigger and CPU handles hardware interrupts',
          image: 'hardware_interrupts.svg'
        },
        {
          id: 'software_interrupts',
          title: 'Software Interrupts & Exceptions',
          description: 'Understand program-generated interrupts and exception handling',
          image: 'software_interrupts.svg'
        },
        {
          id: 'isr_execution',
          title: 'ISR (Interrupt Service Routine) Execution',
          description: 'The step-by-step process of handling an interrupt through its service routine',
          image: 'isr.svg'
        },
        {
          id: 'context_switching',
          title: 'Context Switching Mechanism',
          description: 'Process state saving and restoration during task switching',
          image: 'context_switch.svg'
        }
      ]
    },
  ],
};

export default storyContent; 