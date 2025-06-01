export interface CustomerIf {
    id: number;
    namaCustomer: string;
    email: string;
    status: string;
    // GANTI ENUM
    customerType: string;
    lastContacted: Date;
    created_at: Date;
    updated_at: Date;
}

export interface CustomerDetailsIf {
    alamat: Text,
    kelurahan: string,
    kecamatan: string,
    kota: string,
    provinsi: string,
    kodePos: number
}

export interface Contacts {
    contactDate: Date,
    contatMethod: string,
    subject: string
}

export interface sqlDB {
    DATABASE_URL: string;
}
