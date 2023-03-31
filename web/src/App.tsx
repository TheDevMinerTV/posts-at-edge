import { useEffect, useState } from "react";
import "./App.css";

type Post = {
  id: string;
  username: string;
  content: string;
  timestamp: number;
};

const Form = () => {
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        await fetch("https://backend.thedevminertv.workers.dev", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            content,
          }),
        });
      }}
    >
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("https://backend.thedevminertv.workers.dev")
      .then((res) => res.json() as Promise<{ results: Post[] }>)
      .then((data) => {
        setPosts(data.results);
      });
  }, []);

  return (
    <div className="App">
      <Form />
      {posts.map((post) => (
        <div className="post" key={post.id}>
          <h2>{post.username}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
