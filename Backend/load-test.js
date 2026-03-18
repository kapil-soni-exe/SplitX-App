const http = require("k6/http");
const { sleep, check } = require("k6");

exports.options = {
  vus: 200,
  duration: "30s",
};

// login once
exports.setup = function () {

  const payload = JSON.stringify({
    email: "soni.kapil789@gmail.com",
    password: "KaPIL2019@@"
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const loginRes = http.post(
    "http://localhost:3000/api/auth/login",
    payload,
    params
  );

  // safe cookie extraction
  const jwt = loginRes.cookies.jwt_token
    ? loginRes.cookies.jwt_token[0].value
    : "";

  const refresh = loginRes.cookies.refresh_token
    ? loginRes.cookies.refresh_token[0].value
    : "";

  const cookie = `jwt_token=${jwt}; refresh_token=${refresh}`;

  return { cookie };
};

exports.default = function (data) {

  const res = http.get(
    "http://localhost:3000/api/groups/69b144305b1aa570876e6f4c",
    {
      headers: {
        Cookie: data.cookie,
      },
    }
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
};