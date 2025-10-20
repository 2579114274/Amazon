import React, { useState, useEffect } from 'react';
import { LocalOrder as Order } from '@/api/localEntities';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const orderList = await Order.list('-created_date');
      setOrders(orderList);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
    setLoading(false);
  };
  
  const handleStatusChange = async (orderId, newStatus) => {
    await Order.update(orderId, { order_status: newStatus });
    loadOrders();
  };

  const renderOrderTable = () => (
    <div className="hidden md:block">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>{order.product_name}</TableCell>
                <TableCell>${Number(order.total_price || 0).toFixed(2)}</TableCell>
                <TableCell>{new Date(order.created_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select value={order.order_status} onValueChange={(value) => handleStatusChange(order.id, value)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderOrderCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {orders.map(order => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle className="text-base">{order.product_name}</CardTitle>
            <p className="text-xs text-gray-500 font-mono pt-1">{order.id}</p>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">${Number(order.total_price || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-600">
              {new Date(order.created_date).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter>
            <Select value={order.order_status} onValueChange={(value) => handleStatusChange(order.id, value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-500 mt-1">View and manage all customer orders</p>
      </header>

      {loading ? <p>Loading...</p> : (
        <>
          {renderOrderTable()}
          {renderOrderCards()}
        </>
      )}
    </div>
  );
}