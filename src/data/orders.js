import { products } from './products'

export const ORDER_STATUSES = {
  PENDING:    { label: 'En attente',    color: '#854F0B', bg: '#FAEEDA' },
  CONFIRMED:  { label: 'Confirmée',     color: '#185FA5', bg: '#E6F1FB' },
  PROCESSING: { label: 'En préparation',color: '#534AB7', bg: '#EEEDFE' },
  SHIPPED:    { label: 'Expédiée',      color: '#0F6E56', bg: '#E1F5EE' },
  DELIVERED:  { label: 'Livrée',        color: '#3B6D11', bg: '#EAF3DE' },
  CANCELLED:  { label: 'Annulée',       color: '#791F1F', bg: '#FCEBEB' },
}

export const mockOrders = [
  {
    id: 'MAI-38471',
    date: '2026-05-28',
    status: 'DELIVERED',
    address: '12 Rue des Palmiers, Pétion-Ville, Haïti',
    items: [
      { ...products[0], qty: 1, size: 'M', color: 'Ivoire', unitPrice: products[0].price },
      { ...products[7], qty: 1, size: '90×90 cm', color: 'Bleu marine', unitPrice: products[7].price },
    ],
    subtotal: products[0].price + products[7].price,
    delivery: 0,
    total: products[0].price + products[7].price,
  },
  {
    id: 'MAI-29104',
    date: '2026-06-02',
    status: 'SHIPPED',
    address: '12 Rue des Palmiers, Pétion-Ville, Haïti',
    items: [
      { ...products[2], qty: 1, size: '38', color: 'Naturel', unitPrice: products[2].price },
    ],
    subtotal: products[2].price,
    delivery: 1500,
    total: products[2].price + 1500,
  },
  {
    id: 'MAI-51830',
    date: '2026-06-08',
    status: 'PROCESSING',
    address: '12 Rue des Palmiers, Pétion-Ville, Haïti',
    items: [
      { ...products[3], qty: 2, size: '100ml', color: '', unitPrice: products[3].price },
      { ...products[5], qty: 1, size: 'S', color: 'Sable', unitPrice: products[5].price },
    ],
    subtotal: products[3].price * 2 + products[5].price,
    delivery: 0,
    total: products[3].price * 2 + products[5].price,
  },
  {
    id: 'MAI-60293',
    date: '2026-06-09',
    status: 'PENDING',
    address: '12 Rue des Palmiers, Pétion-Ville, Haïti',
    items: [
      { ...products[4], qty: 1, size: 'Unique', color: 'Fauve', unitPrice: products[4].price },
    ],
    subtotal: products[4].price,
    delivery: 1500,
    total: products[4].price + 1500,
  },
]

// Admin: all orders from all customers
export const allOrders = [
  ...mockOrders,
  {
    id: 'MAI-11029', date: '2026-05-20', status: 'DELIVERED',
    customer: 'Marie Dupont', email: 'marie@example.com',
    address: '5 Ave Christophe, Port-au-Prince',
    items: [{ ...products[1], qty: 1, size: '38', color: 'Crème', unitPrice: products[1].price }],
    subtotal: products[1].price, delivery: 0, total: products[1].price,
  },
  {
    id: 'MAI-22847', date: '2026-05-25', status: 'DELIVERED',
    customer: 'Jean Pierre', email: 'jean@example.com',
    address: '8 Rue Capois, Port-au-Prince',
    items: [
      { ...products[6], qty: 1, size: '37', color: 'Noir', unitPrice: products[6].price },
      { ...products[3], qty: 1, size: '50ml', color: '', unitPrice: products[3].price },
    ],
    subtotal: products[6].price + products[3].price, delivery: 1500, total: products[6].price + products[3].price + 1500,
  },
  {
    id: 'MAI-33610', date: '2026-06-01', status: 'SHIPPED',
    customer: 'Nathalie Joseph', email: 'nathalie@example.com',
    address: '3 Rue Lamarre, Pétion-Ville',
    items: [{ ...products[0], qty: 2, size: 'S', color: 'Noir', unitPrice: products[0].price }],
    subtotal: products[0].price * 2, delivery: 0, total: products[0].price * 2,
  },
  {
    id: 'MAI-44205', date: '2026-06-05', status: 'CONFIRMED',
    customer: 'Paul Morin', email: 'paul@example.com',
    address: '20 Blvd Toussaint, Cap-Haïtien',
    items: [{ ...products[4], qty: 1, size: 'Unique', color: 'Noir', unitPrice: products[4].price }],
    subtotal: products[4].price, delivery: 2500, total: products[4].price + 2500,
  },
  {
    id: 'MAI-55918', date: '2026-06-07', status: 'CANCELLED',
    customer: 'Sophie Martin', email: 'sophie@example.com',
    address: '12 Rue des Palmiers, Pétion-Ville',
    items: [{ ...products[2], qty: 1, size: '40', color: 'Bordeaux', unitPrice: products[2].price }],
    subtotal: products[2].price, delivery: 1500, total: products[2].price + 1500,
  },
]

export const adminStats = {
  revenue: { value: 2847500, change: +18.4 },
  orders: { value: 124, change: +12.1 },
  customers: { value: 89, change: +8.7 },
  avgBasket: { value: 42350, change: +5.2 },
  salesByMonth: [
    { month: 'Jan', revenue: 180000 },
    { month: 'Fév', revenue: 220000 },
    { month: 'Mar', revenue: 195000 },
    { month: 'Avr', revenue: 310000 },
    { month: 'Mai', revenue: 280000 },
    { month: 'Jun', revenue: 340000 },
  ],
  topProducts: [
    { name: 'Sac Tressé en Cuir', sales: 12, revenue: 1500000 },
    { name: 'Escarpin Cuir Naturel', sales: 18, revenue: 1044000 },
    { name: 'Robe en Soie Ivoire', sales: 24, revenue: 1020000 },
    { name: 'Mule Velours Noire', sales: 16, revenue: 752000 },
    { name: 'Blazer Crème Structuré', sales: 19, revenue: 722000 },
  ],
  recentActivity: [
    { type: 'order', text: 'Nouvelle commande MAI-60293', time: 'Il y a 2 h' },
    { type: 'stock', text: 'Stock bas — Sac Tressé (3 restants)', time: 'Il y a 4 h' },
    { type: 'order', text: 'Commande MAI-51830 expédiée', time: 'Hier, 14:30' },
    { type: 'user', text: 'Nouveau client : paul@example.com', time: 'Hier, 09:15' },
    { type: 'stock', text: 'Stock mis à jour — Escarpin Naturel', time: 'Il y a 2 j' },
  ],
}
