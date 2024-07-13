export interface ICustomer {
    firstName: string;
    lastName: string;
    gender: string; // choices: GENDER, default: 'Prefer not to say'
    title: string;
    address: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
}