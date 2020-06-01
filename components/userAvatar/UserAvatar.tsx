import { UserData } from '../../redux/reducers/auth';
import styles from './userAvatar.module.scss';

const UserAvatar: React.FC<{ user: UserData }> = ({ user }) => {
  if (!user.socialLogin || !user.socialLogin.github) {
    // @todo add default avatar
    return null;
  }

  const gitHubAvatarUrl = `https://avatars0.githubusercontent.com/u/${user.socialLogin.github}`;
  const alt = user.firstName
    ? `Avatar of ${user.firstName} ${user.lastName}`.trim()
    : `Avatar of user ${user.id}`;

  return <img src={gitHubAvatarUrl} alt={alt} className={styles.userAvatar} />;
};

export default UserAvatar;
