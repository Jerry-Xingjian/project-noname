const lib = require('../../utils/api/activityFeed.js');
const axios = require("axios");
const rootDir = require('../../utils/api/index.js')
import MockAdapter from "axios-mock-adapter";

const root = rootDir.default.root;

describe("getActivityFeedByUserId", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const post = [
    { 
        post_id: 20,
        belong_user_id: "693f248c-5c98-4703-b7b9-7713a10a1058",
        caption: "quo voluptatem nisi",
        media_src: {
            type: "image",
            src: "http://loremflickr.com/640/480/cats"
        },
        like_count: 2950,
        created_at: "2022-10-16T00:51:54.966Z",
        updated_at: "2022-10-16T17:11:52.968Z"
    },
  ];

  describe("when API call is successful", () => {
    it("should return post info (then/catch)", () => {
      mock.onGet().reply(200, post);

      // when
      let post_id = 20
      const result = lib.getActivityFeedByUserId(post_id);

      // then 
      expect(mock.history.get[0].url).toEqual(`${root}/activity_feed/${post_id}`);
      result.then((data) => expect(data.data).toEqual(post));
      result.then((data) => expect(data.config.method).toEqual("get"));
      result.then((data) => expect(data.status).toBe(200));
    }); 

    it("should return post info (async/await)", async () => {
      // given
      mock.onGet().reply(200, post);

      // when
      let post_id = 20
      const result = await lib.getActivityFeedByUserId(post_id);

      // then
      expect(mock.history.get[0].url).toEqual(`${root}/activity_feed/${post_id}`);
      expect(result.data).toEqual(post);
      expect(result.data[0].post_id).toBe(20);
    });
  });
});