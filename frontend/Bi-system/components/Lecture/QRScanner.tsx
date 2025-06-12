import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import axios from 'axios';
import { useRouter } from 'next/router';
import { BiCheckCircle, BiErrorCircle, BiCamera, BiImage, BiInfoCircle } from 'react-icons/bi';

const QRScanner: React.FC = () => {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'info'>('idle');
  const [message, setMessage] = useState<string>('');
  const [scanMode, setScanMode] = useState<'camera' | 'file' | null>(null);
  const [scanned, setScanned] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/api/Me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.role !== 'Student') {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Ошибка при проверке роли:', error);
        router.push('/login');
      }
    };

    checkRole();
  }, [router]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Ошибка при получении устройств:', error);
        setStatus('error');
        setMessage('Не удалось получить доступ к камере');
      }
    };

    getDevices();
  }, []);

  const handleMarkAttendance = async (token: string) => {
    if (scanned) return;
    setScanned(true);

    try {
      setStatus('scanning');
      const userToken = localStorage.getItem('token');
      
      const response = await axios.post('/api/QRcode/mark', 
        { token },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setStatus('success');
      setMessage('Вы успешно отметились на лекции!');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        setScanMode(null);
        setScanned(false);
      }, 5000);
    } catch (error: any) {
      console.error('Ошибка при отметке:', error);
      
      if (error.response?.data?.message === 'Attendance has already been noted within 80 minutes') {
        setStatus('info');
        setMessage('Вы уже отметились на этой лекции в течение последних 80 минут');
      } else {
        setStatus('error');
        setMessage('Произошла ошибка при отметке. Попробуйте еще раз.');
      }
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        setScanMode(null);
        setScanned(false);
      }, 5000);
    }
  };

  const capture = useCallback(() => {
    if (!webcamRef.current || scanned) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        handleMarkAttendance(code.data);
      }
    };
  }, [scanned]);

  useEffect(() => {
    if (scanMode === 'camera' && !scanned) {
      const interval = setInterval(capture, 500);
      return () => clearInterval(interval);
    }
  }, [scanMode, scanned, capture]);

  const handleCameraClick = () => {
    setScanMode('camera');
  };

  const handleFileClick = () => {
    setScanMode('file');
  };

  const videoConstraints = {
    deviceId: selectedDevice,
    facingMode: 'environment',
    width: 1280,
    height: 720
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Сканирование QR-кода</h2>
          <p className="text-gray-600">Выберите способ сканирования QR-кода</p>
        </div>

        {!scanMode ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCameraClick}
              className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <BiCamera className="text-4xl text-indigo-600 mb-2" />
              <span className="text-indigo-600 font-medium">Использовать камеру</span>
            </button>
            <button
              onClick={handleFileClick}
              className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <BiImage className="text-4xl text-purple-600 mb-2" />
              <span className="text-purple-600 font-medium">Загрузить изображение</span>
            </button>
          </div>
        ) : scanMode === 'camera' ? (
          <div className="relative">
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
              />
            </div>
            
            {status === 'scanning' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                  const image = new Image();
                  image.src = event.target?.result as string;
                  image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;

                    ctx.drawImage(image, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                      handleMarkAttendance(code.data);
                    } else {
                      setStatus('error');
                      setMessage('Не удалось распознать QR-код в изображении');
                    }
                  };
                };
                reader.readAsDataURL(file);
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
            >
              <BiImage className="text-4xl text-purple-600 mb-2" />
              <span className="text-purple-600 font-medium">Выберите изображение</span>
            </label>
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-lg ${
            status === 'success' ? 'bg-green-100 text-green-800' : 
            status === 'error' ? 'bg-red-100 text-red-800' :
            status === 'info' ? 'bg-blue-100 text-blue-800' : ''
          }`}>
            <div className="flex items-center">
              {status === 'success' ? (
                <BiCheckCircle className="mr-2 text-xl" />
              ) : status === 'error' ? (
                <BiErrorCircle className="mr-2 text-xl" />
              ) : status === 'info' ? (
                <BiInfoCircle className="mr-2 text-xl" />
              ) : null}
              <p>{message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner; 