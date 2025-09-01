export const validators = {
    required: (value: string, message = 'Поле обязательно для заполнения') => {
      return value.trim() ? null : message;
    },
    
    minLength: (value: string, min: number, message?: string) => {
      return value.length >= min ? null : (message || `Минимум ${min} символов`);
    },
    
    maxLength: (value: string, max: number, message?: string) => {
      return value.length <= max ? null : (message || `Максимум ${max} символов`);
    },
    
    phone: (value: string, message = 'Некорректный номер телефона') => {
      return isValidPhone(value) ? null : message;
    },
    
    email: (value: string, message = 'Некорректный email') => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : message;
    }
  };