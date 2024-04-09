import Link from 'next/link';
import styles from './Login.module.scss';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layouts/AuthLayout';

const LoginView = ({ setToaster }: { setToaster: Dispatch<SetStateAction<{}>>; }) => {

   const [isLoading, setIsLoading] = useState(false);
   const { push, query } = useRouter();

   const callbackUrl: any = query.callbackUrl || '/';

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

      event.preventDefault();
      setIsLoading(true);

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
            setToaster({
               variant: 'error',
               message: 'Email atau Password salah'
            });
         }
      } catch (error) {
         setIsLoading(false);
         setToaster({
            variant: 'error',
            message: 'Login gagal, silahkan coba lagi'
         });
      }
   };


   return (
      <AuthLayout title='Login' link='/auth/register' linkText='Belum punya akun? Daftar ' setToaster={setToaster}>
         <form onSubmit={handleSubmit}>
            <Input label='Email' name='email' type='email' placeholder='Masukkan email' />
             <Input label='Password' name='password' type='password' placeholder='Masukkan password' />
            <Button type='submit' variant='primary' className={styles.login__button}> {isLoading ? 'Loading...' : 'Login'}</Button>
         </form>
         <hr className={styles.login__devider} />
         <div className={styles.login__other}>
            <Button type='button' variant='button-google' className={styles.login__other__button} onClick={() => signIn('google', { callbackUrl, redirect:false })}><i className='bx bxl-google'/>Login dengan Google</Button>
         </div>
      </AuthLayout>
   );
}

export default LoginView;