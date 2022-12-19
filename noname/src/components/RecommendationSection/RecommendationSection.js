/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import RecommendationCard from '../RecommendationCard/RecommendationCard';
import './RecommendationSection.css';
import { getUserRecommendations } from '../../utils/api/user';

function RecommendationSection(props) {
  const [recommendations, setRecommendations] = useState([]);
  const { userInfo } = props;

  useEffect(() => {
    async function fetchRecommendations() {
      // console.log('trigger fetch recommendation');
      // eslint-disable-next-line no-underscore-dangle
      const rawData = await getUserRecommendations(userInfo._id);
      setRecommendations(rawData.data.data.remdUsers);
    }
    if ('username' in userInfo) {
      fetchRecommendations();
    }
  }, [userInfo]);

  return (
    <div className="container d-flex justify-content-between align-items-center mt-2 mb-4">
      <div className="recommendation-left d-flex flex-column justify-content-end">
        <div className="recommendation-my-info d-flex align-middle align-items-center justify-content-end">
          <img
            className="avatar-image ms-3 my-2 mx-2"
            src={userInfo.profilePicture}
            alt="Avatar"
            mode="aspectFit"
          />
          <h4 className="card-title ms-4">{ userInfo.username }</h4>
        </div>
        <div className="d-flex flex-column mt-2">
          <p className="suggestion-text">
            <strong>Top Two </strong>
            suggestions
            <br />
            for you
            <strong> TODAY</strong>
          </p>
          {/* <button type="button" className="btn btn-link text-decoration-none
          py-0 see-all-button">See All</button> */}
        </div>
      </div>
      <div className="d-flex flex-column mt-3">
        {
          recommendations.length === 0 ? (
            <p className="text-muted">No Recommentdations for you yet</p>
          ) : (
            recommendations.slice(0, 2).map((recommendation) => (
              <RecommendationCard
                key={recommendation._id}
                recommendedInfo={recommendation}
                userInfo={userInfo}
              />
            ))
          )
        }
      </div>
    </div>
  );
}

export default RecommendationSection;
