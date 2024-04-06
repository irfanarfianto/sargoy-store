import styles from './Input.module.scss'

type Propstypes = {
   label: string;
   name: string;
   type: string;
   placeholder?: string;
   defaultValue?: string;
   disabled?: boolean;
};

const Input = (props: Propstypes) => {
   const { label, name, type, placeholder, defaultValue, disabled } = props;

   return (
         <div className={styles.container}>
                  {label && <label htmlFor={name}>{label}</label>}
         <input name={name}
            defaultValue={defaultValue}
            disabled={disabled}
            id={name}
            placeholder={placeholder}
            type={type}
            className={styles.container__input}
         />
         </div>
     
   )
}

export default Input;