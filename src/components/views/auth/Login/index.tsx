import Link from 'next/link';
import styles from './Login.module.scss';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { redirect } from 'next/dist/server/api-utils';
import { signIn } from 'next-auth/react';

const LoginView = () => {

   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const { push, query } = useRouter();

   const callbackUrl: any = query.callbackUrl || '/';

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

      event.preventDefault();
      setIsLoading(true);
      setError('');

      const form = event.target as HTMLFormElement;
      try {
         const res = await signIn("credentials", {
            redirect: false,
            email: form.email.value,
            password: form.password.value,
            callbackUrl
         })

         if (!res?.error) {
            form.reset();
            setIsLoading(false);
            push(callbackUrl);
         } else {
            setIsLoading(false);
            setError('Email atau Password salah');
         }
      } catch (error) {
         setIsLoading(false);
         setError('Email atau Password salah');
      }
   };


   return (
      <div className={styles.login}>
         <h1 className={styles.login__title}>Login</h1>
         {error && <p className={styles.login__error}>{error}</p>}
         <div className={styles.login__form}>
            <form onSubmit={handleSubmit}>
               <div className={styles.login__form__item}>
                  <label htmlFor="email">Email</label>
                  <input name='email' id='email' type="email" className={styles.login__form__item__input} />
               </div>
               <div className={styles.login__form__item}>
                  <label htmlFor="password">Password</label>
                  <input name='password' id='password' type="password" className={styles.login__form__item__input} />
               </div>
               <button type='submit' className={styles.login__form__button}>
                  {isLoading ? 'Loading...' : 'Login'}
               </button>
            </form>
            <hr className={styles.login__form__devider} />
            <div className={styles.login__form__other}>
               <button type='button' onClick={() => signIn('google', { callbackUrl, redirect:false })} className={styles.login__form__other__button}><i className='bx bxl-google'/>Login dengan Google</button>
            </div>
         </div>
         <p className={styles.login__link}>Belum punya akun? <Link href="/auth/register">Register</Link></p>
      </div>
   );
}

export default LoginView;