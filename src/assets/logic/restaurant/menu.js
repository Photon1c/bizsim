// Restaurant menu and pricing

export const MENU = [
  { name: 'Pasta', price: 14 },
  { name: 'Chicken Wings', price: 12 },
  { name: 'Tea', price: 3 },
  { name: 'Coffee', price: 4 },
  { name: 'Soda', price: 3 },
  { name: 'Water', price: 0 },
  { name: 'Steak', price: 22 },
  { name: 'Salad', price: 9 },
  { name: 'Burger', price: 13 },
  { name: 'Fish', price: 18 },
  { name: 'Pizza', price: 15 },
  { name: 'Soup', price: 7 }
];

export function getMenuItemPrice(name) {
  const item = MENU.find(i => i.name === name);
  return item ? item.price : 0;
} 