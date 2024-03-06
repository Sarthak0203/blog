import React, { useContext, useEffect, useState } from "react";
import "./Post.css";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export const Post = (props) => {
  const {
    _id,
    title,
    summary,
    cover,
    content,
    createdAt,
    author,
    likes,
    dislikes,
  } = props;
  const [post, setPost] = useState({
    _id,
    title,
    summary,
    cover,
    content,
    createdAt,
    author,
    likes,
    dislikes,
  });

  const handleLike = (id) => {
    fetch(`http://localhost:9000/post/${id}/like`, {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      response.json().then((updatedPost) => {
        setPost((prevState) => ({ ...prevState, likes: updatedPost.likes }));
      });
    });
  };

  const handleDislike = (id) => {
    fetch(`http://localhost:9000/post/${id}/dislike`, {
      method: "POST",
      credentials: "include",
    }).then((response) => {
      response.json().then((updatedPost) => {
        setPost((prevState) => ({
          ...prevState,
          dislikes: updatedPost.dislikes,
        }));
      });
    });
  };

  return (
    <div className="parent">
      <div className="homebody">
        <div className="homecontainer">
          <div className="card">
            <div className="card__header">
              <Link to={`/post/${_id}`}>
                <img
                  src={"http://localhost:9000/" + cover}
                  alt="card__image"
                  className="card__image"
                />
              </Link>
            </div>
            <div className="card__content">
              <Link to={`/post/${_id}`}>
                <h4>{title}</h4>
                <p>{summary}</p>
              </Link>
              <Link to={`/post/${_id}`}>
                <div className="card__footer">
                  <div className="user">
                    <img
                      src="https://i.pravatar.cc/40?img=3"
                      alt="user__image"
                      className="user__image"
                    />
                    <div className="user__info">
                      <h5>{author ? author.username : "Loading..."}</h5>
                      <small>{formatISO9075(new Date(createdAt))}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="card__actions">
              <button
                className="likedislikebtn"
                onClick={() => handleLike(_id)}
              >
                Like {post.likes}
              </button>
              <button
                className="likedislikebtn"
                onClick={() => handleDislike(_id)}
              >
                Dislike {post.dislikes}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
