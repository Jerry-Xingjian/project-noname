/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-underscore-dangle */
import React, { useRef, useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import './NewComment.css';
import data from '../../utils/api/index';
import { addComment } from '../../utils/api/comment';

function NewComment(props) {
  const [comment, setComment] = useState('');
  const commentObj = useRef({});
  const {
    userInfo,
    postInfo,
    setCommentsState,
    showAlert,
  } = props;

  // Async function to query user from database
  // Should limit the number of users returned to 5
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

  // Set the comment content value with mention whne comment change
  const handleCommentChange = async (e, _, newPlainTextValue, mentions) => {
    // Handle the changes in the textArea
    setComment(e.target.value);
    commentObj.current = {
      plainTextValue: newPlainTextValue,
      mentions,
    };
  };

  // Post new comment
  const handleNewComment = async (event) => {
    event.preventDefault();
    // Alert if the comment is empty
    if (comment === '' || comment.trim() === '') {
      showAlert('Comment content cannot be empty, please write a comment. ✍️');
      return;
    }
    // Clear comment box
    setComment('');
    // Init new comment object
    const postData = {
      belongPostId: postInfo._id,
      belongUserId: userInfo._id,
      content: commentObj.current,
    };

    // Make API call to add comment, then update comments state
    const res = await addComment(postData);
    let newComments = res.data.response.comments;
    // Sort the comments by createdAt
    newComments = newComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setCommentsState(newComments);
  };

  // Function for a customeized mention dropdown list
  const renderSuggestion = (entry) => (
    <div className="d-flex px-1 py-1 mx-1 my-1 align-items-center mention-suggestion rounded">
      <img className="avatar-image me-3" src={entry.profilePicture} alt="Avatar" />
      <span>{entry.username}</span>
    </div>
  );

  return (
    <div className="new-comment-bar px-4 py-2 d-flex align-items-center">
      <img className="avatar-image me-3" src={userInfo.profilePicture} alt="Avatar" />
      <form className="d-flex form-width justify-content-between w-100" onSubmit={handleNewComment}>
        <MentionsInput
          id="floatingTextarea"
          className="commentInput w-100"
          data-testid="comment-textarea"
          name="comment"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Leave a comment here"
        >
          <Mention
            trigger="@"
            // data={users}
            data={fetchUsers}
            renderSuggestion={renderSuggestion}
            className="mentionText"
          />
        </MentionsInput>
        <button data-testid="new-comment-post" type="submit" className="btn btn-link text-decoration-none">Post</button>
      </form>
    </div>
  );
}

export default NewComment;
