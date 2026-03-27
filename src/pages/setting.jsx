import React from "react";
import { useNavigate } from "react-router-dom";

function Example() {
  const navigate = useNavigate();

  const routes = [{ name: "메인", path: "/main" }];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>페이지모음</h1>
      {routes.map(({ name, path }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          style={{
            margin: "0.5rem",
            padding: "1rem 2rem",
            fontSize: "16px",
            borderRadius: "8px",
          }}
        >
          {name} 페이지
        </button>
      ))}
    </div>
  );
}

export default Example;
