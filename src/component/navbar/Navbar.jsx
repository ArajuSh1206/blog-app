import styles from './navbar.module.css';
import Link from 'next/link';
import AuthLinks from '../authLinks/AuthLinks';
import ThemeToggle from '../themeToggle/ThemeToggle';
import Image from 'next/image';

const Navbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.social}>
        <Image src="/youtube.png" alt="youtube" width={28} height={28} />
        <Image src="/instagram.png" alt="instagram" width={24} height={24} />
        <Image src="/linkedin.png" alt="linkedin" width={28} height={28} />
        <Image src="/github.png" alt="github" width={28} height={28} />
      </div>

      <div className={styles.logo}>Guff Blog</div>

      <div className={styles.links}>
        <ThemeToggle />
        <Link href="/">Homepage</Link>
        <Link href="/">Contacts</Link>
        <Link href="/">About</Link>
        <AuthLinks />
      </div>
    </div>
  );
};

export default Navbar;
