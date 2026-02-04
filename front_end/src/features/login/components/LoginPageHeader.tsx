import BlueLogo from "../../../assets/logo-blue.svg";
import "../pages/Login.css";

export function LoginPageHeader() {
  return (
    <div className="login-header">
      <img
        src={BlueLogo}
        alt="Logo"
      />
      <h1>TatvaLib</h1>
    </div>
  );
}
