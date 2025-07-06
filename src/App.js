import React, { useState, useEffect } from 'react';
import './App.css';

const MiniBusinessDashboard = () => {
  // Sample data for different businesses
  const sampleBusinesses = [
    {
      name: "Cake & Co",
      location: "Mumbai",
      rating: 4.7,
      reviews: 328,
      headlines: [
        "Why Cake & Co is Mumbai's Sweetest Spot in 2025",
        "Cake & Co: Mumbai's Premier Bakery Experience",
        "Discover the Magic of Cake & Co in Mumbai",
        "Mumbai's Favorite Cake Destination: Cake & Co",
        "Cake & Co - Redefining Bakery Excellence in Mumbai"
      ]
    },
    {
      name: "Pizza Heaven",
      location: "Delhi",
      rating: 4.3,
      reviews: 512,
      headlines: [
        "Pizza Heaven: Delhi's Top Pizza Destination",
        "Why Pizza Heaven Dominates Delhi's Food Scene",
        "The Secret Behind Pizza Heaven's Delhi Success",
        "Delhi's Pizza Lovers Flock to Pizza Heaven",
        "Pizza Heaven - A Slice of Perfection in Delhi"
      ]
    },
    {
      name: "Bean There",
      location: "Bangalore",
      rating: 4.8,
      reviews: 276,
      headlines: [
        "Bean There: Bangalore's Coffee Revolution",
        "Why Bean There is Bangalore's Best Coffee Shop",
        "The Art of Coffee at Bean There, Bangalore",
        "Bangalore's Coffee Connoisseurs Choose Bean There",
        "Bean There - Where Bangalore Gets Its Caffeine Fix"
      ]
    },
    {
      name: "Burger Junction",
      location: "Hyderabad",
      rating: 4.2,
      reviews: 419,
      headlines: [
        "Burger Junction: Hyderabad's Burger Master",
        "Hyderabad's Best Burgers at Burger Junction",
        "The Ultimate Burger Experience in Hyderabad",
        "Why Burger Junction Tops Hyderabad's Fast Food",
        "Burger Junction - Hyderabad's Favorite Bite"
      ]
    },
    {
      name: "Spice Trail",
      location: "Chennai",
      rating: 4.6,
      reviews: 387,
      headlines: [
        "Spice Trail: Chennai's Authentic Flavors",
        "Chennai's Culinary Journey at Spice Trail",
        "Why Spice Trail is Chennai's Top Restaurant",
        "The Secret Spices of Chennai's Spice Trail",
        "Spice Trail - Where Chennai's Food Culture Thrives"
      ]
    }
  ];

  // State management
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalSearches: 0,
    averageRating: 0,
    highestRated: null
  });

  // Generate random business data for demo purposes
  const generateRandomBusiness = (name, location) => {
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const reviews = Math.floor(Math.random() * 450) + 50;
    const headlines = [
      `Why ${name} is ${location}'s Top Choice in 2025`,
      `Discover ${location}'s Best Kept Secret: ${name}`,
      `${name}: Redefining Excellence in ${location}`,
      `The Ultimate Guide to ${name} in ${location}`,
      `${name} - ${location}'s Favorite Destination This Year`,
      `How ${name} is Changing the Game in ${location}`,
      `${location}'s Hidden Gem: The Story of ${name}`,
      `10 Reasons Why ${name} Stands Out in ${location}`,
      `${name}: A Must-Visit Spot in ${location} This Season`,
      `The Rise of ${name} in ${location}'s Competitive Market`
    ];
    
    return {
      name,
      location,
      rating: parseFloat(rating),
      reviews,
      headlines
    };
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Find business in sample data or generate random
  const findBusinessData = (name, location) => {
    // Try to find exact match first
    const exactMatch = sampleBusinesses.find(
      biz => biz.name.toLowerCase() === name.toLowerCase() && 
             biz.location.toLowerCase() === location.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Try to find partial match
    const partialMatch = sampleBusinesses.find(
      biz => biz.name.toLowerCase().includes(name.toLowerCase()) || 
             biz.location.toLowerCase().includes(location.toLowerCase())
    );
    
    if (partialMatch) return partialMatch;
    
    // If no match, generate random data
    return generateRandomBusiness(name, location);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.location) {
      setError('Both business name and location are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      const data = findBusinessData(formData.name, formData.location);
      setBusinessData(data);
      setCurrentHeadlineIndex(0);
      
      // Update recent searches
      const newSearch = `${formData.name}, ${formData.location}`;
      setRecentSearches(prev => {
        const updated = [newSearch, ...prev.filter(s => s !== newSearch)].slice(0, 5);
        return updated;
      });
      
      // Update stats
      setStats(prev => {
        const newTotal = prev.totalSearches + 1;
        const newAvg = ((prev.averageRating * prev.totalSearches) + data.rating) / newTotal;
        
        let newHighest = prev.highestRated;
        if (!newHighest || data.rating > newHighest.rating) {
          newHighest = { name: data.name, rating: data.rating };
        }
        
        return {
          totalSearches: newTotal,
          averageRating: parseFloat(newAvg.toFixed(2)),
          highestRated: newHighest
        };
      });
      
      setLoading(false);
    }, 800);
  };

  // Regenerate headline
  const regenerateHeadline = () => {
    if (!businessData) return;
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * businessData.headlines.length);
      } while (newIndex === currentHeadlineIndex && businessData.headlines.length > 1);
      
      setCurrentHeadlineIndex(newIndex);
      setLoading(false);
    }, 600);
  };

  // Load sample data on initial render
  useEffect(() => {
    // Initialize with a sample business
    const initialData = sampleBusinesses[0];
    setBusinessData(initialData);
    setStats({
      totalSearches: 1,
      averageRating: initialData.rating,
      highestRated: { name: initialData.name, rating: initialData.rating }
    });
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Business Insights Dashboard
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and Recent Searches */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Form */}
            <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 ${darkMode ? 'border-gray-700' : 'border-b border-gray-200'}`}>
                <h2 className="text-xl font-semibold mb-4">Search Business</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      placeholder="e.g., Cake & Co"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`}
                      placeholder="e.g., Mumbai"
                    />
                  </div>
                  
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${darkMode ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white'}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Searching...
                      </span>
                    ) : 'Get Business Insights'}
                  </button>
                </form>
              </div>
              
              {/* Recent Searches */}
              <div className={`p-6 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Recent Searches</h3>
                  <button 
                    onClick={() => setShowRecentSearches(!showRecentSearches)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showRecentSearches ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showRecentSearches && (
                  <ul className="space-y-2">
                    {recentSearches.length > 0 ? (
                      recentSearches.map((search, index) => (
                        <li key={index}>
                          <button
                            onClick={() => {
                              const [name, location] = search.split(', ');
                              setFormData({ name, location });
                              handleSubmit({ preventDefault: () => {} });
                            }}
                            className={`text-sm p-2 rounded-md w-full text-left hover:bg-opacity-20 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                          >
                            {search}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className={`text-sm p-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No recent searches
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Stats Card */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-medium mb-4">Dashboard Statistics</h3>
              <div className="space-y-4">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Searches</p>
                  <p className="text-2xl font-bold">{stats.totalSearches}</p>
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Rating</p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-2">{stats.averageRating.toFixed(1)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(stats.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                {stats.highestRated && (
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Highest Rated</p>
                    <p className="font-medium">{stats.highestRated.name}</p>
                    <div className="flex items-center">
                      <span className="mr-2">{stats.highestRated.rating.toFixed(1)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(stats.highestRated.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Business Data */}
          <div className="lg:col-span-2">
            {businessData ? (
              <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {/* Business Header */}
                <div className={`p-6 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{businessData.name}</h2>
                      <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {businessData.location}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">{businessData.rating.toFixed(1)}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-6 h-6 ${i < Math.floor(businessData.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                      <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>Google Rating</p>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold mr-2">{businessData.rating.toFixed(1)}</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>/ 5.0</span>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                      <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-green-800'}`}>Total Reviews</p>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold mr-2">{businessData.reviews}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                      <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-purple-800'}`}>SEO Headlines</p>
                      <div className="flex items-center">
                        <span className="text-3xl font-bold mr-2">{businessData.headlines.length}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* SEO Headline Section */}
                  <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">SEO Content</h3>
                      <button
                        onClick={regenerateHeadline}
                        disabled={loading}
                        className={`flex items-center py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${darkMode ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white' : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white'}`}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Regenerate Headline
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className="text-lg font-medium">{businessData.headlines[currentHeadlineIndex]}</p>
                    </div>
                    
                    <div>
                      <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Other Headline Options</h4>
                      <div className="space-y-3">
                        {businessData.headlines.filter((_, i) => i !== currentHeadlineIndex).slice(0, 3).map((headline, i) => (
                          <div 
                            key={i}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-700 border border-gray-700' : 'hover:bg-gray-100 border border-gray-200'}`}
                            onClick={() => {
                              const newIndex = businessData.headlines.indexOf(headline);
                              setCurrentHeadlineIndex(newIndex);
                            }}
                          >
                            <p className="font-medium">{headline}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-lg shadow-md p-8 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium">No Business Selected</h3>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Search for a business to view its insights and SEO content
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={`py-6 px-4 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© 2023 Business Insights Dashboard. All data is simulated for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
};

export default MiniBusinessDashboard;