// Restaurant order logic

import { MENU, getMenuItemPrice } from './menu.js';

export function assignOrders(customers) {
  if (!customers) return;
  for (const customer of customers) {
    if (!customer.order) {
      // Each customer orders 1-3 items
      const orderCount = 1 + Math.floor(Math.random() * 3);
      const shuffled = MENU.slice().sort(() => Math.random() - 0.5);
      customer.order = shuffled.slice(0, orderCount).map(item => item.name);
    }
  }
}

export function getOrderTotal(order) {
  if (!order) return 0;
  return order.reduce((sum, name) => sum + getMenuItemPrice(name), 0);
} 