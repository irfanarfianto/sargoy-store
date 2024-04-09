import Link from 'next/link';
import styles from './Register.module.scss';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import authServices from '@/services/auth';
import AuthLayout from '@/components/layouts/AuthLayout';

const RegisterView = ({ setToaster }: {
   setToaster: Dispatch<SetStateAction<{}>>
}) => {
   const [isLoading, setIsLoading] = useState(false);
   const { push } = useRouter();

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

      event.preventDefault();
      setIsLoading(true);

      const form = event.target as HTMLFormElement;
      const data = {
         email: form.email.value,
         fullname: form.fullname.value,
         phone: form.phone.value,
         password: form.password.value
      };

      try {
          const result = await authServices.registerAccount(data);
         if (result.status === 200) {
         form.reset();
         setIsLoading(false);
         push('/auth/login');
         setToaster({
            variant: 'success',
            message: 'Register Success'
         });
         } else {
            setIsLoading(false);
            setToaster({
               variant: 'error',
               message: 'Register Gagal'
            });
         }
      } catch (error) {
         setIsLoading(false);
            setToaster({
               variant: 'error',
               message: 'Email sudah digunakan'
            });
      }
   };


   return (
      <AuthLayout title='Register' link='/auth/login' linkText='Sudah punya akun? Login ' setToaster={setToaster}>
         <form onSubmit={handleSubmit}>
               <Input label='Email' name='email' type='email' placeholder='Masukkan email Anda' />
               <Input label='Nama Lengkap' name='fullname' type='text' placeholder='Masukkan Nama Lengkap' />
               <Input label='Nomor Handphone' name='phone' type='number' placeholder='Masukkan Nomor Handphone' />
               <Input label='Password' name='password' type='password' placeholder='Masukkan Password' />
               <Button type='submit' className={styles.register__button} variant='primary'>{isLoading ? 'Loading...' : 'Register'}</Button>
         </form>
      </AuthLayout>
      
   );
}

export default RegisterView;