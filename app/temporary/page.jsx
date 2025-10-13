

// "use client";
// import React, { useState, useRef } from 'react';
// import { Upload, Image, Video, Loader2, Download, AlertCircle, CheckCircle } from 'lucide-react';

// const FaceSwapApp = () => {
//   const [apiKey, setApiKey] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('image');
//   const [jobId, setJobId] = useState('');
//   const [status, setStatus] = useState('');
  
//   // Image swap states
//   const [sourceImage, setSourceImage] = useState(null);
//   const [targetImage, setTargetImage] = useState(null);
//   const [sourceImageUrl, setSourceImageUrl] = useState('');
//   const [targetImageUrl, setTargetImageUrl] = useState('');
  
//   // Video swap states
//   const [sourceVideo, setSourceVideo] = useState(null);
//   const [targetVideoImage, setTargetVideoImage] = useState(null);
//   const [sourceVideoUrl, setSourceVideoUrl] = useState('');
//   const [targetVideoImageUrl, setTargetVideoImageUrl] = useState('');
  
//   const fileInputRef = useRef();
//   const videoInputRef = useRef();

//   // Convert file to base64 or upload and get URL
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Image Face Swap API call
//   const performImageFaceSwap = async () => {
//     setLoading(true);
//     setError('');
//     setResult(null);

//     try {
//       const sourceUrl = sourceImageUrl || (sourceImage ? await fileToBase64(sourceImage) : '');
//       const targetUrl = targetImageUrl || (targetImage ? await fileToBase64(targetImage) : '');

//       if (!sourceUrl || !targetUrl) {
//         throw new Error('Please provide both source and target images');
//       }

//       const response = await fetch('https://api.market/api/magicapi/faceswap', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${apiKey}`,
//           'X-API-Key': apiKey
//         },
//         body: JSON.stringify({
//           source_image: sourceUrl,
//           target_image: targetUrl,
//           source_face_index: 0,
//           target_face_index: 0
//         })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       setResult(data);
//       setStatus('completed');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Video Face Swap API call
//   const performVideoFaceSwap = async () => {
//     setLoading(true);
//     setError('');
//     setResult(null);
//     setStatus('processing');

//     try {
//       const videoUrl = sourceVideoUrl || (sourceVideo ? await fileToBase64(sourceVideo) : '');
//       const imageUrl = targetVideoImageUrl || (targetVideoImage ? await fileToBase64(targetVideoImage) : '');

//       if (!videoUrl || !imageUrl) {
//         throw new Error('Please provide both source video and target face image');
//       }

//       const response = await fetch('https://api.market/api/magicapi/faceswap-v2', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${apiKey}`,
//           'X-API-Key': apiKey
//         },
//         body: JSON.stringify({
//           source_video: videoUrl,
//           target_face: imageUrl,
//           face_index: 0,
//           quality: 'high'
//         })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       // If API returns a job ID, poll for results
//       if (data.job_id) {
//         setJobId(data.job_id);
//         pollVideoResult(data.job_id);
//       } else {
//         setResult(data);
//         setStatus('completed');
//       }
//     } catch (err) {
//       setError(err.message);
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Poll for video processing results
//   const pollVideoResult = async (id) => {
//     const maxAttempts = 60; // 5 minutes with 5-second intervals
//     let attempts = 0;

//     const poll = async () => {
//       try {
//         const response = await fetch(`https://api.market/api/magicapi/faceswap-v2/status/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${apiKey}`,
//             'X-API-Key': apiKey
//           }
//         });

//         const data = await response.json();
        
//         if (data.status === 'completed') {
//           setResult(data);
//           setStatus('completed');
//           return;
//         } else if (data.status === 'failed') {
//           setError('Video processing failed');
//           setStatus('error');
//           return;
//         }

//         attempts++;
//         if (attempts < maxAttempts) {
//           setTimeout(poll, 5000); // Poll every 5 seconds
//         } else {
//           setError('Processing timeout');
//           setStatus('error');
//         }
//       } catch (err) {
//         setError('Error checking status: ' + err.message);
//         setStatus('error');
//       }
//     };

//     poll();
//   };

//   const handleFileSelect = (type, file) => {
//     if (activeTab === 'image') {
//       if (type === 'source') setSourceImage(file);
//       if (type === 'target') setTargetImage(file);
//     } else {
//       if (type === 'video') setSourceVideo(file);
//       if (type === 'image') setTargetVideoImage(file);
//     }
//   };

//   const downloadResult = () => {
//     if (result?.output_url || result?.result_image) {
//       const url = result.output_url || result.result_image;
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `faceswap_result.${activeTab === 'image' ? 'jpg' : 'mp4'}`;
//       link.click();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
//             <Image className="w-10 h-10" />
//             AI Face Swap Studio
//           </h1>
//           <p className="text-blue-200 text-lg">
//             Swap faces in images and videos using advanced AI technology
//           </p>
//         </div>

//         {/* API Key Input */}
//         <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
//           <label className="block text-white font-medium mb-2">API Key</label>
//           <input
//             type="password"
//             value={apiKey}
//             onChange={(e) => setApiKey(e.target.value)}
//             placeholder="Enter your API Market key"
//             className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//           />
//         </div>

//         {/* Tab Selector */}
//         <div className="flex space-x-1 bg-white/10 p-1 rounded-lg mb-6">
//           <button
//             onClick={() => setActiveTab('image')}
//             className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
//               activeTab === 'image'
//                 ? 'bg-blue-600 text-white shadow-lg'
//                 : 'text-white/70 hover:text-white hover:bg-white/10'
//             }`}
//           >
//             <Image className="w-5 h-5 inline mr-2" />
//             Image Swap
//           </button>
//           <button
//             onClick={() => setActiveTab('video')}
//             className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
//               activeTab === 'video'
//                 ? 'bg-blue-600 text-white shadow-lg'
//                 : 'text-white/70 hover:text-white hover:bg-white/10'
//             }`}
//           >
//             <Video className="w-5 h-5 inline mr-2" />
//             Video Swap
//           </button>
//         </div>

//         {/* Image Swap Interface */}
//         {activeTab === 'image' && (
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             {/* Source Image */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Upload className="w-5 h-5" />
//                 Source Image (Face to Extract)
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={sourceImageUrl}
//                   onChange={(e) => setSourceImageUrl(e.target.value)}
//                   placeholder="Enter image URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileSelect('source', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {sourceImage && (
//                   <p className="text-green-400 text-sm">✓ {sourceImage.name}</p>
//                 )}
//               </div>
//             </div>

//             {/* Target Image */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Upload className="w-5 h-5" />
//                 Target Image (Body/Background)
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={targetImageUrl}
//                   onChange={(e) => setTargetImageUrl(e.target.value)}
//                   placeholder="Enter image URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileSelect('target', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {targetImage && (
//                   <p className="text-green-400 text-sm">✓ {targetImage.name}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Video Swap Interface */}
//         {activeTab === 'video' && (
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             {/* Source Video */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Video className="w-5 h-5" />
//                 Source Video
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={sourceVideoUrl}
//                   onChange={(e) => setSourceVideoUrl(e.target.value)}
//                   placeholder="Enter video URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="video/*"
//                   onChange={(e) => handleFileSelect('video', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {sourceVideo && (
//                   <p className="text-green-400 text-sm">✓ {sourceVideo.name}</p>
//                 )}
//               </div>
//             </div>

//             {/* Target Face Image */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Image className="w-5 h-5" />
//                 Target Face Image
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={targetVideoImageUrl}
//                   onChange={(e) => setTargetVideoImageUrl(e.target.value)}
//                   placeholder="Enter image URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileSelect('image', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {targetVideoImage && (
//                   <p className="text-green-400 text-sm">✓ {targetVideoImage.name}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Process Button */}
//         <div className="text-center mb-6">
//           <button
//             onClick={activeTab === 'image' ? performImageFaceSwap : performVideoFaceSwap}
//             disabled={loading || !apiKey}
//             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Swap ${activeTab === 'image' ? 'Image' : 'Video'} Faces`
//             )}
//           </button>
//         </div>

//         {/* Status Display */}
//         {status && (
//           <div className={`text-center mb-6 p-4 rounded-lg ${
//             status === 'completed' ? 'bg-green-500/20 text-green-400' :
//             status === 'error' ? 'bg-red-500/20 text-red-400' :
//             'bg-yellow-500/20 text-yellow-400'
//           }`}>
//             {status === 'processing' && (
//               <div className="flex items-center justify-center gap-2">
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Processing video... This may take several minutes.
//                 {jobId && <span className="text-sm">Job ID: {jobId}</span>}
//               </div>
//             )}
//             {status === 'completed' && (
//               <div className="flex items-center justify-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 Face swap completed successfully!
//               </div>
//             )}
//             {status === 'error' && (
//               <div className="flex items-center justify-center gap-2">
//                 <AlertCircle className="w-5 h-5" />
//                 Processing failed
//               </div>
//             )}
//           </div>
//         )}

//         {/* Error Display */}
//         {error && (
//           <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6">
//             <div className="flex items-center gap-2">
//               <AlertCircle className="w-5 h-5" />
//               <div>
//                 <strong>Error:</strong> {error}
//                 {error.includes('CORS') || error.includes('404') ? (
//                   <div className="mt-2 text-sm">
//                     <p>⚠️ <strong>CORS Issue Detected:</strong> This API may need to be called from a backend server due to browser security restrictions.</p>
//                     <p>Consider using a proxy server or implementing this in your backend instead of directly in the browser.</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Result Display */}
//         {result && (
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-white font-semibold text-xl">Result</h3>
//               {(result.output_url || result.result_image) && (
//                 <button
//                   onClick={downloadResult}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                 >
//                   <Download className="w-4 h-4" />
//                   Download
//                 </button>
//               )}
//             </div>

//             {activeTab === 'image' && result.result_image && (
//               <div className="text-center">
//                 <img
//                   src={result.result_image}
//                   alt="Face swap result"
//                   className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
//                 />
//               </div>
//             )}

//             {activeTab === 'video' && result.output_url && (
//               <div className="text-center">
//                 <video
//                   src={result.output_url}
//                   controls
//                   className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
//                 />
//               </div>
//             )}

//             {/* Processing Info */}
//             {result.processing_time && (
//               <div className="mt-4 text-white/70 text-sm text-center">
//                 Processing completed in {result.processing_time} seconds
//               </div>
//             )}
//           </div>
//         )}

//         {/* Instructions */}
//         <div className="mt-8 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
//           <h3 className="text-white font-semibold mb-4">How to Use</h3>
//           <div className="text-white/70 space-y-2">
//             <p><strong>Image Swap:</strong> Upload or provide URLs for a source image (face to extract) and target image (body/background to place the face on).</p>
//             <p><strong>Video Swap:</strong> Upload or provide URLs for a source video and a target face image. The face from the image will replace faces in the video.</p>
//             <p><strong>API Key:</strong> Get your API key from API.Market after subscribing to the MagicAPI Face Swap service.</p>
//             <p><strong>Content Policy:</strong> The API automatically filters NSFW content and will reject inappropriate images.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceSwapApp;