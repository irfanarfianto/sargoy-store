import styles from './Button.module.scss';

type Propstypes = {
   type: 'button' | 'submit' | 'reset' | undefined;
   onClick?: () => void;
   children: React.ReactNode;
   variant: string;
   className?: string;
   disabled?: boolean;
}

const Button = (props: Propstypes) => {
   const { type, onClick, children, variant = 'primary', className, disabled } = props;
   return (
      <button type={type} onClick={onClick} disabled={disabled} className={`${styles.button} ${styles[variant]} ${className}`}>{children}</button>
   )
}

export default Button;