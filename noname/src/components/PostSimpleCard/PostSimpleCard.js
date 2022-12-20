/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { React, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PostSimpleCard.css';
import Carousel from 'react-bootstrap/Carousel';
// import Placeholder from 'react-bootstrap/Placeholder';
import uuid from 'react-uuid';
import { localGet } from '../../utils/localStorage';
import { nFormatter } from '../../utils/formatters';
import { likePost, unlikePost, updatePost } from '../../utils/api/post';
import { getUserByUserId } from '../../utils/api/user';

function PostSimpleCard(props) {
  const [heartClicked, setHeartClicked] = useState(false);
  const {
    openPost,
    postInfo: post,
    userInfo,
    fetchPosts,
  } = props;
  const [postInfo, setPostInfo] = useState(() => ({
    ...post,
    like_count_str: nFormatter(post.likeInfo.length, 1),
  }));

  const ifUserLikedPost = () => post.likeInfo.filter((i) => `${i}` === `${userInfo._id}`).length;

  async function fetchPostData() {
    if (!post.postUserInfo) {
      const postUserInfo = await getUserByUserId(post.belongUserId);
      post.postUserInfo = postUserInfo.data.data;
      setHeartClicked(ifUserLikedPost());
      post.like_count_str = nFormatter(post.likeInfo.length, 1);
      setPostInfo(post);
    }
  }

  useEffect(() => {
    fetchPostData();
  }, [post]);

  const handleHideClicked = () => {
    // console.log('clicked');
    const token = localGet('token');
    const decoded = jwtDecode(token);
    const currentUserId = decoded.id;
    updatePost(postInfo._id, currentUserId);
    fetchPosts();
  };

  const clickHeartHandler = async () => {
    setHeartClicked(!heartClicked);

    if (heartClicked) {
      // Unlike the post
      const res = await unlikePost(postInfo._id, userInfo._id);
      const editedPost = res.data.response;

      // Reset the post to update the like count
      const { postUserInfo } = postInfo;

      setPostInfo({
        ...editedPost,
        postUserInfo,
        like_count_str: nFormatter(editedPost.likeInfo.length, 1),
      });
    } else {
      // Like a post
      const res = await likePost(postInfo._id, userInfo._id);
      const editedPost = res.data.response;

      // Reset the post to update the like count
      const { postUserInfo } = postInfo;
      setPostInfo({
        ...editedPost,
        postUserInfo,
        like_count_str: nFormatter(editedPost.likeInfo.length, 1),
      });
    }
  };

  if (postInfo.postUserInfo && postInfo._id) {
    return (
      <div>
        <div className="card w-100 my-3">
          <div className="">
            {/* Add link to profile page */}
            <div className="d-flex align-items-center">
              {/* avatar image */}
              <img
                className="avatar-image ms-3 my-2"
                src={postInfo.postUserInfo.profilePicture}
                alt="Avatar"
                mode="aspectFit"
              />
              {/* User name */}
              <p className="text-dark my-0 ms-2 text-justify">{ postInfo.postUserInfo.username }</p>
            </div>
            <Carousel wrap={false} interval={null}>
              {postInfo.media.map((data) => (
                // TODO: Add `key` to carousel item
                <Carousel.Item key={`${uuid()}`}>
                  <img
                    className="d-block w-100"
                    src={data.url}
                    alt="slide"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            <div className="d-flex align-items-left mx-2 my-1">
              <div className="col">
                <div className="container">
                  {postInfo.caption}
                </div>
                <div className="container" id="location">
                  {postInfo.location}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mx-3 my-2">
              {/* Add links to images */}
              <div className="d-flex justify-content-between">
                <svg className="action-icon me-2" onClick={() => openPost(postInfo)} width="28" height="28" viewBox="0 0 27 29" fill="none" xmlns="http://www.w3.org/2000/svg" title="comment_icon">
                  <path d="M9.41722 22.3971H8.86327C4.43164 22.3971 2.21582 21.2183 2.21582 15.3243V9.43026C2.21582 4.71504 4.43164 2.35742 8.86327 2.35742H17.7265C22.1582 2.35742 24.374 4.71504 24.374 9.43026V15.3243C24.374 20.0395 22.1582 22.3971 17.7265 22.3971H17.1726C16.8291 22.3971 16.4967 22.574 16.2862 22.8687L14.6244 25.2263C13.8932 26.2636 12.6966 26.2636 11.9654 25.2263L10.3035 22.8687C10.1263 22.6093 9.71636 22.3971 9.41722 22.3971Z" stroke="#292D32" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17.7227 12.9668H17.7326" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.2898 12.9668H13.2998" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8.85719 12.9668H8.86715" stroke="#292D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* <svg className="action-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.08324 7.45L18.4894 4.11397C22.7105 2.61689 25.0039 5.0688 23.6079 9.56006L20.4725 19.5681C18.3675 26.2991 14.9108 26.2991 12.8058 19.5681L11.8752 16.5975L9.08324 15.6073C2.75708 13.3676 2.75708 9.70152 9.08324 7.45Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12.0857 16.0908L16.052 11.8589" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg> */}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <button className="btn btn-link btn-sm" type="button" onClick={() => handleHideClicked()}>
                  <img src="https://nonome-project-media.s3.amazonaws.com/eye-slash.svg" width="32" height="32" alt="Hide" />
                </button>
                <svg onClick={clickHeartHandler} className={`action-icon heart me-1 ${heartClicked ? 'active' : ''}`} width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3679 21.6769C13.0138 21.8019 12.4304 21.8019 12.0763 21.6769C9.05542 20.6457 2.30542 16.3436 2.30542 9.05192C2.30542 5.83317 4.89917 3.229 8.09709 3.229C9.99292 3.229 11.67 4.14567 12.7221 5.56234C13.7742 4.14567 15.4617 3.229 17.3471 3.229C20.545 3.229 23.1388 5.83317 23.1388 9.05192C23.1388 16.3436 16.3888 20.6457 13.3679 21.6769Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-dark my-0 fw-bold">{postInfo.like_count_str}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostSimpleCard;
