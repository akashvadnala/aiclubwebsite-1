import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { blogList } from "./config/data";
import EmptyList from "./search/EmptyList";
import { NavLink } from "react-router-dom";
import "./BlogDisplay.css";
import ProfileCard from "./profile/ProfileCard";
import Tag from "./tags/Tag";
import axios from 'axios';
import { SERVER_URL } from '../../EditableStuff/Config';

const BlogDisplay = () => {
  const params = new useParams();
  const url = params.url;
  const [blog, setBlog] = useState(null);
  const addDefaultSrc = (ev) => {
    ev.target.src =
      "https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg";
  };
  // useEffect(() => {
  //   let blog = blogList.find((blog) => blog.id === parseInt(id));
  //   if (blog) {
  //     setBlog(blog);
  //   }
  // }, [id]);

  const getBlog = async () => {
    try{
      const res = await axios.get(`${SERVER_URL}/getBlog/${url}`);
      console.log('blog',res.status);
      if(res.status===200){
        console.log('blog',res.data);
        setBlog(res.data);
      }
      else{
        console.log('No Blog Found');
      }
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    getBlog();
  },[]);

  const returnDDMMYYYY = (inp) => {
    const d = new Date(inp);
    const a = d.getDate() +
      "/" +
      String(parseInt(d.getMonth()) + 1) +
      "/" +
      d.getFullYear();
    return a;
  };

  return (
    <div className="d-flex flex-wrap justify-content-around">
      <NavLink
        rel="noreferrer"
        to="/blogs"
        className="btn btn-sm btn-dark mx-2 my-2"
        style={{ height: "2rem" }}
      >
        Go Back
      </NavLink>
      {blog ? (
        <div className="blog-wrap">
          <header>
            <h1 style={{ marginTop: "2rem" }}>{blog.title}</h1>
            <p className="blog-date">Published on {returnDDMMYYYY(blog.createdAt)}</p>
            <div className="blog-subCategory">
              {blog.tag.map((tag, i) => (
                <div key={i}>
                  <Tag label={tag} />
                </div>
              ))}
            </div>
          </header>
          <img onError={addDefaultSrc} src={blog.cover} alt="cover" />
          <p className="blog-desc">{blog.content}</p>
        </div>
      ) : (
        <EmptyList />
      )}
      {blog && (
        <ProfileCard
          authorAvatar={blog.authorAvatar}
          authorName={blog.authorName}
        />
      )}
    </div>
  );
};

export default BlogDisplay;
