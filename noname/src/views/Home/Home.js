/* eslint-disable no-underscore-dangle */
// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
// React Component
import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Navigate } from 'react-router-dom';
// Custom Component
import PostSimpleCard from '../../components/PostSimpleCard/PostSimpleCard';
import RecommendationSection from '../../components/RecommendationSection/RecommendationSection';
import PostPopupView from '../../components/PostPopupView/PostPopupView';
import setupWSConnection from '../../utils/notification';
// API and helper functions
import { getCurrentUserProfile } from '../../utils/api/user';
import { getActivityFeed } from '../../utils/api/activityFeed';
import { localGet } from '../../utils/localStorage';
import { timeAgoFormatter } from '../../utils/formatters';

function Home() {
  const token = localGet('token');
  const [authFlag, setAuthFlag] = useState(true);
  const limit = 20;
  const offset = useRef(0);
  const [modalShow, setModalShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [openedPostInfo, setOpenedPostInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const callback = useRef(null);

  async function fetchPostData() {
    if (!userInfo._id || posts.length === 0) {
      const res = await getActivityFeed();
      const rawUserData = await getCurrentUserProfile();
      setPosts(res.data.response);
      setUserInfo(rawUserData.data.data);
    }
  }

  const loadMorePosts = async () => {
    setTimeout(async () => {
      offset.current += limit;
      const rawPostData = await getActivityFeed(limit, offset.current);
      if (rawPostData.data.status === 'no more posts') {
        setHasMore(false);
      }
      const newPosts = posts.concat(rawPostData.data.response);
      setPosts(newPosts);
    }, 1000);
  };

  useEffect(() => {
    if (token === null) {
      setAuthFlag(false);
    } else {
      fetchPostData();
    }
    setupWSConnection(setNotifications);
  }, [userInfo]);

  const openPost = (postInfo) => {
    setOpenedPostInfo(postInfo);
    setModalShow(true);
    setTimeout(() => {
      callback.current();
    }, 1000);
  };

  const callbackHandler = (callbackFunc) => {
    callback.current = callbackFunc;
  };

  if (authFlag === false) {
    return <Navigate replace to="/login" />;
  }
  const closePostHandler = async () => {
    const res = await getActivityFeed();
    setPosts(res.data.response);
    setModalShow(false);
  };

  const closeNoticiation = (id) => {
    const closingNotifications = notifications.filter(
      (notification) => notification.data._id === id,
    );
    closingNotifications[0].show = false;
    const newNotifications = notifications.filter((notification) => notification.data._id !== id);
    newNotifications.push(closingNotifications[0]);
    setNotifications(newNotifications);
  };

  return (
    <div className="home">
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`position-fixed w-50 end-0 ${notifications.filter((e) => e.show).length === 0 ? 'd-none' : ''}`}
        style={{ minHeight: '240px', zIndex: 1000 }}
      >
        <ToastContainer position="top-end" className="p-3">
          {notifications.map((notification) => (
            <Toast
              key={notification.data._id}
              onClose={() => closeNoticiation(notification.data._id)}
              show={notification.show}
              delay={5000}
              autohide
            >
              <Toast.Header>
                <img
                  src={notification.sender.profilePicture}
                  className="rounded me-2"
                  style={{ width: '16px', height: '16px' }}
                  alt={`${notification.sender.username}`}
                />
                <strong className="me-auto">
                  New post from
                  {` ${notification.sender.username}`}
                </strong>
                <small className="text-muted">{timeAgoFormatter(notification.data.createdAt)}</small>
              </Toast.Header>
              <Toast.Body>{notification.data.caption}</Toast.Body>
            </Toast>
          ))}
        </ToastContainer>
      </div>
      <div className="container home-content">
        <RecommendationSection userInfo={userInfo} />
        {
          posts.length > 0 ? (
            <InfiniteScroll
              dataLength={posts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              scrollThreshold={0.9}
              loader={(
                <div className="d-flex justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            >
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
                        userInfo={userInfo}
                      />
                    ))
                  }
                </Masonry>
              </ResponsiveMasonry>
            </InfiniteScroll>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
        }
        <div className={hasMore ? 'd-flex justify-content-center d-none' : 'd-flex justify-content-center'}>
          <p className="fw-bold">-- Reach the Bottom --</p>
        </div>
      </div>
      <PostPopupView
        show={modalShow}
        callbackAfterShow={callbackHandler}
        onHide={closePostHandler}
        postInfo={openedPostInfo}
        userInfo={userInfo}
      />
    </div>
  );
}

export default Home;
