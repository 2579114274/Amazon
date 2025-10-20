
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LocalCurrency as Currency } from '@/api/localEntities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, DollarSign, Star } from 'lucide-react';

export default function CurrencyManagement() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    exchange_rate: 1.0,
    is_default: false
  });

  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    setLoading(true);
    try {
      const list = await Currency.list('-created_date');
      setCurrencies(list);
    } catch (e) {
      console.error('Failed to load currencies:', e);
    }
    setLoading(false);
  };

  const handleEdit = (c) => {
    setEditingCurrency(c);
    setFormData({
      code: c.code || '',
      name: c.name || '',
      symbol: c.symbol || '',
      exchange_rate: c.exchange_rate ?? 1.0,
      is_default: !!c.is_default
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCurrency(null);
    setFormData({
      code: '',
      name: '',
      symbol: '',
      exchange_rate: 1.0,
      is_default: false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个货币吗？')) return;
    try {
      await Currency.delete(id);
      loadCurrencies();
    } catch (e) {
      console.error('Delete failed:', e);
      alert('删除失败，请重试');
    }
  };

  const handleSetDefault = async (currency) => {
    try {
      // 先取消其他默认
      const currentDefaults = currencies.filter(c => c.is_default && c.id !== currency.id);
      await Promise.all(currentDefaults.map(c => Currency.update(c.id, { ...c, is_default: false })));
      // 设置当前为默认
      await Currency.update(currency.id, { ...currency, is_default: true });
      loadCurrencies();
    } catch (e) {
      console.error('Set default failed:', e);
      alert('设置默认货币失败，请重试');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 若设置为默认，同时取消其他默认
      if (formData.is_default) {
        const currentDefaults = currencies.filter(c => c.is_default && c.id !== (editingCurrency?.id || ''));
        await Promise.all(currentDefaults.map(c => Currency.update(c.id, { ...c, is_default: false })));
      }
      if (editingCurrency) {
        await Currency.update(editingCurrency.id, formData);
      } else {
        await Currency.create(formData);
      }
      setIsDialogOpen(false);
      loadCurrencies();
    } catch (e) {
      console.error('Save failed:', e);
      alert('保存失败，请重试');
    }
  };

  const commonCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  ];

  // The `fillCommon` function is no longer directly used by the common currency buttons,
  // as the logic is now inline in the `onClick` handler.
  // const fillCommon = (c) => {
  //   setFormData({
  //     code: c.code,
  //     name: c.name,
  //     symbol: c.symbol,
  //     exchange_rate: c.rate,
  //     is_default: false
  //   });
  // };

  return (
    <div className="p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-indigo-600" />
            Currency Management
          </h1>
          <p className="text-gray-500 mt-1">Manage supported currencies, exchange rates, and default currency.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Currency
          </Button>
        </div>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Common Currencies</CardTitle>
          <CardDescription>Click to prefill the form, then save.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {commonCurrencies.map((c) => (
            <Button
              key={c.code}
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingCurrency(null); // Clear editing state for a new entry
                setFormData({
                  code: (c.code || '').toUpperCase(),
                  name: c.name || '',
                  symbol: c.symbol || '',
                  exchange_rate: c.rate ?? 1.0, // Use nullish coalescing for rate
                  is_default: false // Common currencies are not default by prefill
                });
                setIsDialogOpen(true); // Open the dialog after prefilling
              }}
            >
              {c.symbol} {c.code}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Currencies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Exchange Rate</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.code}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.symbol}</TableCell>
                    <TableCell>{Number(c.exchange_rate || 0).toFixed(4)}</TableCell>
                    <TableCell>
                      {c.is_default ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full text-xs">
                          <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          Default
                        </span>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(c)}>
                          <Star className="w-4 h-4 mr-1" /> Set Default
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(c.id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {currencies.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No currencies yet. Click "Add Currency" to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCurrency ? 'Edit Currency' : 'Add Currency'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g., USD" required />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., US Dollar" required />
              </div>
              <div>
                <Label htmlFor="symbol">Symbol</Label>
                <Input id="symbol" value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} placeholder="$ / ¥ / €" required />
              </div>
              <div>
                <Label htmlFor="exchange_rate">Exchange Rate</Label>
                <Input id="exchange_rate" type="number" step="0.0001" value={formData.exchange_rate} onChange={(e) => setFormData({ ...formData, exchange_rate: parseFloat(e.target.value) || 0 })} required />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Switch id="is_default" checked={formData.is_default} onCheckedChange={(checked) => setFormData({ ...formData, is_default: !!checked })} />
                <Label htmlFor="is_default">Set as Default</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingCurrency ? 'Save' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
