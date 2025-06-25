import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';

interface UsersJoinedProps {
  showUsersJoined: boolean;
  canShowUsersJoined: boolean;
  usersJoined: number;
  usersJoinedLabel: string;
}

export const UsersJoined: React.FC<UsersJoinedProps> = ({
  showUsersJoined,
  canShowUsersJoined,
  usersJoined,
  usersJoinedLabel,
}) => {
  const isDarkMode = useDarkMode();

  const getUsersJoinedStyles = () => {
    return {
      fontSize: "13px",
      color: isDarkMode ? "white" : "var(--gray-20)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      marginBottom: "2px",
      marginTop: "-2px",
    };
  };

  const getUsersJoinedNumberStyles = () => {
    return {
      fontWeight: 600,
      color: isDarkMode ? "white" : "black",
    };
  };

  if (!showUsersJoined || !canShowUsersJoined || usersJoined <= 0) {
    return null;
  }

  return (
    <div style={getUsersJoinedStyles()}>
      <span style={getUsersJoinedNumberStyles()}>
        {usersJoined}
      </span>{" "}
      {usersJoinedLabel}
    </div>
  );
};