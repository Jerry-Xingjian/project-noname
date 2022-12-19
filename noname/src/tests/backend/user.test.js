const lib = require('../../utils/api/user.js');
const axios = require("axios");
const rootDir = require('../../utils/api/index.js')
import MockAdapter from "axios-mock-adapter";

const root = rootDir.default.root;

describe("getProfileByUserId", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const profile = [
    { 
        user_id: 20,
        username: "Lawrence_Hauck44",
        posts_count: 5,
        follower_count: 23,
        following_count: 25,
        bio: "Fugit ut et. In alias accusantium omnis totam reprehenderit. Corporis minima et. Ipsum provident blanditiis eius hic. Optio suscipit explicabo sapiente eum. Quidem est aut ut rerum eos fuga tenetur et.",
        "profile_picture": "http://loremflickr.com/640/480/people",
        media_src_1: {
            post_id: "c8e1658e-3eb6-4cf0-b53a-49fe440d514b",
            type: "image",
            src: "http://loremflickr.com/640/480/abstract",
            like_count: 87,
            created_at: "2022-10-16T01:00:05.114Z",
            updated_at: "2022-10-16T08:12:05.736Z"
        }
    }
  ];
  describe("when API call is successful", () => {
    it("should return profile info (then/catch)", () => {
      mock.onGet().reply(200, profile);

      // when
      let user_id = 20;
      const result = lib.getUserProfile(user_id);

      // then 
      expect(mock.history.get[0].url).toEqual(`${root}/profile/${user_id}`);
      result.then((data) => expect(data.data).toEqual(profile));
      result.then((data) => expect(data.config.method).toEqual("get"));
      result.then((data) => expect(data.status).toBe(200));
    }); 

    it("should return profile info (async/await)", async () => {
      // given
      mock.onGet().reply(200, profile);

      // when
      let user_id = 20
      const result = await lib.getUserProfile(user_id);

      // then
      expect(mock.history.get[0].url).toEqual(`${root}/profile/${user_id}`);
      expect(result.data).toEqual(profile);
      expect(result.data[0].user_id).toBe(20);
    });
  });
});

