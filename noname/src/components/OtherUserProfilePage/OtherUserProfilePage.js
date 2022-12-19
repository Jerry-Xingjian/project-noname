/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import './OtherUserProfilePage.css';
import jwtDecode from 'jwt-decode';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { localGet } from '../../utils/localStorage';
// import NewPostPopup from '../NewPostPopup/NewPostPopup';
import PostSimpleCard from '../PostSimpleCard/PostSimpleCard';
import { getUserByUserId, getCurrentUserProfile } from '../../utils/api/user';
import { getPostsByUserId } from '../../utils/api/post';
import PostPopupView from '../PostPopupView/PostPopupView';
import { follow, unfollow } from '../../utils/api/follow';

function OtherUserProfilePage(props) {
  const { userId } = props;
  const [userProfileData, setUserProfileData] = useState({});
  const [isFollowed, setIsFollowed] = useState(false);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPostInfo, setSelectedPostInfo] = useState({});

  async function fetchProfileData() {
    const res = await getUserByUserId(userId);
    setUserProfileData(res.data.data);
  }

  async function fetchPostData() {
    const feed = await getPostsByUserId(userId);
    setPosts(feed.data.data);
  }

  async function fetchFollowStatus() {
    const token = localGet('token');
    const decoded = jwtDecode(token);
    const currentUserId = decoded.id;
    const res = await getUserByUserId(userId);
    setIsFollowed(res.data.data.followers.includes(currentUserId));
    // if (userProfileData.followers !== undefined) {
    //   userProfileData.followers.includes(currentUserId);
    // }
    // console.log(isFollowed);
  }

  useEffect(() => {
    fetchProfileData();
    fetchFollowStatus();
    fetchPostData();
  }, []);

  const openPost = (postInfo) => {
    setSelectedPostInfo(postInfo);
    setShowPostPopup(true);
  };

  const followClicked = async () => {
    const rawUserData = await getCurrentUserProfile();
    const currentUserId = rawUserData.data.data._id;

    if (!isFollowed) {
      follow(currentUserId, userId);
    } else {
      unfollow(currentUserId, userId);
    }
    setIsFollowed(!isFollowed);
  };

  return (
    <div className="container w-75">
      <div className="container position-relative w-75 p-2 mx-auto mt-5 pt-4 " id="profile-content">
        <div className="row">
          <div className="col align-self-center">
            <img src={userProfileData.profilePicture} className="rounded-circle" alt="Profile" width="200" height="200" />
          </div>
          <div className="col-8">
            <div className="container">
              <div className="row my-3">
                <div className="col">
                  <h2 className="text-left">
                    {userProfileData.username}
                  </h2>
                </div>
                <div className="col offset-md-3 mt-2">
                  <button className="btn btn-outline-primary btn-sm" type="button" id="btn-follow" onClick={followClicked}>
                    {
                      isFollowed
                        ? 'UnFollow'
                        : 'Follow'
                    }
                  </button>
                </div>
              </div>
              <div className="row my-3">

                <div className="col">
                  <h6 className="text">
                    {userProfileData.followers === undefined
                      ? 0
                      : userProfileData.followers.length}
                    &nbsp;Posts
                  </h6>
                </div>
                <div className="col">
                  <h6 className="text">
                    {userProfileData.followers === undefined
                      ? 0
                      : userProfileData.followers.length}
                    &nbsp;Follower
                  </h6>
                </div>
                <div className="col">
                  <h6 className="text">
                    {userProfileData.followings === undefined
                      ? 0
                      : userProfileData.followings.length}
                    &nbsp;Following
                  </h6>
                </div>
              </div>
              <p className="text">
                {userProfileData.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr className="divider " />
      <div className="col offset-md-5">
        <button className="btn" type="button" id="follow">
          <img src="https://nonome-project-media.s3.amazonaws.com/icons/gallery.svg" className="mx-1" alt="+" width="20" height="20" />
          POSTS
        </button>
      </div>
      <div className="container w-75 ">
        {
            posts.length > 0 ? (
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2 }}
              >
                <Masonry gutter="1.5rem">
                  {
                      posts.map((post) => (
                        <PostSimpleCard
                          key={post._id}
                          openPost={openPost}
                          postInfo={post}
                          userInfo={userProfileData}
                        />
                      ))
                    }
                </Masonry>
              </ResponsiveMasonry>
            ) : (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )
        }
      </div>
      <PostPopupView
        show={showPostPopup}
        onHide={() => setShowPostPopup(false)}
        postInfo={selectedPostInfo}
        userInfo={userProfileData}
      />
    </div>
  );
}

export default OtherUserProfilePage;
