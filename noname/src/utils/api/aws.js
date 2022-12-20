import AWS from 'aws-sdk';

const ID = process.env.REACT_APP_AWS_ID;
const SECRET = process.env.REACT_APP_AWS_SECRET;

const BUCKET_NAME = 'nonome-project-media';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const uploadFile = (file) => {
  const fileName = `${Date.now().toString()}_${file.name}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
  };

  s3.upload(params, (err) => {
    if (err) {
      throw err;
    }
  });
  const obj = {
    url: `https://nonome-project-media.s3.amazonaws.com/${fileName}`,
    type: 'image',
  };
  return obj;
};

export default uploadFile;
