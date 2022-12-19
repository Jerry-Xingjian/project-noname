/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
// External Components
import React, { useState, useEffect, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
// CSS
import './PostPopupView.css';
// External Libraries
import uuid from 'react-uuid';
// Internal Components and Functions
import Comment from '../Comment/Comment';
import CommentActionBar from '../Comment/CommentActionBar';
import NewComment from '../Comment/NewComment';
import { getCommentsByPostId } from '../../utils/api/comment';

function PostPopupView(props) {
  const {
    show, onHide, postInfo, userInfo, callbackAfterShow,
  } = props;
  const [comments, setComments] = useState([]);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '' });
  const [confirmInfo, setConfirmInfo] = useState({
    show: false,
    title: 'Modal Header',
    message: '',
    cancelBtn: {
      text: 'Cancel',
      variant: 'secondary',
    },
    confirmBtn: {
      text: 'Confirm',
      variant: 'primary',
    },
  });
  const callback = useRef(null);
  const preComments = useRef([]);
  const timer = useRef(null);

  const ifEqualComments = (a, b) => {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i += 1) {
      if (a[i]._id !== b[i]._id || a[i].updateAt !== b[i].updateAt) {
        return false;
      }
    }
    return true;
  };

  async function fetchCommentData() {
    const res = await getCommentsByPostId(postInfo._id);
    // `res.data.response` return an array of comments
    const commentsList = res.data.response;
    commentsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (!ifEqualComments(commentsList, preComments.current)) {
      setComments(commentsList);
      preComments.current = commentsList;
    }
  }

  const showAlertHandler = (message) => {
    setAlertInfo({
      show: true,
      message,
    });
  };

  const showConfirmHandler = (info, callbackfunc) => {
    setConfirmInfo({ ...info });
    callback.current = callbackfunc;
  };

  const handleConfirmClose = () => {
    confirmInfo.show = false;
    setConfirmInfo({ ...confirmInfo });
  };

  const handleConfirmed = () => {
    handleConfirmClose();
    callback.current();
  };

  const hideModel = () => {
    clearInterval(timer.current);
    onHide();
  };

  useEffect(() => {
    if (postInfo._id) {
      fetchCommentData();
      callbackAfterShow(() => {
        // console.log('Listen to new comments for post: ', postInfo._id, ' every 10 seconds');
        timer.current = setInterval(() => {
          fetchCommentData();
        }, 1000);
      });
    }
  }, [postInfo._id]);

  if (postInfo._id) {
    return (
      <Modal
        show={show}
        size="xl"
        dialogClassName="post-card-modal"
        aria-labelledby="contained-modal-title-vcenter"
        onExit={hideModel}
        centered
      >
        <Alert
          className="post-card-alert"
          variant="danger"
          show={alertInfo.show}
          onClose={() => setAlertInfo({ show: false, message: '' })}
          dismissible
        >
          {alertInfo.message}
        </Alert>
        <Modal className="post-card-alert" show={confirmInfo.show} onHide={handleConfirmClose}>
          <Modal.Header closeButton>
            <Modal.Title>{confirmInfo.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{confirmInfo.message}</Modal.Body>
          <Modal.Footer>
            <Button variant={confirmInfo.cancelBtn.variant} onClick={handleConfirmClose}>
              {confirmInfo.cancelBtn.text}
            </Button>
            <Button variant={confirmInfo.confirmBtn.variant} onClick={handleConfirmed}>
              {confirmInfo.confirmBtn.text}
            </Button>
          </Modal.Footer>
        </Modal>
        {
          postInfo.media ? (
            <div className="d-flex">
              <div data-testid="post-card-left" className="post-card-left">
                <Carousel wrap={false} interval={null}>
                  {postInfo.media.map((data) => (
                    <Carousel.Item key={`${uuid()}`}>
                      <img
                        className="d-block w-100"
                        src={data.url}
                        alt="slide"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
              <div data-testid="post-card-right" className="post-card-right">
                <div className="d-flex justify-content-between px-4 py-2 border-bottom">
                  <div className="py-2">
                    <h6 className="my-0">{postInfo.postUserInfo.username}</h6>
                  </div>
                  <svg title="close-popup" className="my-2" onClick={onHide} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.16992 14.8299L14.8299 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="comments mt-3 ms-4 me-4 overflow-scroll">
                  {
                    comments.length === 0 || comments[0].length === 0 ? (
                      <p className="">No Comments Yet</p>
                    ) : (
                      comments.map((comment) => (
                        <Comment
                          key={`${uuid()}`}
                          commentInfo={comment}
                          postInfo={postInfo}
                          userInfo={userInfo}
                          setCommentsState={setComments}
                          showConfirm={showConfirmHandler}
                          showAlert={showAlertHandler}
                        />
                      ))
                    )
                  }
                </div>
                <CommentActionBar data-testid="CommentActionBar" postInfo={postInfo} userInfo={userInfo} />
                <NewComment
                  userInfo={userInfo}
                  postInfo={postInfo}
                  commentsInfo={comments}
                  setCommentsState={setComments}
                  showAlert={showAlertHandler}
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )
        }
      </Modal>
    );
  }
}

export default PostPopupView;
