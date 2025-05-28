//정규 표현식
export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const discountRegex = /^(100|[1-9]?[0-9])$/;

export const usernameRegex = /^[a-z][a-z0-9]{3,11}$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export const phoneRegex = /^(01[016789]|070)\d{7,8}$/;


