/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
// CSS
import './Comment.css';
// React Component
import React, { useState, useEffect, useRef } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
// Custom Component
import CommentWithMention from './CommentWithMention';
// API and helper functions
import data from '../../utils/api/index';
import { getUserByUserId } from '../../utils/api/user';
import { deleteComment, editComment } from '../../utils/api/comment';
import { timeAgoFormatter } from '../../utils/formatters';

function Comment(props) {
  const {
    commentInfo,
    postInfo,
    userInfo,
    setCommentsState,
    showConfirm,
    showAlert,
  } = props;
  const postId = postInfo._id;
  const [commentUser, setCommentUser] = useState({});
  const [commentCreated, setCommentCreated] = useState('1d');
  const [showEditInput, setShowEditInput] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [comment, setComment] = useState('');
  const commentObj = useRef({});

  useEffect(() => {
    async function getCommentUser() {
      const res = await getUserByUserId(commentInfo.belongUserId);
      setCommentUser(res.data.data);
      setCommentCreated(timeAgoFormatter(commentInfo.createdAt));
    }
    getCommentUser();
    setShowActionIcons(commentInfo.belongUserId === userInfo._id);
  }, []);

  const clickDeleteHandler = async () => {
    showConfirm(
      {
        show: true,
        title: 'Delete Comment',
        message: 'Are you sure to delete this comment?',
        confirmBtn: {
          text: 'Delete',
          variant: 'outline-secondary',
        },
        cancelBtn: {
          text: 'Cancel',
          variant: 'danger',
        },
      },
      async () => {
        const updatedPost = await deleteComment(postId, commentInfo._id);
        // Sort again after delete
        updatedPost.data.response.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCommentsState(updatedPost.data.response.comments);
      },
    );
  };

  const clickEditHandler = () => setShowEditInput(true);

  // Set the comment content value with mention whne comment change
  const handleCommentChange = async (e, _, newPlainTextValue, mentions) => {
    // Handle the changes in the textArea
    setComment(e.target.value);
    commentObj.current = {
      plainTextValue: newPlainTextValue,
      mentions,
    };
  };

  function fetchUsers(query, callback) {
    if (!query) return;
    fetch(`${data.rootTemp}/search/users?username=${query}`, {
      json: true,
    })
      .then((res) => res.json())
      // Transform the users to what react-mentions expects
      .then((res) => res.data.map((user) => ({ ...user, display: `@${user.username}`, id: user._id })))
      .then(callback);
  }

  // Function for a customeized mention dropdown list
  const renderSuggestion = (entry) => (
    <div className="d-flex px-1 py-1 mx-1 my-1 align-items-center mention-suggestion rounded">
      <img className="avatar-image me-3" src={entry.profilePicture} alt="Avatar" />
      <span>{entry.username}</span>
    </div>
  );

  const handleEditedComment = async (event) => {
    event.preventDefault();
    setShowEditInput(false);
    // Alert if the comment is empty
    if (comment === '' || comment.trim() === '') {
      showAlert('Comment content cannot be empty, please write a comment. ✍️');
      return;
    }

    // Clear comment box
    setComment('');

    // Init new comment object
    const postData = {
      belongPostId: postId,
      belongUserId: userInfo._id,
      content: commentObj.current,
    };

    // Make API call to add comment, then update comments state
    const commentId = commentInfo._id;
    const res = await editComment(postId, commentId, postData);
    const newComments = res.data.response.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setCommentsState(newComments);
  };

  return (
    <div>
      {
        showEditInput ? (
          <div className="d-flex comment mb-2 justify-content-between">
            <div className="d-flex w-100">
              <img className="avatar-image me-3" src={commentUser.profilePicture} alt={commentUser.username} />
              <div className="w-100">
                <p className="mb-1 fw-light">
                  <span className="fw-bold me-2">{commentUser.username}</span>
                </p>
                <form className="d-flex justify-content-between w-100" onSubmit={handleEditedComment}>
                  <MentionsInput
                    id="floatingTextarea"
                    className="commentInput w-100"
                    data-testid="comment-textarea"
                    name="comment"
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder={commentInfo.content.plainTextValue}
                  >
                    <Mention
                      trigger="@"
                      data={fetchUsers}
                      renderSuggestion={renderSuggestion}
                      className="mentionText"
                    />
                  </MentionsInput>
                  <button data-testid="new-comment-post" type="submit" className="btn btn-link text-decoration-none">Update</button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex comment mb-2 justify-content-between">
            <div className="d-flex">
              <img className="avatar-image me-3" src={commentUser.profilePicture} alt={commentUser.username} />
              <div>
                <p className="mb-1 fw-light">
                  <span className="fw-bold me-2">{commentUser.username}</span>
                </p>
                <CommentWithMention contentObj={commentInfo.content} />
                <p className="mb-1 text-black-50">{commentCreated}</p>
              </div>
            </div>
            <div className={showActionIcons ? 'd-flex align-items-center' : 'd-flex align-items-center d-none'}>
              {/* Edit Icon */}
              <svg onClick={clickEditHandler} className="mx-2 action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.26 3.59997L5.04997 12.29C4.73997 12.62 4.43997 13.27 4.37997 13.72L4.00997 16.96C3.87997 18.13 4.71997 18.93 5.87997 18.73L9.09997 18.18C9.54997 18.1 10.18 17.77 10.49 17.43L18.7 8.73997C20.12 7.23997 20.76 5.52997 18.55 3.43997C16.35 1.36997 14.68 2.09997 13.26 3.59997Z" stroke="#121212" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.89 5.04999C12.32 7.80999 14.56 9.91999 17.34 10.2" stroke="#121212" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 22H21" stroke="#121212" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* Delete Icon */}
              <svg onClick={clickDeleteHandler} className="mx-2 action-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14001" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.33 16.5H13.66" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 12.5H14.5" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Comment;
