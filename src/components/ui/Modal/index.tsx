import { Dispatch, ReactNode, useEffect, useRef } from 'react';
import styles from './Modal.module.scss';

const Modal = ({ children, onClose }: {
   children: React.ReactNode,
   onClose: any,
}) => {
   const ref: any = useRef();
   useEffect( () => {
      const handleClickedOutside = (e: any) => {
         if (ref.current && !ref.current.contains(e.target)) {
            onClose();
         }
      };
      document.addEventListener('mousedown', handleClickedOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickedOutside);
      }
   }, [onClose]);
   return (
      <div className={styles.modal}>
         <div className={styles.modal__main} ref={ref}>
            {children}
         </div>
      </div>
   )
}

export default Modal;