/* eslint-disable no-underscore-dangle */
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import ImageUploader from '../ImageUploader/ImageUploader';
import './EditPostPopup.css';
import { updatePost } from '../../utils/api/post';
import uploadFile from '../../utils/api/aws';

function EditPostPopup(props) {
  const {
    show,
    onHide,
    postInfo,
    fetchPosts,
  } = props;

  let { media } = postInfo;

  const onImagesUpload = (images) => {
    media = [];
    if (images.length > 0) {
      images.forEach((image) => {
        if (image.file === undefined) {
          media.push(image);
        } else {
          media.push(uploadFile(image.file));
        }
      });
    }
    // console.log(media);
  };

  async function handleEditPost(e) {
    // console.log('submit clicked');
    e.preventDefault();
    if (media.length === 0) {
      // alert('No file uploaded!');
      document.getElementById('alert-box').innerHTML = 'Please upload a photo!';
      return;
    }
    const caption = document.getElementById('caption').value;
    const location = document.getElementById('location-input').value;
    // console.log(location);
    // const location = document.getElementById('location').value;

    await updatePost(postInfo._id, caption, location, media);
    fetchPosts();
    onHide();
    window.location.reload(false);
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      className="modal"
    >
      <div className="modal_content">
        <div className="container my-3 ">
          <div className="row">
            <p className="text-left my-1">Edit Your Post</p>
            <svg className="my-1" id="dismiss" onClick={onHide} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.16992 14.8299L14.8299 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <hr className="divider" />
            <div className="new-post-input mx-5 my-3">
              <form onSubmit={handleEditPost}>
                <div className="container border" id="images-input-box">
                  <label htmlFor="images-input" className="images-input-label mx-3 my-3">
                    <ImageUploader
                      existingImages={postInfo.media}
                      onImagesUpload={onImagesUpload}
                    />
                  </label>
                  <div className="container" id="alert-box" />
                </div>
                <textarea name="comment" id="caption" rows="5" placeholder="Change comments here..." className="comment-input mx-3 my-4" defaultValue={postInfo.caption} />
                <br />
                <input
                  type="text"
                  placeholder="Change Location..."
                  name="location-input"
                  id="location-input"
                  className="location mx-3 my-2"
                  defaultValue={postInfo.location}
                />
                <input type="submit" value="SAVE" className="post" id="post-button" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default EditPostPopup;
