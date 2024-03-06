import React, { useState, useEffect } from 'react'
import './Home.css'
import { Header } from '../../Components/Header'
import { Post } from '../../Components/Post/Post'
import { UserContextProvider } from '../../Components/UserContext'

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    fetch('http://localhost:9000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
        setLoading(false); // Set loading to false when data is fetched
      })
    })
  }, []);

  if (loading) { // If loading is true, render a loading message
    return <div>Loading...</div>;
  }

  return (
    <div className="all">
      <UserContextProvider>
      <Header />

    </UserContextProvider>
      <div className="posts">
  {posts.length > 0 ? (
    posts.map(post => <Post key={post._id} {...post} />)
  ) : (
    <p>No posts available.</p>
  )}
</div>

    </div>
  )
}
