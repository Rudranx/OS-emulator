import React, { useState, useEffect } from 'react';
import { Power, HardDrive, Cpu, FileStack, Server, Layers, Lock } from 'lucide-react';

const OSEmulator = () => {
  const [bootStage, setBootStage] = useState('off');
  const [detailedLogs, setDetailedLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');

  // Detailed boot sequence with technical explanations
  const bootSequence = [
    {
      stage: 'Power-On Self-Test (POST)',
      description: 'BIOS/UEFI initiates hardware diagnostic checks',
      technicalDetail: 'Performing comprehensive system hardware verification:\n' +
        '- Checking CPU registers\n' +
        '- Validating memory integrity\n' +
        '- Scanning storage controllers\n' +
        '- Verifying system clock and timer functionality',
      duration: 2000,
      icon: <Cpu className="text-blue-500" />
    },
    {
      stage: 'BIOS/UEFI Initialization',
      description: 'Firmware loads and prepares system for bootloader',
      technicalDetail: 'BIOS/UEFI operations:\n' +
        '- Reading CMOS settings\n' +
        '- Configuring hardware interrupt vectors\n' +
        '- Detecting and initializing boot devices\n' +
        '- Establishing memory mapping',
      duration: 1800,
      icon: <Server className="text-green-500" />
    },
    {
      stage: 'Master Boot Record (MBR) Loading',
      description: 'Identifying and loading primary boot sector',
      technicalDetail: 'MBR Boot Process:\n' +
        '- Scanning primary storage devices\n' +
        '- Locating bootable partition signature\n' +
        '- Verifying partition table integrity\n' +
        '- Transferring control to bootloader',
      duration: 1500,
      icon: <HardDrive className="text-purple-500" />
    },
    {
      stage: 'Bootloader Execution',
      description: 'GRUB/UEFI bootloader selection',
      technicalDetail: 'Bootloader Management:\n' +
        '- Presenting boot device options\n' +
        '- Loading kernel image into memory\n' +
        '- Preparing kernel parameters\n' +
        '- Initiating kernel decompression',
      duration: 2200,
      icon: <Layers className="text-yellow-500" />
    },
    {
      stage: 'Kernel Initialization',
      description: 'Linux kernel takes system control',
      technicalDetail: 'Kernel Bootstrap Process:\n' +
        '- Setting up memory management\n' +
        '- Configuring CPU protection rings\n' +
        '- Initializing device drivers\n' +
        '- Establishing system call interfaces',
      duration: 2500,
      icon: <FileStack className="text-red-500" />
    },
    {
      stage: 'System Authentication',
      description: 'Preparing secure user environment',
      technicalDetail: 'Security Initialization:\n' +
        '- Loading PAM (Pluggable Authentication Modules)\n' +
        '- Configuring user/group permissions\n' +
        '- Initializing cryptographic services\n' +
        '- Preparing login management',
      duration: 1900,
      icon: <Lock className="text-indigo-500" />
    }
  ];

  const simulateBoot = () => {
    setBootStage('booting');
    setDetailedLogs([]);
    setProgress(0);

    bootSequence.reduce((promise, stage, index) => {
      return promise.then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            setCurrentStage(stage.stage);
            setDetailedLogs(prev => [
              ...prev, 
              { 
                title: stage.stage, 
                description: stage.description,
                technicalDetail: stage.technicalDetail
              }
            ]);
            setProgress(Math.round(((index + 1) / bootSequence.length) * 100));
            resolve();
          }, stage.duration);
        });
      });
    }, Promise.resolve()).then(() => {
      setBootStage('complete');
      setCurrentStage('Boot Complete');
    });
  };

  const handlePowerToggle = () => {
    bootStage === 'off' ? simulateBoot() : setBootStage('off');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">OS Boot Simulator</h1>
          <button 
            onClick={handlePowerToggle} 
            className={`
              transition-all duration-300 ease-in-out
              ${bootStage === 'off' 
                ? 'text-green-500 hover:text-green-400' 
                : 'text-red-500 hover:text-red-400'}
            `}
          >
            <Power size={40} />
          </button>
        </div>

        {bootStage !== 'off' && (
          <div>
            {/* Progress Indicator */}
            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Current Stage */}
            <div className="text-center text-xl text-white mb-4">
              {currentStage}
            </div>

            {/* Detailed Boot Logs */}
            <div className="bg-black text-green-400 p-4 rounded-lg max-h-96 overflow-y-auto">
              {detailedLogs.map((log, index) => (
                <div key={index} className="mb-4 border-b border-gray-700 pb-3">
                  <div className="flex items-center mb-2">
                    {bootSequence[index].icon}
                    <h3 className="ml-2 text-lg font-semibold">{log.title}</h3>
                  </div>
                  <p className="text-sm text-green-300 mb-1">{log.description}</p>
                  <pre className="text-xs text-green-200 whitespace-pre-wrap">{log.technicalDetail}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OSEmulator;
