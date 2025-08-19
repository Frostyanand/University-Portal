import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, FileText, AlertCircle, ArrowLeft, Home, Sparkles, Zap, Star, RefreshCw } from 'lucide-react';
const DEPLOY_HOOK_URL = process.env.NEXT_PUBLIC_RENDER_DEPLOY_HOOK_URL;

const AttendanceUploadApp = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [isDragOver, setIsDragOver] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [attendanceUploadTimestamp, setAttendanceUploadTimestamp] = useState(null); // NEW STATE
  const fileInputRef = useRef(null);
  const uploadAreaRef = useRef(null);

  // Mouse tracking for smooth effects
  // Ping backend status
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  const pingBackend = async () => {
    setIsPinging(true);
    try {
      const response = await fetch('https://university-portal-b2v8.onrender.com', { method: 'HEAD' });
      setIsBackendReady(response.ok);
    } catch (error) {
      console.warn("⚠ Backend might be sleeping, triggering wake-up...");

      if (DEPLOY_HOOK_URL) {
        try {
          await fetch(DEPLOY_HOOK_URL, { method: 'POST' });
          console.log("🚀 Deploy hook triggered to wake the server");
        } catch (wakeErr) {
          console.error("❌ Failed to trigger deploy hook:", wakeErr);
        }
      } else {
        console.warn("❗ No deploy hook URL found in env vars.");
      }

      setIsBackendReady(false);
    } finally {
      setIsPinging(false);
    }
  };

  // Ping once on page load
  useEffect(() => {
    pingBackend();
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setUploadStatus('idle');
      setUploadProgress(0);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const simulateUploadProgress = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve();
            return 100;
          }
          return prev + Math.random() * 12;
        });
      }, 150);
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const progressPromise = simulateUploadProgress();

      const response = await fetch('https://university-portal-b2v8.onrender.com/extract-attendance', {
        method: 'POST',
        body: formData,
      });

      await progressPromise;

      if (response.ok) {
        setUploadStatus('success');
        setAttendanceUploadTimestamp(new Date().toISOString()); // SET TIMESTAMP ON SUCCESS
        console.log('Upload successful:', await response.json());
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setIsUploading(false);
    setAttendanceUploadTimestamp(null); // RESET TIMESTAMP
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"
          style={{
            transform: translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px),
            transition: 'transform 0.6s ease-out'
          }}
        />
        <div 
          className="absolute top-1/3 right-0 w-80 h-80 bg-gradient-to-l from-indigo-100/40 to-cyan-100/40 rounded-full blur-3xl"
          style={{
            transform: translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px),
            transition: 'transform 0.8s ease-out'
          }}
        />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              className="flex items-center space-x-3 group transition-all duration-500 hover:scale-105 active:scale-95"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:rotate-3">
                  <ArrowLeft className="h-5 w-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
                </div>
                {isHovering && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl blur opacity-30 animate-pulse" />
                )}
              </div>
              <div className="group-hover:translate-x-1 transition-transform duration-300">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  University Portal
                </span>
                <p className="text-xs text-slate-500 -mt-1 group-hover:text-blue-500 transition-colors duration-300">
                  Back to Dashboard
                </p>
              </div>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-100/80 to-white/60 rounded-full border border-white/40 backdrop-blur-sm">
                <Home className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600 font-medium">Attendance Module</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100/60 mb-6">
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-700">Smart PDF Processing</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
            Upload 
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
              {' '}Attendance
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Seamlessly process your PDF attendance records with our intelligent system
          </p>
        </div>

    
        {/* Upload Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
          
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Animated Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <div className="relative p-8 md:p-12">
              {/* Upload Area */}
              <div
                ref={uploadAreaRef}
                className={`relative border-2 border-dashed rounded-2xl p-12 md:p-16 text-center transition-all duration-500 cursor-pointer group/upload ${
                  isDragOver
                    ? 'border-blue-400 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 scale-[1.02] shadow-lg'
                    : file
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-50/60 to-green-50/60'
                    : 'border-slate-300 hover:border-blue-300 hover:bg-gradient-to-br hover:from-slate-50/60 hover:to-blue-50/40 hover:scale-[1.01]'
                } ${isUploading ? 'animate-pulse' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {/* Floating Animation Wrapper */}
                <div className="space-y-8">
                  {!file ? (
                    <>
                      <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover/upload:scale-110 ${
                        isDragOver 
                          ? 'bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg animate-bounce' 
                          : 'bg-gradient-to-br from-slate-100 to-slate-200 group-hover/upload:from-blue-100 group-hover/upload:to-indigo-100'
                      }`}>
                        <Upload className={`h-10 w-10 transition-all duration-500 ${
                          isDragOver ? 'text-white rotate-12' : 'text-slate-500 group-hover/upload:text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 group-hover/upload:text-blue-700 transition-colors duration-300">
                          {isDragOver ? 'Drop it like it\'s hot! 🔥' : 'Drop your magic PDF here'}
                        </h3>
                        <p className="text-slate-500 text-lg group-hover/upload:text-slate-600 transition-colors duration-300">
                          or click anywhere to browse your files
                        </p>
                        
                        {/* Animated Pills */}
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                          <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium animate-pulse">
                            PDF Only
                          </div>
                          <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium" style={{animationDelay: '0.5s'}}>
                            Instant Processing
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-center space-x-4 animate-fadeIn">
                        <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-4 rounded-2xl shadow-lg animate-bounce">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-left space-y-1">
                          <p className="font-bold text-xl text-slate-800">{file.name}</p>
                          <p className="text-emerald-600 font-medium">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetUpload();
                        }}
                        className="text-slate-500 hover:text-red-500 transition-all duration-300 hover:scale-105 active:scale-95 font-medium"
                      >
                        ✨ Choose different file
                      </button>
                    </div>
                  )}
                </div>

                {/* Sparkle Effect */}
                {isDragOver && (
                  <div className="absolute inset-0 pointer-events-none">
                    <Star className="absolute top-4 left-4 h-4 w-4 text-blue-400 animate-ping" />
                    <Star className="absolute top-8 right-8 h-3 w-3 text-purple-400 animate-ping" style={{animationDelay: '0.5s'}} />
                    <Star className="absolute bottom-6 left-12 h-5 w-5 text-indigo-400 animate-ping" style={{animationDelay: '1s'}} />
                  </div>
                )}
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-10 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                      <span className="text-lg font-semibold text-slate-700">Processing your PDF...</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  
                  <div className="relative w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300 ease-out relative"
                      style={{ width: ${uploadProgress}% }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {/* Success State - MODIFIED WITH TIMESTAMP */}
              {uploadStatus === 'success' && (
                <div className="mt-10 p-8 bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-3xl animate-fadeIn">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <CheckCircle className="h-16 w-16 text-emerald-500 animate-bounce" />
                      <div className="absolute -inset-2 bg-emerald-400/20 rounded-full animate-ping" />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-2xl font-bold text-emerald-800">
                        🎉 Upload Successful!
                      </h4>
                      <p className="text-emerald-600 text-lg">
                        Your attendance data is being processed with care
                      </p>
                      {/* TIMESTAMP DISPLAY */}
                      {attendanceUploadTimestamp && (
                        <p className="text-slate-500 text-sm mt-3 flex items-center justify-center space-x-1">
                          <span>📅</span>
                          <span>Uploaded: {new Date(attendanceUploadTimestamp).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {uploadStatus === 'error' && (
                <div className="mt-10 p-8 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl animate-fadeIn">
                  <div className="flex items-center justify-center space-x-4">
                    <AlertCircle className="h-12 w-12 text-red-500 animate-pulse" />
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-red-800">Oops! Something went wrong</h4>
                      <p className="text-red-600">Please try again in a moment</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading || uploadStatus === 'success'}
                  className={`group relative px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                    !file || isUploading || uploadStatus === 'success'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-2xl active:scale-95'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-3">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing Magic...</span>
                      </>
                    ) : uploadStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Complete!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 group-hover:animate-pulse" />
                        <span>Process Attendance</span>
                      </>
                    )}
                  </div>
                  
                  {!(!file || isUploading || uploadStatus === 'success') && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  )}
                </button>

                {uploadStatus === 'success' && (
                  <button
                    onClick={resetUpload}
                    className="px-8 py-4 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-2xl font-semibold hover:from-slate-200 hover:to-slate-300 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    ✨ Upload Another
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Backend Status Card */}
        <div className="mt-16 flex justify-center">
          <div className="relative group max-w-sm">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-300 via-blue-300 to-purple-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
            
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex flex-col items-center space-y-4">
                {/* Server Icon Header */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Server Status</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>

                {/* Restart Button */}
                <button
                  onClick={pingBackend}
                  disabled={isPinging}
                  className={`group/btn relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
                    isPinging
                      ? 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 hover:scale-105 hover:shadow-lg active:scale-95'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className={h-4 w-4 ${isPinging ? 'animate-spin' : 'group-hover/btn:rotate-180'} transition-transform duration-500} />
                    <span>Wake Up Server</span>
                  </div>
                  
                  {!isPinging && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300" />
                  )}
                </button>

                {/* Status Indicator */}
                <div className="flex items-center space-x-2 animate-fadeIn">
                  {isPinging ? (
                    <>
                      <div className="relative">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse" />
                        <div className="absolute inset-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-30" />
                      </div>
                      <span className="text-slate-600 font-medium text-xs">Pinging server...</span>
                    </>
                  ) : isBackendReady ? (
                    <>
                      <div className="relative">
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                        <div className="absolute -inset-0.5 bg-emerald-400/20 rounded-full animate-pulse" />
                      </div>
                      <span className="text-emerald-600 font-medium text-xs">Server ready ✨</span>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <AlertCircle className="h-3 w-3 text-amber-500 animate-pulse" />
                        <div className="absolute -inset-0.5 bg-amber-400/20 rounded-full animate-pulse" />
                      </div>
                      <span className="text-amber-600 font-medium text-xs">Server sleeping 💤</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Bottom Section */}
        <div className="mt-20 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-full border border-blue-100/60 backdrop-blur-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            <span className="text-slate-600 font-medium ml-2">Powered by AI</span>
          </div>
          
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Experience the future of attendance management with intelligent processing and beautiful design
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AttendanceUploadApp;
