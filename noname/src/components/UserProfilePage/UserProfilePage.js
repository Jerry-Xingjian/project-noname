/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import './UserProfilePage.css';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Alert, Container } from 'react-bootstrap';
import { getCurrentUserProfile } from '../../utils/api/user';
import { getPostsByUserId } from '../../utils/api/post';
import ProfilePostCard from '../ProfilePostCard/ProfilePostCard';
import NewPostPopup from '../NewPostPopup/NewPostPopup';
import EditPostPopup from '../EditPostPopup/EditPostPopup';
import PostPopupView from '../PostPopupView/PostPopupView';
import { authenticate } from '../../utils/auth';

function UserProfilePage(props) {
  const { userId } = props;
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [showEditPostPopup, setShowEditPostPopup] = useState(false);
  const [userProfileData, setUserProfileData] = useState({});
  const [showPostPopup, setShowPostPopup] = useState(false);
  const [selectedPostInfo, setSelectedPostInfo] = useState({});
  const [posts, setPosts] = useState([]);
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
  const callback = useRef(null);

  const firstRender = useRef(true);

  const handleEditClicked = (postInfo) => {
    setSelectedPostInfo(postInfo);
    setShowEditPostPopup(true);
    // console.log(`'edit clicked'${postId}`);
  };

  const callbackHandler = (callbackFunc) => {
    callback.current = callbackFunc;
  };

  const fetchPostData = async () => {
    const feed = await getPostsByUserId(userId, userId);
    setPosts(feed.data.data);
    if (firstRender.current) {
      firstRender.current = false;
    }
    // window.location.reload(false);
    // console.log('fetching posts');
  };

  async function fetchProfileData() {
    const rawUserData = await getCurrentUserProfile();
    setUserProfileData(rawUserData.data.data);
    // console.log(userProfileData);
  }

  useEffect(() => {
    fetchProfileData();
    fetchPostData();
  }, []);

  const openPost = (postInfo) => {
    const postUserInfo = userProfileData;
    setSelectedPostInfo({ ...postInfo, postUserInfo });
    setShowPostPopup(true);
    setTimeout(() => {
      callback.current();
    }, 1000);
  };

  let postSection;
  if (posts.length > 0) {
    postSection = (
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 750: 2 }}
      >
        <Masonry gutter="1.5rem">
          {
          posts.map((post) => (
            <ProfilePostCard
              key={post._id}
              username={userProfileData.username}
              profileImage={userProfileData.profilePicture}
              handleEditClicked={handleEditClicked}
              openPost={openPost}
              postInfo={post}
              fetchPosts={fetchPostData}
            />
          ))
          }
        </Masonry>
      </ResponsiveMasonry>
    );
  } else if (firstRender.current) {
    postSection = (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    postSection = (
      <div className="col mx-2 my-3">
        <div className="row">
          <img src="https://nonome-project-media.s3.amazonaws.com/welcome.png" alt="Welcome" />
        </div>
        <div className="row justify-content-center">
          Create your first post here!
        </div>
      </div>
    );
  }
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
                  <a className="btn btn-outline-info btn-sm" type="button" href={`/profile/${userId}/edit`}>Edit Profile</a>
                </div>
              </div>
              <div className="row my-3">

                <div className="col">
                  <h6 className="text">
                    {posts.length === undefined
                      ? 0
                      : posts.length}
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
      <div className="row">
        <div className="col offset-md-5">
          <button className="btn" type="button">
            <img src="https://nonome-project-media.s3.amazonaws.com/icons/gallery.svg" className="mx-1" alt="+" width="20" height="20" />
            POSTS
          </button>
        </div>
        <div className="col" id="tagged">
          <button className="btn" type="button">
            <img src="https://nonome-project-media.s3.amazonaws.com/icons/send-2.svg" className="mx-1" alt="+" width="20" height="20" />
            TAGGED
          </button>
        </div>
        <div className="col offset-md-1">
          <button className="btn" type="button" onClick={() => setShowNewPostPopup(true)}>
            <img src="https://nonome-project-media.s3.amazonaws.com/icons/add-square-dark.svg" className="mx-1" alt="+" width="20" height="20" />
            NEW POST
          </button>
        </div>
      </div>
      <div className="container w-75 ">
        {postSection}
      </div>
      <PostPopupView
        show={showPostPopup}
        callbackAfterShow={callbackHandler}
        onHide={() => setShowPostPopup(false)}
        postInfo={selectedPostInfo}
        userInfo={userProfileData}
      />
      <NewPostPopup
        show={showNewPostPopup}
        onHide={() => setShowNewPostPopup(false)}
        userId={`${userId}`}
        fetchPosts={fetchPostData}
      />
      <EditPostPopup
        show={showEditPostPopup}
        onHide={() => setShowEditPostPopup(false)}
        className="edit-post-popup"
        postInfo={selectedPostInfo}
        fetchPosts={fetchPostData}
      />
    </div>
  );
}

export default UserProfilePage;
