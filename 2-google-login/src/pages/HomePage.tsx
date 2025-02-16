import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";

interface GoogleUser {
  name: string;
  email: string;
  // 他のプロパティが必要なら追加
}

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<GoogleUser | null>(null);

  useEffect(() => {
    // TopPage.tsx の onSuccess で保存した tokenResponse を取得
    const tokenData = localStorage.getItem("google_token");
    console.log("Stored tokenData:", tokenData);
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      console.log("Parsed token:", parsedToken);
      if (parsedToken?.access_token) {
        // Googleの userinfo エンドポイントを呼び出してユーザー情報を取得
        fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${parsedToken.access_token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("User info:", data);
            setUser({
              name: data.name,
              email: data.email,
            });
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
          });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("google_token");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          textAlign: "center",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1 style={{ marginBottom: "1rem", color: "#333" }}>Home Page</h1>
        <p style={{ marginBottom: "2rem", color: "#666" }}>
          ログインに成功しました。
        </p>
        {user && (
          <div style={{ marginBottom: "2rem" }}>
            <p>
              <strong>アカウント名: </strong>
              {user.name}
            </p>
            <p>
              <strong>Gmail: </strong>
              {user.email}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#f56565",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#e53e3e";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#f56565";
          }}
        >
          <MdLogout size={24} />
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default HomePage;
