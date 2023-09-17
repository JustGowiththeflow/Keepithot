import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1uhoiwz31PIZXGFC2EP-VQ-ksWmN2AR0",
  authDomain: "keepithot-92bc6.firebaseapp.com",
  projectId: "keepithot-92bc6",
  storageBucket: "keepithot-92bc6.appspot.com",
  messagingSenderId: "355924487061",
  appId: "1:355924487061:web:bfdd70d8c6d65886efa49c",
  measurementId: "G-YYB4DZK90P"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

function App() {
  const [images, setImages] = useState([]);
  const [imagePair, setImagePair] = useState([]);
  const [topImages, setTopImages] = useState([]);
  
  useEffect(() => {
    const fetchImages = async () => {
      const snapshot = await db.collection('images').get();
      const imageDocs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedImages = imageDocs.sort((a, b) => b.rating - a.rating);
      const top5Images = sortedImages.slice(0, 5);
      const snapshot1 = await db.collection('images').orderBy('rating', 'desc').limit(5).get();
      const topImageDocs = snapshot1.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTopImages(topImageDocs);
      setImages(imageDocs);
      setImagePair(getRandomImagePair(imageDocs));
    };

    fetchImages();
  }, []);

  const getRandomImagePair = (imageList) => {
    const shuffledImages = [...imageList].sort(() => Math.random() - 0.5);
    return shuffledImages.slice(0, 2);
  };
  const getTop5Images = (imageList) => {
    // Sort the imageList based on rating in descending order
    const sortedImages = [...imageList].sort((a, b) => b.rating - a.rating);
  
    // Return the top 5 images
    return sortedImages.slice(0, 5);
  };
  const handleImageClick = (selectedImage) => {
    // Update the rating for the selected image
    const notselected = imagePair.map((image) =>{
      if(image.id !== selectedImage.id){
        const updatedImage = images.map((image1) => {
          if (image1.id === image.id) {
            image.rating -= 30;
            if(image.rating<=1350)
            image.rating=1400; // +50 for the selected image
          }
          return image;
        });
      }
      return image;
    })
    const updatedImages = images.map((image) => {
      if (image.id === selectedImage.id) {
        image.rating += 30;
        if(image.rating>=10000)
        image.rating=4000; // +50 for the selected image
      }
      return image;
    });

    // Update the Firestore database with the new ratings
    updatedImages.forEach((image) => {
      db.collection('images').doc(image.id).update({ rating: image.rating });
    });

    // Fetch two new random images for the next pair
    const randomImagePair = getRandomImagePair(updatedImages);
    const topImageDocs = getTop5Images(updatedImages);
    setImages(updatedImages);
    setImagePair(randomImagePair);
    setTopImages(topImageDocs);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
    <div style={{ backgroundColor: 'maroon', width: '100%', textAlign: 'center', padding: '10px 0', color: 'white' }}>
      <h1 style={{ fontSize: '50px', margin: '0' }}>KeepitHot</h1>
    </div>
    <br></br>
    <p style={{ fontSize: '30px', margin: '0' }}>Who's more HOTTER? Click to choose!</p>
    <br></br>
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      
      <div className="image-pair" style={{ display: 'flex', gap: '20px' }}>
        {imagePair.map((image) => (
          <div key={image.id} onClick={() => handleImageClick(image)} style={{ textAlign: 'center' }}>
            <img src={image.url} alt={`Image ${image.id}`} width={300} />
            <p><b>{image.name}</b></p>
            {/* <p>Rating: {image.rating}</p> */}
          </div>
        ))}
      </div>
      <div style={{ marginLeft: '80px' }}>
      <h1>Hotness Leaderboard</h1>
      {/* <h2>Top 5 Most Selected Images</h2> */}
      <ul>
        {topImages.map((image) => (
          <li key={image.id}>
            {image.name}
            // {image.name} - Selected {image.rating} times
          </li>
        ))}
      </ul>
      {/* Display the rest of your application */}
    </div>
    </div>
    <h3>We are constantly adding more and more girls BITS GOA so be patient and continue using (soon adding bits hyd and pilani)</h3>
    </div>
  );
}

export default App;
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
