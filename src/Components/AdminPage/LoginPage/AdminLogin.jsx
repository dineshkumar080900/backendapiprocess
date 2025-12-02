import { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../../../Assert/LogoDesign/Logo.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLogin() {
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [uFocus, setUFocus] = useState(false);
  const [pFocus, setPFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://mitrahomebackendapi.pemixcels.com/api/loginapiprocess/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uname, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Login Successful!", { autoClose: 1500 });

        // Save token
        localStorage.setItem("adminToken", data.token);

        setTimeout(() => {
          navigate("/admin/admindashbooard");
        }, 1500);
      } else {
        toast.error(data.message || "Login Failed");
      }
    } catch (err) {
      toast.error("Server error. Try again later.");
    }
  };

  // ---- styles ----
  const s = {
    page: {
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      background: "#f5f7fb",
      padding: 16,
    },
    card: {
      width: "100%",
      maxWidth: 520,
      background: "#fff",
      borderRadius: 18,
      border: "1px solid #eef2f7",
      boxShadow: "0 22px 48px rgba(15,23,42,.08)",
    },
    body: { padding: 32 },
    header: { textAlign: "center" },
    logo: {
      width: 100,
      height: 100,
      margin: "20px auto 10px",
      display: "block",
      objectFit: "contain",
    },
    title: {
      fontSize: 36,
      fontWeight: 800,
      lineHeight: 0.8,
      color: "#0f172a",
    },
    sub: { color: "#6b7280", fontSize: 18 },
    form: { display: "grid", gap: 20 },
    label: {
      fontWeight: 600,
      color: "#334155",
      marginBottom: 6,
      display: "block",
    },
    input: (focused) => ({
      width: "100%",
      background: "#f7f9ff",
      border: "1px solid #e6ebf3",
      borderRadius: 12,
      padding: "12px 14px",
      outline: "none",
      transition: "0.15s",
      ...(focused && {
        background: "#fff",
        borderColor: "#6a9952ff",
        boxShadow: "0 0 0 4px rgba(96,165,250,.20)",
      }),
    }),
    button: (isHover) => ({
      width: "100%",
      border: "none",
      padding: "14px 16px",
      borderRadius: 12,
      background: "linear-gradient(135deg,#E36324 0%,#FF7B42 100%)",
      color: "#fff",
      fontWeight: 800,
      cursor: "pointer",
      transition: "0.15s",
      boxShadow: "0 10px 20px rgba(227,99,36,.25)",
      ...(isHover && {
        transform: "translateY(-1px)",
        filter: "saturate(1.05)",
        boxShadow: "0 14px 28px rgba(227,99,36,.32)",
      }),
    }),
    footer: {
      textAlign: "center",
      padding: "10px 24px 24px",
      color: "#94a3b8",
      fontSize: 12,
    },
  };

  return (
    <div style={s.page}>
      <ToastContainer position="top-right" />

      <div style={s.card}>
        <div style={s.header}>
          <img src={image} alt="Mitha Homes" style={s.logo} />
          <h1 style={s.title}>Admin Login</h1>
          <div style={s.sub}>Sign in to your dashboard</div>
        </div>

        <div style={s.body}>
          <form onSubmit={handleSubmit} style={s.form}>
            <div>
              <label style={s.label}>Username</label>
              <input
                type="text"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
                onFocus={() => setUFocus(true)}
                onBlur={() => setUFocus(false)}
                autoComplete="username"
                style={s.input(uFocus)}
              />
            </div>

            <div>
              <label style={s.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPFocus(true)}
                onBlur={() => setPFocus(false)}
                autoComplete="current-password"
                style={s.input(pFocus)}
              />
            </div>

            <button
              type="submit"
              style={s.button(hover)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Login
            </button>
          </form>
        </div>

        <div style={s.footer}>
          © {new Date().getFullYear()} Mitha Homes. All rights reserved.
        </div>
      </div>
    </div>
  );
}
