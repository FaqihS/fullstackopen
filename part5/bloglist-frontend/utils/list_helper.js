const _ = require("lodash");
const dummy = (blogs) => {
  return 1;
};

const isEmptyObj = (obj) => {
  for (const _ in obj) return false;
  return true
}

const isEmptyArr = (arr) => {
  return !arr[0]

}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    if (!blog) {
      return null;
    }
    return total + blog.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length < 1) {
    return null;
  }

  const favReducer = (largest, blog) => {
    const favBlog = {
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    };

    return favBlog.likes > largest.likes || isEmptyObj(largest) ? favBlog
      : largest;
  };

  return blogs.reduce(favReducer, {});
};

// const mostBlogs = (blogs) => {

//   const authorBlogs = blogs.reduce((blog, { author }) => {
//     blog[author] = blog[author] + 1 || 1;

//     return blog;
//   }, {});

//   return _.reduce(
//     authorBlogs,
//     (result, value, key) => {
//       return value > result.blogs ? { author: key, blogs: value } : result;
//     },
//     {blogs: 0}
//   );
// };
//

const mostBlogs = (blogs) => {
  const authorBlogs = blogs.reduce((result, { author }) => {
    result[author] = result[author] + 1 || 1;

    return result;
  }, {});

  let result = { blogs: 0 };

  for (const key in authorBlogs) {
    if (authorBlogs[key] > result.blogs) {
      result = {
        author: key,
        blogs: authorBlogs[key],
      };
    }
  }
  return result;
};

const mostLikes = (blogs) => {

  // Author - Likes key val
  const authorLikes = blogs.reduce((result, { author, likes }) => {
    result[author] = result[author] + likes || likes;

    return result;
  }, []);

  // Author array
  const authors = Object.keys(authorLikes);

  // finding most likes author
  return authors.reduce(
    (most, author) => {
      return authorLikes[author] > most.likes || isEmptyObj(most)
        ? {
            author: author,
            likes: authorLikes[author],
          }
        : most;
    },
    {}
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
