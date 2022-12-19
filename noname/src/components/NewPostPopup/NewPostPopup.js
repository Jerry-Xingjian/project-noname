import React from 'react';
// import AWS from 'aws-sdk';
import Modal from 'react-bootstrap/Modal';
import ImageUploader from '../ImageUploader/ImageUploader';
import './NewPostPopup.css';
import { addPost } from '../../utils/api/post';
import uploadFile from '../../utils/api/aws';

function NewPostPopup(props) {
  const {
    show,
    onHide,
    userId,
    fetchPosts,
  } = props;

  let media = [];

  const onImagesUpload = (images) => {
    media = [];
    images.map((image) => (
      media.push(uploadFile(image.file))
    ));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (media.length === 0) {
      // alert('No file uploaded!');
      document.getElementById('alert-box').innerHTML = 'Please upload a photo!';
      return;
    }
    const location = document.getElementById('location-input-newpost').value;
    const caption = document.getElementById('comment').value;
    await addPost(userId, media, caption, location).then(fetchPosts());
    onHide();
    window.location.reload(false);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal"
    >
      <div className="modal_content">
        <div className="container my-3 " data-testid="new-post-popup">
          <div className="row">
            <p className="text-left my-1">Create New Post</p>
            <svg className="my-1" id="dismiss" onClick={onHide} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16992 14.8299L14.8299 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <hr className="divider" />
            <div className="new-post-input mx-5 my-3">
              <form onSubmit={handleSubmit}>
                <div className="container border py-2" id="images-input-box">
                  <ImageUploader onImagesUpload={onImagesUpload} />
                  <div className="container" id="alert-box" />
                </div>
                <textarea data-testid="new-post-caption" name="comment" id="comment" rows="5" placeholder="Add captions here..." className="comment-input mx-3 my-4" />
                <br />
                <input
                  type="text"
                  placeholder="Location"
                  name="location-input-newpost"
                  id="location-input-newpost"
                  className="location mx-3 my-2"
                />
                <input data-testid="new-post-button" type="submit" value="POST" className="post" id="post-button" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default NewPostPopup;
