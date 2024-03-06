import React, { useState } from "react";
import { Header } from "../../Components/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Create.css";
import { Navigate } from "react-router-dom";
import { UserContextProvider } from "../../Components/UserContext";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
export const Create = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files,setFiles] = useState("");
  
  const [redirect, setRedirect] = useState(false);


  async function createPost(e){
    const data = new FormData();
    data.set('title',title);
    data.set('summary',summary);
    data.set('file',files[0]);
    data.set('content', content);
    e.preventDefault();
    const response = await fetch('http://localhost:9000/post',{
        method:'POST',
        body:data,
        credentials:'include'
    })
    if(response.ok){
        setRedirect(true);
    }
  }
  if(redirect){
    return <Navigate to = {'/'}/>
  }
  return (
    <>
    <UserContextProvider>
      <Header />
      <form onSubmit={createPost}>
        <input type="title" placeholder="Title" value={title} onChange={(e)=>{setTitle(e.target.value)}} />
        <input type="summary" placeholder="Summary" value={summary} onChange={(e)=>{setSummary(e.target.value)}} />
        <input type="file" onChange={(e)=>{setFiles(e.target.files)}}/>
        
        <ReactQuill
          className="quill"
          value={content}
          onChange={(value)=>{setContent(value)}}
          modules={modules}
          formats={formats}
        />
        <button className="createbtn">Create Post</button>
      </form>
      </UserContextProvider>
    </>
  );
};
