import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAIl5Q7dBSg8W-G7QP1Ig1Z0BFDScc2FME",
  authDomain: "justkeepwithit.firebaseapp.com",
  projectId: "justkeepwithit",
  storageBucket: "justkeepwithit.appspot.com",
  messagingSenderId: "1037600894931",
  appId: "1:1037600894931:web:97a36dfe3c335c6da60926",
  measurementId: "G-ZSBZ98W4M2"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const importAll = (r) => {
  return r.keys().map((item) => ({
    id: item.replace('./', '').replace(/\..*$/, ''), // Create an ID based on the file name
    url: r(item), // Get the URL of the image
  }));
};

// Load all images from the Keepithot folder
const imagesArray = importAll(require.context('./Keepithot', false, /\.(png|jpe?g|svg)$/));

function App() {
  const [imagePair, setImagePair] = useState([]);

  useEffect(() => {
    // Initially set the image pair when the component mounts
    const randomImagePair = getRandomImagePair(imagesArray);
    setImagePair(randomImagePair);
  }, []);

  const getRandomImagePair2 = (imageList) => {
    const shuffledImages = [...imageList].sort(() => Math.random() - 0.5);
    return shuffledImages.slice(0, 2); // Get two random images
  };

  const handleImageClick2 = () => {
    // Get a new random image pair when any image is clicked
    const randomImagePair = getRandomImagePair(imagesArray);
    setImagePair(randomImagePair);
  };
  const [images, setImages] = useState([]);
  // const [imagePair, setImagePair] = useState([]);
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
          <div key={image.id} onClick={handleImageClick2} style={{ textAlign: 'center' }}>
            <img src={image.url} alt={`Image ${image.id}`} width={500} />
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
