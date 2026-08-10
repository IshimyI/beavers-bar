import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";
import { NavLink, useNavigate } from "react-router";
import styles from "./Header.module.css";
import { UserAvatar } from "@/entities/user/ui/UserAvatar/UserAvatar";
import { JSX } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/reduxHook";
import { signOutThunk } from "@/entities/user";
import { useAlert } from "@/features/alert";

export function Header(): JSX.Element {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();

  const onLogoutHandler = async () => {
    dispatch(signOutThunk());
    showAlert("Будем рады видеть вас снова!");
    navigate(CLIENT_ROUTES.SIGN_IN);
  };

  return (
    <nav className={styles.container}>
      {/* Левая секция */}
      <div className={styles.leftSection}>
        <div className={styles.navLinks}>
          <NavLink
            to={CLIENT_ROUTES.MAIN}
            className={({ isActive }) =>
              `${isActive ? styles.active : ""} ${styles.navLink}`
            }
            style={({ isActive }) =>
              isActive
                ? ({
                    "--active-color": "var(--color-green)",
                  } as React.CSSProperties)
                : undefined
            }
          >
            Главная
          </NavLink>
          <NavLink
            to={CLIENT_ROUTES.MY_BAR}
            className={({ isActive }) =>
              `${isActive ? styles.active : ""} ${styles.navLink}`
            }
            style={({ isActive }) =>
              isActive
                ? ({
                    "--active-color": "var(--color-green)",
                  } as React.CSSProperties)
                : undefined
            }
          >
            Бар
          </NavLink>
          <NavLink
            to={CLIENT_ROUTES.JOURNAL}
            className={({ isActive }) =>
              `${isActive ? styles.active : ""} ${styles.navLink}`
            }
            style={({ isActive }) =>
              isActive
                ? ({
                    "--active-color": "var(--color-green)",
                  } as React.CSSProperties)
                : undefined
            }
          >
            Журнал
          </NavLink>
        </div>
        <div className={styles.line}></div>
      </div>

      {/* Центральная секция с логотипом */}
      <NavLink to={CLIENT_ROUTES.MAIN} className={styles.centerSection}>
        <img src="/culture-header.png" alt="Logo" className={styles.logo} />
      </NavLink>

      {/* Правая секция */}
      <div className={styles.rightSection}>
        <div className={styles.navLinks}>
          {!user ? (
            <>
              <NavLink
                to={CLIENT_ROUTES.SIGN_IN}
                className={({ isActive }) =>
                  `${isActive ? styles.active : ""} ${styles.navLink}`
                }
                style={({ isActive }) =>
                  isActive
                    ? ({
                        "--active-color": "var(--color-green)",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                Вход
              </NavLink>
              <NavLink
                to={CLIENT_ROUTES.SIGN_UP}
                className={({ isActive }) =>
                  `${isActive ? styles.active : ""} ${styles.navLink}`
                }
                style={({ isActive }) =>
                  isActive
                    ? ({
                        "--active-color": "var(--color-green)",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                Регистрация
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={user.isAdmin ? CLIENT_ROUTES.ADMIN : CLIENT_ROUTES.MAIN}
                className={({ isActive }) =>
                  `${isActive ? styles.active : ""} ${styles.navLink}`
                }
                style={({ isActive }) =>
                  isActive
                    ? ({
                        "--active-color": "var(--color-green)",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <UserAvatar user={user} />
              </NavLink>
              <NavLink
                to={CLIENT_ROUTES.SIGN_IN}
                onClick={onLogoutHandler}
                className={({ isActive }) =>
                  `${isActive ? styles.active : ""} ${styles.navLink}`
                }
                style={({ isActive }) =>
                  isActive
                    ? ({
                        "--active-color": "var(--color-green)",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                Выйти
              </NavLink>
            </>
          )}
        </div>
        <div className={styles.line}></div>
      </div>
    </nav>
  );
}
