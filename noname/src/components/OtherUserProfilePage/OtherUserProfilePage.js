/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import './OtherUserProfilePage.css';
import jwtDecode from 'jwt-decode';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Alert, Container } from 'react-bootstrap';
import { localGet } from '../../utils/localStorage';
// import NewPostPopup from '../NewPostPopup/NewPostPopup';
import PostSimpleCard from '../PostSimpleCard/PostSimpleCard';
import { getUserByUserId, getCurrentUserProfile } from '../../utils/api/user';
import { getPostsByUserId } from '../../utils/api/post';
import PostPopupView from '../PostPopupView/PostPopupView';
import { follow, unfollow } from '../../utils/api/follow';
import { authenticate } from '../../utils/auth';

function OtherUserProfilePage(props) {
  const { userId } = props;
  const [userProfileData, setUserProfileData] = useState({});
  const [isFollowed, setIsFollowed] = useState(false);
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedPostInfo, setSelectedPostInfo] = useState({});
  const [authFlag, setAuthFlag] = useState(true);
  const [showError, setShowError] = useState(true);

  setInterval(() => {
    if (authenticate() === false) {
      setAuthFlag(false);
    }
  }, 1000);

  // Function to hide the error message
  const hideError = () => {
    setShowError(false);
  };
  const [currentUserInfo, setCurrentUserInfo] = useState({});
  const callback = useRef(null);

  async function fetchProfileData() {
    const res = await getUserByUserId(userId);
    setUserProfileData(res.data.data);
  }

  async function fetchCurrentUser() {
    const token = localGet('token');
    const decoded = jwtDecode(token);
    const currentUserId = decoded.id;
    const currentUser = await getUserByUserId(currentUserId);
    setCurrentUserInfo(currentUser.data.data);
  }

  async function fetchPostData() {
    const token = localGet('token');
    const decoded = jwtDecode(token);
    const currentUserId = decoded.id;
    const feed = await getPostsByUserId(userId, currentUserId);
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
    fetchCurrentUser();
    fetchProfileData();
    fetchFollowStatus();
    fetchPostData();
    // console.log(currentUserInfo);
  }, []);

  const callbackHandler = (callbackFunc) => {
    callback.current = callbackFunc;
  };

  const openPost = (postInfo) => {
    setSelectedPostInfo(postInfo);
    setShowPostPopup(true);
    setTimeout(() => {
      callback.current();
    }, 1000);
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

  if (authFlag === false) {
    return (
      <Container
        className="d-flex align-items-center justify-content-center text-center min-vh-100"
      >
        {showError
        && (
        <Alert
          variant="danger"
          onClose={hideError}
          dismissible
        >
          Your session has expired. Please
          {' '}

          <Alert.Link href="/login"> login </Alert.Link>
          {' '}
          again.
        </Alert>
        )}
      </Container>
    );
  }

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
                  <button className="btn btn-outline-primary btn-sm" type="button" id="btn-follow-profile" onClick={followClicked}>
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
                          fetchPosts={() => window.location.reload()}
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
        callbackAfterShow={callbackHandler}
        onHide={() => setShowPostPopup(false)}
        postInfo={selectedPostInfo}
        userInfo={currentUserInfo}
      />
    </div>
  );
}

export default OtherUserProfilePage;
