const lib = require('../../utils/api/comment.js');
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

  // given
  const comment = [
    {
        post_id: 20,
        comment_id: "fc838d60-6a76-4daf-ac62-79f61ef20f95",
        belong_post_id: {
            post_id: "cc6fe21f-fba8-4703-9291-f7bdd4d66626",
            belong_user_id: "24b1cf6d-5018-4799-b7a4-3fc665f08f9a",
            caption: "in ut praesentium",
            media_src: {
                type: "image",
                src: "http://loremflickr.com/640/480/technics"
            },
            like_count: 89453,
            created_at: "2022-10-15T19:28:48.656Z",
            updated_at: "2022-10-16T03:47:27.655Z"
        },
        belong_user_id: {
            user_id: "5b07af20-1287-41ec-98b6-2bfd048f1534",
            password: "PDZAqMal6iO11c9",
            username: "Karlie76",
            email: "Trystan.Romaguera@gmail.com",
            Bio: "Dynamic Markets Liaison",
            created_at: "2022-10-15T11:00:00.349Z"
        },
        content: "Dolores asperiores a provident quia non aliquid vel repellendus. Unde laborum quod reprehenderit magnam est. Omnis aut error. Totam modi doloremque molestiae reprehenderit ipsa sit ut. Illo dolores et optio non ut. Dolorem voluptas officiis.",
        created_at: "2022-10-15T09:26:51.941Z"
    }
  ];

  describe("when get API call is successful", () => {
    it("should return comment info (then/catch)", () => {
      mock.onGet().reply(200, comment);

      // when
      let post_id = 20
      const result = lib.getCommentsByPostId(post_id);

      // then 
      expect(mock.history.get[0].url).toEqual(`${root}/comments/${post_id}`);
      result.then((data) => expect(data.data).toEqual(comment));
      result.then((data) => expect(data.status).toBe(200));
    }); 

    it("should return post info (async/await)", async () => {
      mock.onGet().reply(200, comment);

      // when
      let post_id = 20
      const result = await lib.getCommentsByPostId(post_id);

      // then
      expect(mock.history.get[0].url).toEqual(`${root}/comments/${post_id}`);
      expect(result.data).toEqual(comment);
      expect(result.data[0].post_id).toBe(20);
    });
  });

  describe("when delete API call is successful", () => {
    it("should return delete success state (then/catch)", () => {
        mock.onAny().reply(200)
  
        // when
        let post_id = 20
        const result = lib.deleteComment(post_id)
  
        // then 
        expect(mock.history.delete[0].url).toEqual(`${root}/comments/${post_id}`);
        result.then((data) => expect(data.config.method).toEqual("delete"));
        result.then((data) => expect(data.status).toBe(200));
      }); 

    it("should return deleted success state (async/await)", async () => {
      mock.onAny().reply(200);

      let post_id = 1000
      const result = await lib.deleteComment(post_id);

      expect(mock.history.delete[0].url).toEqual(`${root}/comments/${post_id}`);
      expect(result.config.method).toBe("delete");
      expect(result.status).toBe(200);
    });
  });
});

