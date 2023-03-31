import { useEffect, useState } from "react";
import "./App.css";

type Post = {
  id: string;
  username: string;
  content: string;
  timestamp: number;
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
      {posts.map((post) => (
        <div className="post">
          <h2>{post.username}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
