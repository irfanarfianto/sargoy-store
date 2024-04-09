import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './Toaster.module.scss';

type Propstypes = {
   variant?: string;
   message?: string;
   setToaster: Dispatch<SetStateAction<{}>>;
};

const toasterVariant: any = {
   'success': {
      title: 'Success',
      icon: 'bx-check-circle',
      color: '#a3d9a5',
      barColor: '#3f9242'
   },
   'error': {
      title: 'Error',
      icon: 'bx-x-circle',
      color: '#f39b9a',
      barColor: '#bb2525'
   },
   'warning': {
      title: 'Warning',
      icon: 'bx-error',
      color: '#ffc266',
      barColor: '#ff7f00'
   }
}

const Toaster = (props: Propstypes) => {
   const { variant = 'warning', message, setToaster } = props;
   const [lengthBar, setLengthBar] = useState(100);

   const timerRef = useRef<any>(null);

   const timerStart = () => {
      timerRef.current = setInterval(() => {
         setLengthBar((prevLength) => prevLength - 0.17);
      }, 1);
   };

   useEffect(() => {
      timerStart();
      return () => {
         clearInterval(timerRef.current);
      }
   }, []);

   console.log(lengthBar);

   return (
      <div className={`${styles.toaster} ${styles[`toaster--${variant}`]}`}>
         <div className={styles.toaster__main}>
            <div className={styles.toaster__main__icon}>
               <i className={`bx ${toasterVariant[variant].icon}`} style={{ color: toasterVariant[variant].barColor}} />
            </div>
            <div className={styles.toaster__main__text}>
               <p className={styles.toaster__main__text__title}>
                  {toasterVariant[variant].title}
               </p>
               <p className={styles.toaster__main__text__message}>{ message }</p>
            </div>
            <i className={`bx bx-x ${styles.toaster__main__close}`} onClick={() => setToaster({})} />
         </div>
         <div className={`${styles.toaster__timer}`} style={{background: toasterVariant[variant].color}}>
            <div style={{ width: `${lengthBar}%`, height: '100%', background: toasterVariant[variant].barColor }} />
         </div>
      </div>
   )
};
export default Toaster;