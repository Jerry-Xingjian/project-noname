import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfilePage.css';
import Modal from 'react-bootstrap/Modal';
import ImageUploader from '../ImageUploader/ImageUploader';
import { getCurrentUserProfile, updateUserProfile } from '../../utils/api/user';
import uploadFile from '../../utils/api/aws';

function EditProfilePage(props) {
  const { userId } = props;
  const [userProfileData, setUserProfileData] = useState({});
  const [showEditPicture, setShowEditPicture] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [tempPic, setTempPic] = useState('');
  const navigate = useNavigate();

  async function fetchProfileData() {
    const rawUserData = await getCurrentUserProfile();
    setUserProfileData(rawUserData.data.data);
  }

  const fileToDataUrl = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.readAsDataURL(file);
  });

  const handleImageUpload = (images) => {
    setNewImage(uploadFile(images[0].file).url);
    fileToDataUrl(images[0].file)
      .then((dataUri) => {
        setTempPic(dataUri);
      });
    setShowEditPicture(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function handleEditProfile(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const bio = document.getElementById('bio').value;
    let profilePicture;
    if (newImage === '') {
      profilePicture = userProfileData.profilePicture;
    } else {
      profilePicture = newImage;
    }
    // console.log(profilePicture);
    const profile = {
      username, bio, email, profilePicture,
    };
    await updateUserProfile(userId, profile);
    navigate(`/profile/${userId}`);
    // console.log('profile updated');
  }

  let pic;
  if (tempPic === '') {
    pic = userProfileData.profilePicture;
  } else {
    pic = tempPic;
  }

  return (
    <div className="container">
      <div className="main-content">
        <div className="row">
          <div className="col">
            <button id="change-picture" className="btn btn-link" title="Change Picture" type="button" onClick={() => setShowEditPicture(true)}>
              <img src={pic} className="rounded-circle" alt="Profile" width="175" height="175" />
            </button>
          </div>
          <div className="col">
            <form action={`/profile/${userId}`} onSubmit={handleEditProfile}>
              Username
              <input
                type="text"
                placeholder="Username"
                name="username"
                id="username"
                className="input my-3"
                defaultValue={userProfileData.username}
              />
              <br />
              Bio
              <input
                type="text"
                placeholder="Change your Bio here"
                name="bio"
                id="bio"
                className="input my-3"
                defaultValue={userProfileData.bio}
              />
              <br />
              Email Address
              <input
                type="text"
                placeholder="Email"
                name="email"
                id="email"
                className="input my-3"
                defaultValue={userProfileData.email}
              />
              <br />
              Confirm Password
              <input
                type="password"
                placeholder="*********"
                name="password"
                id="password"
                className="input my-3"
              />
              <br />
              <a type="button" className="btn mx-2 my-2" id="cancel" href={`/profile/${userId}`}>CANCEL</a>
              <input type="submit" value="SAVE" className="btn mx-2 my-2" id="save" />
            </form>
          </div>
        </div>
      </div>
      <Modal
        show={showEditPicture}
        onHide={() => setShowEditPicture(false)}
        className="modal"
      >
        <ImageUploader
          maxNumber={1}
          acceptType={['jpeg', 'jpg', 'png', 'gif', 'tiff']}
          onImagesUpload={handleImageUpload}
        />
      </Modal>
    </div>
  );
}

export default EditProfilePage;
