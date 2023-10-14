import { useState } from 'react'
import Togglable from './Togglable'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

const deleteStyle = {
  color: 'red',
}

const Blog = ({ children,blog,handleLike, handleDelete }) => {
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <div>
        <Togglable buttonLabelShow="Show" buttonLabelHide="Hide">
          <p>{blog.url}</p>
          <p>{blog.likes}</p> <button onClick={() => handleLike(blog)}>like</button> 
          <p>{blog.user?.name}</p>
          {children}
        </Togglable>
      </div>
    </div>
  )
}

export default Blog
