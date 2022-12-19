/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import { nFormatter } from '../../utils/formatters';
import { likePost, unlikePost } from '../../utils/api/post';

function CommentActionBar(props) {
  const { postInfo: post, userInfo } = props;
  const [heartClicked, setHeartClicked] = useState(false);
  const [postInfo, setPostInfo] = useState(() => ({
    ...post,
    like_count_str: '0',
  }));

  const ifUserLikedPost = () => post.likeInfo.filter((i) => `${i}` === `${userInfo._id}`).length;

  function fetchPostData() {
    if (!post.postUserInfo) {
      post.postUserInfo = userInfo;
    }
    setHeartClicked(ifUserLikedPost());
    post.like_count_str = nFormatter(post.likeInfo.length, 1);
    setPostInfo(post);
  }

  useEffect(() => {
    fetchPostData();
  }, [post]);

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

  return (
    <div className="d-flex justify-content-between px-4 py-2 border-top border-bottom">
      {/* <svg className="action-icon" width="28" height="28" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.08324 7.45L18.4894 4.11397C22.7105 2.61689 25.0039 5.0688 23.6079 9.56006L20.4725 19.5681C18.3675 26.2991 14.9108 26.2991 12.8058 19.5681L11.8752 16.5975L9.08324 15.6073C2.75708 13.3676 2.75708 9.70152 9.08324 7.45Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.0857 16.0908L16.052 11.8589" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg> */}
      <div className="d-flex align-items-center">
        <svg onClick={clickHeartHandler} className={`action-icon heart me-2 ${heartClicked ? 'active' : ''}`} width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation">
          <path d="M13.3679 21.6769C13.0138 21.8019 12.4304 21.8019 12.0763 21.6769C9.05542 20.6457 2.30542 16.3436 2.30542 9.05192C2.30542 5.83317 4.89917 3.229 8.09709 3.229C9.99292 3.229 11.67 4.14567 12.7221 5.56234C13.7742 4.14567 15.4617 3.229 17.3471 3.229C20.545 3.229 23.1388 5.83317 23.1388 9.05192C23.1388 16.3436 16.3888 20.6457 13.3679 21.6769Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="m-0">{postInfo.like_count_str}</p>
      </div>
    </div>
  );
}

export default CommentActionBar;
