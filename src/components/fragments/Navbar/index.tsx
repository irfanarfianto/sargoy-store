import { signIn, signOut, useSession } from "next-auth/react"
import styles from './Navbar.module.scss'

const Navbar = () => {
   const { data: session } = useSession(); // Menyimpan objek sesi ke dalam variabel session

   // Menampilkan nama lengkap pengguna jika sesi tersedia
   const userFullName = session?.user?.fullname || "Guest";

   return (
      <div className={styles.navbar}>
         {/* Menampilkan tombol login/logout */}
         <button className={styles.navbar__button} onClick={() => session ? signOut() : signIn()}>
            {session ? 'Logout' : 'Login'}
         </button>
         {/* Menampilkan nama lengkap pengguna jika tersedia */}
         {session && <span className={styles.navbar__user}>{userFullName}</span>}
      </div>
   )
}

export default Navbar;
