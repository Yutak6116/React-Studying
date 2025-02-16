import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const TopPage = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("ログイントークン:", tokenResponse);
      localStorage.setItem("google_token", JSON.stringify(tokenResponse));
      navigate("/home");
    },
    onError: (errorResponse) => {
      console.error("ログインエラー:", errorResponse);
    },
  });

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
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <h1 style={{ marginBottom: "1rem" }}>Welcome</h1>
        <p style={{ marginBottom: "2rem" }}>
          Googleアカウントでログインして、サービスをお楽しみください。
        </p>
        <button
          onClick={() => login()}
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#f7f7f7";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#fff";
          }}
        >
          <FcGoogle size={24} />
          Googleでログイン
        </button>
      </div>
    </div>
  );
};

export default TopPage;
