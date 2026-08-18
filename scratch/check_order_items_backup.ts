import fs from "fs";
import path from "path";

const backupDir = path.join(__dirname, "../backups/json_export_latest");
const orderItems = JSON.parse(fs.readFileSync(path.join(backupDir, "OrderItem.json"), "utf8"));
const orders = JSON.parse(fs.readFileSync(path.join(backupDir, "Order.json"), "utf8"));
const menuItems = JSON.parse(fs.readFileSync(path.join(backupDir, "MenuItem.json"), "utf8"));

const orderIds = new Set(orders.map((o: any) => o.id));
const menuItemIds = new Set(menuItems.map((m: any) => m.id));

console.log("Total OrderItems in backup:", orderItems.length);

const invalidOrderId = orderItems.filter((oi: any) => !orderIds.has(oi.orderId));
const invalidMenuItemId = orderItems.filter((oi: any) => !menuItemIds.has(oi.menuItemId));

console.log("OrderItems with missing orderId in backup:", invalidOrderId.length);
console.log("OrderItems with missing menuItemId in backup:", invalidMenuItemId.length);

if (invalidMenuItemId.length > 0) {
  console.log("Sample missing menuItemId items:", invalidMenuItemId);
}
