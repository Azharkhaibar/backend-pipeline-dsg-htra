export interface Product {
  id: number;
  namaProduk: string;
  reviewProduk?: string;
  warnaProduk?: string;
  fotoProduk?: string;
  deskripsiProduk: string;
  harga: number;

  fkVendor?: number;
  fkCategory?: number;

  stok?: number;
  stok_minimum?: number;
  isManageStock?: boolean;

  created_at: Date;
  updated_at: Date;
}
