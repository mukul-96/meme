// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Templates = () => {
//   const [templates, setTemplates] = useState([]);
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     axios.get('https://api.imgflip.com/get_memes').then(res => {
//       setTemplates(res.data.data.memes);
//     });

//     // Check if user is logged in (assuming it's stored in localStorage)
//     const savedUser = localStorage.getItem('user');
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-white py-12 px-6">
//       <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6 drop-shadow-md">
//         Choose a Meme Template
//       </h1>

//       {/* Top Buttons */}
//       <div className="flex justify-center gap-4 mb-10">
//         {user ? (
//           <>
//             <span className="text-purple-700 font-semibold text-lg">
//               Welcome, {user.name || user.email}
//             </span>
//             <button
//               onClick={() => navigate('/my-memes')}
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
//             >
//               View My Memes
//             </button>
//             <button
//               onClick={() => {
//                 localStorage.removeItem('user');
//                 setUser(null);
//               }}
//               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <button
//               onClick={() => navigate('/login')}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//             >
//               Sign In
//             </button>
//             <button
//               onClick={() => navigate('/register')}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               Register
//             </button>
//           </>
//         )}
//       </div>

//       {/* Meme Template Grid */}
//       <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//         {templates.map(template => (
//           <div
//             key={template.id}
//             onClick={() => navigate(`/edit/${template.id}`)}
//             className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
//             title={template.name}
//           >
//             <img
//               src={template.url}
//               alt={template.name}
//               className="w-full h-48 object-cover"
//               loading="lazy"
//             />
//             <div className="p-4">
//               <h2 className="text-lg font-semibold text-gray-800 truncate">
//                 {template.name}
//               </h2>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Templates;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch meme templates
    axios.get('https://api.imgflip.com/get_memes').then(res => {
      setTemplates(res.data.data.memes);
    });

    // Check authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Convert to boolean
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    // Optionally redirect to home or login page
    // navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-purple-50 to-white py-12 px-6">
      <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6 drop-shadow-md">
        Choose a Meme Template
      </h1>

      {/* Top Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        {isAuthenticated ? (
          <>
          
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
          </>
        )}
      </div>

      {/* Meme Template Grid */}
      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {templates.map(template => (
          <div
            key={template.id}
            onClick={() => navigate(`/edit/${template.id}`)}
            className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-transform duration-300"
            title={template.name}
          >
            <img
              src={template.url}
              alt={template.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {template.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;