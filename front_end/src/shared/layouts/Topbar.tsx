import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

interface TopbarProps {
  title: string;
  userName: string;
  onProfile: () => void;
}

const Topbar: React.FC<TopbarProps> = ({
  title,
  userName,
  onProfile,
}) => {
  return (
    <header className="topbar">
      <h1 className="page-title">{title}</h1>

      <button className="profile-btn" onClick={onProfile}>
        <PersonOutlineIcon />
        {userName}
      </button>
    </header>
  );
};

export default Topbar;
