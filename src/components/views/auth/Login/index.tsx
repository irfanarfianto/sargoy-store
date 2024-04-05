import Link from 'next/link';
import styles from './Login.module.scss';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
               <Input label='Email' name='email' type='email' />
               <Input label='Password' name='password' type='password' />
               <Button type='submit' variant='primary' className={styles.login__form__button}> {isLoading ? 'Loading...' : 'Login'}</Button>
            </form>
            <hr className={styles.login__form__devider} />
            <div className={styles.login__form__other}>
               
               <Button type='button' variant='button-google' className={styles.login__form__other__button} onClick={() => signIn('google', { callbackUrl, redirect:false })}><i className='bx bxl-google'/>Login dengan Google</Button>
            </div>
         </div>
         <p className={styles.login__link}>Belum punya akun? <Link href="/auth/register">Register</Link></p>
      </div>
   );
}

export default LoginView;