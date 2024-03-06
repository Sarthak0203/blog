import React, { useContext, useEffect, useState } from "react";
import { Header } from "../../Components/Header";
import { useParams } from "react-router-dom";
import { UserContext } from "../../Components/UserContext"; // Import UserContext
import "./PostPage.css";
import { format, formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:9000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, [id]);

  const handleLike = (id) => {
    fetch(`http://localhost:9000/post/${id}/like`, {
      method: 'POST',
      credentials: 'include',
    }).then((response) => {
      response.json().then((updatedPost) => {
        setPostInfo(prevState => ({ ...prevState, likes: updatedPost.likes }));
      });
    });
  };
  
  const handleDislike = (id) => {
    fetch(`http://localhost:9000/post/${id}/dislike`, {
      method: 'POST',
      credentials: 'include',
    }).then((response) => {
      response.json().then((updatedPost) => {
        setPostInfo(prevState => ({ ...prevState, dislikes: updatedPost.dislikes }));
      });
    });
  };
  
  
  
  
  return (
    <>
      <Header />
      <div className="postpage">
        {postInfo && <h1>{postInfo.title}</h1>}
        <time>
          {postInfo && postInfo.createdAt
            ? formatISO9075(new Date(postInfo.createdAt))
            : ""}
        </time>
        {postInfo && postInfo.author && (
          <div className="author">by {postInfo.author.username}</div>
        )}

        {userInfo &&
          postInfo &&
          postInfo.author &&
          userInfo.id === postInfo.author._id && (
            <div className="edit-row">
              <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Edit this post
              </Link>
            </div>
          )}

        <div className="img">
          {postInfo && postInfo.cover && (
            <img src={`http://localhost:9000/${postInfo.cover}`} alt="" />
          )}
        </div>
        {postInfo && postInfo.content && (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: postInfo.content }}
          />
        )}
        {postInfo && (
  <div>
    <button onClick={() => handleLike(postInfo._id)}>Like {postInfo.likes}</button>
    <button onClick={() => handleDislike(postInfo._id)}>Dislike {postInfo.dislikes}</button>
  </div>
)}
      </div>
    </>
  );
};
