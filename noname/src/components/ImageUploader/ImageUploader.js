import React from 'react';
import ImageUploading from 'react-images-uploading';
import uuid from 'react-uuid';
import { Alert, Button, ButtonGroup } from 'reactstrap';
import './ImageUploader.css';

function ImageUploader(props) {
  const {
    existingImages = [],
    maxNumber = 10,
    acceptType = ['jpeg', 'jpg', 'png', 'gif', 'mp4', 'mov', 'avi', 'wmv'],
    maxFileSize = 5000000,
    onImagesUpload,
  } = props;

  const [images, setImages] = React.useState(existingImages);

  const onChange = (imageList) => {
    setImages(imageList);
  };

  const onError = () => {
    setImages([]);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        onError={onError}
        maxNumber={maxNumber}
        acceptType={acceptType}
        maxFileSize={maxFileSize}
        dataURLKey="url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          errors,
        }) => (
          <>
            {errors && (
              <Alert color="danger text-start">
                <ul>
                  {errors.maxNumber && (
                    <li>Number of selected images exceed maxNumber</li>
                  )}
                  {errors.acceptType && (
                    <li>Your selected file type is not allow</li>
                  )}
                  {errors.maxFileSize && (
                    <li>Selected file size exceed maxFileSize</li>
                  )}
                </ul>
              </Alert>
            )}

            <div className="upload__image-wrapper align-items-center">
              <div className="p-2" style={{ textAlign: 'left' }}>
                {imageList.map((image, index) => (
                  <div
                    key={uuid()}
                    className="image-item"
                    style={{
                      width: '150px',
                      marginRight: '10px',
                      display: 'inline-block',
                    }}
                  >
                    <img
                      src={(image.url === undefined)
                        ? image
                        : image.url}
                      alt=""
                      style={{ width: '100%' }}
                    />
                    <div className="image-item__btn-wrapper mt-1">
                      <ButtonGroup size="sm" style={{ width: '100%' }}>
                        <Button
                          color="primary"
                          onClick={() => onImageUpdate(index)}
                        >
                          Update
                        </Button>
                        <Button
                          color="danger"
                          onClick={() => onImageRemove(index)}
                        >
                          Remove
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="container"
                id="add"
                role="presentation"
                onClick={onImageUpload}
                onKeyDown={onImageUpload}
              >
                <img src="https://nonome-project-media.s3.amazonaws.com/icons/directbox-send.svg" className="mx-2" alt="+" width="20" height="20" />
                Upload Photo Here
              </div>
              {images.length > 0 && (
                <>
                  <hr />
                  <div className="text-start p-2">
                    <Button onClick={() => onImagesUpload(images)} color="success">
                      Upload
                    </Button>
                    {' '}
                    <Button onClick={onImageRemoveAll} color="danger">
                      Remove All Images
                    </Button>
                  </div>
                  <pre className="text-start" id="jsonprint" />
                </>
              )}
            </div>
          </>
        )}
      </ImageUploading>
    </div>
  );
}

export default ImageUploader;
