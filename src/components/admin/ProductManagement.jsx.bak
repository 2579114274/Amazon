import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Package, Upload, Save, X, Video, Image as ImageIcon, Star, Settings, Trash, MessageCircle, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocalProduct as Product } from '@/api/localEntities';
import { UploadFile, InvokeLLM } from '@/api/localIntegrations';
import { LocalCategory as Category, LocalGeminiSettings } from '@/api/localEntities';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { createPageUrl } from '@/utils';
import ShopifyImporter from './ShopifyImporter';
import { GeminiGenerate } from '@/api/integrations';

function sanitizeShortDescription(text) {
  const raw = String(text || '');
  // Remove markdown, headings, bullets
  let t = raw
    .replace(/\*\*|__/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\(.*?\)/g, (m) => (m.length <= 30 ? m : ''))
    .replace(/\s+/g, ' ')
    .trim();
  // Remove obvious section headers and leading enumerations
  t = t.replace(/^(Short\s*Description|概要|简介)\s*[:：-]?\s*/i, '');
  t = t.replace(/^\d+\)\s*Customer\s*Reviews\s*[:：-]?\s*/i, '');
  t = t.replace(/^\d+\)\s*Review\s*\d*\s*[:：-]?\s*/i, '');
  // Cut off content after review markers
  const markers = [
    /Customer\s+Reviews/i,
    /Reviews?:/i,
    /\d+\)\s*Review/i,
    /\d+\)\s/
  ];
  let cutIdx = -1;
  for (const r of markers) {
    const m = t.search(r);
    if (m >= 0 && (cutIdx === -1 || m < cutIdx)) cutIdx = m;
  }
  if (cutIdx >= 0) t = t.slice(0, cutIdx).trim();
  // Fallback if empty: take first sentence or up to 120 chars from raw-processed text
  if (!t) {
    let plain = raw
      .replace(/\*\*|__/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const dot = plain.indexOf('.');
    t = (dot > 0 ? plain.slice(0, dot + 1) : plain.slice(0, 120)).trim();
  }
  // Ensure length <= 120 and prefer sentence end
  if (t.length > 120) {
    const dot = t.lastIndexOf('.', 120);
    t = (dot > 60 ? t.slice(0, dot + 1) : t.slice(0, 120)).trim();
  }
  return t;
}

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBatchEditModal, setShowBatchEditModal] = useState(false);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState(false);
  const [batchEditData, setBatchEditData] = useState({});
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isGeneratingReviews, setIsGeneratingReviews] = useState(false);
  const [isDeletingReviews, setIsDeletingReviews] = useState(false);
  const [isAiUpdating, setIsAiUpdating] = useState(false);
  const [useGeminiForAI, setUseGeminiForAI] = useState(false);
  const [geminiReady, setGeminiReady] = useState(false);
  const [error, setError] = useState(null);

  function getInitialFormData() {
    return {
      name: '',
      store_link: '',
      description: '',
      short_description: '',
      price: '',
      original_price: '',
      brand: '',
      stock_quantity: '',
      images: [],
      specifications: [],
      variants: [],
      technical_details: {},
      about_this_item: [''],
      rating: 4.6,
      review_count: 100,
      social_proof: '100+ bought in past month',
      is_choice: true,
      is_active: true,
      is_featured: false,
      related_product_ids: [],
      videos: [],
      customer_q_and_a: [],
      generated_reviews: [],
      add_to_cart_url: '',
      buy_now_url: '',
      category: '',
      category_id: ''
    };
  }

  useEffect(() => {
    loadProducts();
    loadCategories();
    (async () => {
      try {
        const list = await LocalGeminiSettings.list();
        const s = list[0];
        setUseGeminiForAI(!!s?.use_for_product_ai);
        setGeminiReady(Boolean(s?.api_key));
      } catch {}
    })();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
    const productList = await Product.list('-created_date');
      setProducts(productList || []);
    setSelectedProducts([]);
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
      setError(err?.message || '加载商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const list = await Category.list();
    // 排序：sort_order 正序，其次按名称
    const sorted = list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || String(a.name || '').localeCompare(String(b.name || '')));
    setCategories(sorted);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...getInitialFormData(),
      ...product,
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      stock_quantity: (product.stock_quantity ?? product.stock ?? 0).toString(),
      images: product.images && product.images.length ? product.images : (product.gallery || []),
      specifications: product.specifications || [],
      variants: product.variants || [],
      technical_details: product.technical_details || {},
      about_this_item: product.about_this_item && product.about_this_item.length > 0 ? product.about_this_item : [''],
      rating: product.rating ?? 4.6,
      review_count: product.review_count ?? product.reviews_count ?? 100,
      social_proof: product.social_proof ?? '100+ bought in past month',
      is_choice: product.is_choice ?? true,
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      customer_q_and_a: product.customer_q_and_a || [],
      generated_reviews: product.generated_reviews || [],
      add_to_cart_url: product.add_to_cart_url || '',
      buy_now_url: product.buy_now_url || '',
      category: product.category || '',
      category_id: product.category_id || '',
      short_description: product.short_description || ''
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData(getInitialFormData());
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await Product.delete(id);
      loadProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill in product name and price.');
      return;
    }
    setSaving(true);
    try {
      const numericPrice = parseFloat(formData.price) || 0;
      const numericOriginal = formData.original_price ? parseFloat(formData.original_price) : undefined;
      const numericStock = parseInt(formData.stock_quantity) || 0;
      const numericRating = parseFloat(formData.rating) || 4.6;
      const numericReviewCount = parseInt(formData.review_count) || 100;

      const gallery = (formData.images || []).filter(Boolean);
      const image_url = gallery[0] || formData.image_url || '';

      const productData = {
        ...formData,
        price: numericPrice,
        original_price: numericOriginal,
        stock_quantity: numericStock,
        stock: numericStock,                 // 同步到前台字段
        rating: numericRating,
        review_count: numericReviewCount,    // 后台字段
        reviews_count: numericReviewCount,   // 前台字段
        images: gallery,
        gallery,
        image_url,
        about_this_item: (formData.about_this_item || []).filter(item => String(item).trim() !== ''),
        short_description: formData.short_description || ''
      };

      if (editingProduct) {
        await Product.update(editingProduct.id, productData);
      } else {
        await Product.create(productData);
      }
      setIsDialogOpen(false);
      loadProducts();
      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (error) {
      console.error("Failed to save product:", error);
      alert('Save failed, please try again.');
    }
    setSaving(false);
  };

  const handleFileUpload = async (e, field, index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      if (field === 'images') {
        const newImages = [...formData.images];
        if (index !== null) {
          newImages[index] = file_url;
        } else {
          newImages.push(file_url);
        }
        setFormData({ ...formData, images: newImages });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload failed!");
    }
    setUploading(false);
  };

  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { name: '', options: [''] }]
    });
  };

  const updateSpecification = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
    generateVariants(newSpecs);
  };

  const addSpecOption = (specIndex) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].options.push('');
    setFormData({ ...formData, specifications: newSpecs });
  };

  const updateSpecOption = (specIndex, optionIndex, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].options[optionIndex] = value;
    setFormData({ ...formData, specifications: newSpecs });
    generateVariants(newSpecs);
  };

  const removeSpecOption = (specIndex, optionIndex) => {
    const newSpecs = [...formData.specifications];
    newSpecs[specIndex].options.splice(optionIndex, 1);
    setFormData({ ...formData, specifications: newSpecs });
    generateVariants(newSpecs);
  };

  const removeSpecification = (index) => {
    const newSpecs = [...formData.specifications];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specifications: newSpecs });
    generateVariants(newSpecs);
  };

  const cartesianProduct = (arrays) => {
    return arrays.reduce((acc, curr) => {
      const result = [];
      acc.forEach(a => {
        curr.forEach(c => {
          result.push([...a, c]);
        });
      });
      return result;
    }, [[]]);
  };

  const generateVariants = (specs) => {
    if (!specs || specs.length === 0) {
      setFormData(prev => ({ ...prev, variants: [] }));
      return;
    }
    const validSpecs = specs.filter(spec => spec.name.trim() && spec.options.some(opt => opt.trim())).map(spec => ({
      ...spec,
      options: spec.options.filter(opt => opt.trim())
    }));
    if (validSpecs.length === 0) {
      setFormData(prev => ({ ...prev, variants: [] }));
      return;
    }
    const combinations = cartesianProduct(validSpecs.map(spec => spec.options));
    const newVariants = combinations.map((combination) => {
      const existingVariant = formData.variants.find(variant => {
        return validSpecs.every((spec, specIndex) => variant[`option${specIndex + 1}`] === combination[specIndex]);
      });
      return existingVariant || {
        sku: `${formData.name || 'PRODUCT'}-${combination.join('-')}`.replace(/\s+/g, '-').toUpperCase(),
        price: parseFloat(formData.price) || 0,
        original_price: parseFloat(formData.original_price) || 0,
        stock_quantity: 0,
        image: '',
        attributes: {},
        ...validSpecs.reduce((acc, spec, specIndex) => ({
          ...acc,
          [`option${specIndex + 1}`]: combination[specIndex]
        }), {})
      };
    });
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    if (field === 'price' || field === 'original_price') {
      newVariants[index][field] = parseFloat(value) || 0;
    } else if (field === 'stock_quantity') {
      newVariants[index][field] = parseInt(value) || 0;
    } else if (field === 'attributes') {
      newVariants[index]['_attributes_raw'] = value;
      try {
        newVariants[index][field] = JSON.parse(value);
        delete newVariants[index]['_attributes_raw'];
      } catch (e) {
        newVariants[index][field] = {};
        console.error("Invalid JSON for attributes:", e);
      }
    } else {
      newVariants[index][field] = value;
    }
    setFormData({ ...formData, variants: newVariants });
  };

  const addTechnicalDetail = () => {
    const newKey = `Detail ${Object.keys(formData.technical_details).length + 1}`;
    setFormData({ ...formData, technical_details: { ...formData.technical_details, [newKey]: '' } });
  };

  const removeTechnicalDetail = (keyToRemove) => {
    const newDetails = { ...formData.technical_details };
    delete newDetails[keyToRemove];
    setFormData({ ...formData, technical_details: newDetails });
  };

  const updateTechnicalDetailKey = (oldKey, newKey) => {
    if (!newKey.trim() || newKey === oldKey) return;
    const detailsArray = Object.entries(formData.technical_details);
    const updatedDetailsArray = detailsArray.map(([key, value]) => {
      if (key === oldKey) return [newKey, value];
      return [key, value];
    }).filter(([key], index, self) => self.findIndex(([k]) => k === key) === index);
    const newDetailsObject = Object.fromEntries(updatedDetailsArray);
    setFormData({ ...formData, technical_details: newDetailsObject });
  };

  const updateTechnicalDetailValue = (key, value) => {
    setFormData({ ...formData, technical_details: { ...formData.technical_details, [key]: value } });
  };

  const addAboutItem = () => {
    setFormData({ ...formData, about_this_item: [...formData.about_this_item, ''] });
  };

  const removeAboutItem = (index) => {
    const newItems = formData.about_this_item.filter((_, i) => i !== index);
    setFormData({ ...formData, about_this_item: newItems });
  };

  const updateAboutItem = (index, value) => {
    const newItems = [...formData.about_this_item];
    newItems[index] = value;
    setFormData({ ...formData, about_this_item: newItems });
  };

  const handleGenerateQA = async () => {
    if (!formData.name) {
      alert("Please enter a product name first.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await InvokeLLM({
        prompt: `Generate 5 common customer questions and answers for the following product.\nProduct Name: ${formData.name}\nDescription: ${String(formData.description || '').replace(/<[^>]*>/g, '')}`,
        response_json_schema: {
          "type": "object",
          "properties": {
            "q_and_a": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": { "question": { "type": "string" }, "answer": { "type": "string" } },
                "required": ["question", "answer"]
              }
            }
          },
          "required": ["q_and_a"]
        }
      });
      setFormData(prev => ({ ...prev, customer_q_and_a: result.q_and_a }));
    } catch (error) {
      alert("AI Q&A generation failed: " + error.message);
    }
    setIsGenerating(false);
  };

  const addManualQA = () => {
    setFormData(prev => ({ ...prev, customer_q_and_a: [...prev.customer_q_and_a, { question: '', answer: '' }] }));
  };

  const updateQA = (index, field, value) => {
    const newQA = [...formData.customer_q_and_a];
    newQA[index][field] = value;
    setFormData({ ...formData, customer_q_and_a: newQA });
  };

  const removeQA = (index) => {
    const newQA = [...formData.customer_q_and_a];
    newQA.splice(index, 1);
    setFormData({ ...formData, customer_q_and_a: newQA });
  };

  const handleGenerateReviews = async () => {
    if (!formData.name) {
      alert("Please enter a product name first.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await InvokeLLM({
        prompt: `Generate 5 customer reviews for the product "${formData.name}". Each review needs a user_name, a rating between 4 and 5, a title, and content.`,
        response_json_schema: {
          "type": "object",
          "properties": {
            "reviews": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": { "user_name": { "type": "string" }, "rating": { "type": "number" }, "title": { "type": "string" }, "content": { "type": "string" } },
                "required": ["user_name", "rating", "title", "content"]
              }
            }
          },
          "required": ["reviews"]
        }
      });
      const reviewsWithImages = (result.reviews || []).map(review => ({
        ...review,
        user_name: generateRandomUserName(),
        image_url: (formData.images || [])[Math.floor(Math.random() * (formData.images || []).length)] || ''
      }));
      setFormData(prev => ({ ...prev, generated_reviews: reviewsWithImages }));
    } catch (error) {
      alert("AI review generation failed: " + error.message);
    }
    setIsGenerating(false);
  };

  const addManualReview = () => {
    setFormData(prev => ({ ...prev, generated_reviews: [...prev.generated_reviews, { user_name: '', rating: 5, title: '', content: '', image_url: '' }] }));
  };

  const updateReview = (index, field, value) => {
    const newReviews = [...formData.generated_reviews];
    if (field === 'rating') {
      newReviews[index][field] = parseInt(value);
    } else {
      newReviews[index][field] = value;
    }
    setFormData({ ...formData, generated_reviews: newReviews });
  };

  const removeReview = (index) => {
    const newReviews = [...formData.generated_reviews];
    newReviews.splice(index, 1);
    setFormData({ ...formData, generated_reviews: newReviews });
  };

  const generateRandomUserName = () => {
    const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Christopher', 'Ashley', 'Matthew', 'Amanda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  };

  const filteredProducts = products.filter(p => String(p.name || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const handleImportComplete = () => {
    loadProducts();
    setShowImporter(false);
    setSearchTerm('');
  };

  const handleSelectProduct = (productId, isSelected) => {
    const bool = !!isSelected && isSelected !== 'indeterminate';
    setSelectedProducts(prev => bool ? [...prev, productId] : prev.filter(id => id !== productId));
  };

  const handleSelectAll = (isSelected) => {
    const bool = !!isSelected && isSelected !== 'indeterminate';
    if (bool) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleBatchUpdate = async () => {
    if (selectedProducts.length === 0) return;
    setIsBatchUpdating(true);
    try {
      const dataToUpdate = {};
      Object.keys(batchEditData).forEach(key => {
        if (['price', 'stock_quantity', 'original_price'].includes(key)) {
          if (batchEditData[key] !== '' && !isNaN(parseFloat(batchEditData[key]))) dataToUpdate[key] = parseFloat(batchEditData[key]);
        } else if (key === 'rating') {
          if (batchEditData[key] !== '' && !isNaN(parseFloat(batchEditData[key]))) dataToUpdate[key] = parseFloat(batchEditData[key]);
        } else if (key === 'review_count') {
          if (batchEditData[key] !== '' && !isNaN(parseInt(batchEditData[key]))) {
            dataToUpdate.review_count = parseInt(batchEditData[key]);
            dataToUpdate.reviews_count = parseInt(batchEditData[key]);
          }
        } else if (key === 'category_id' || key === 'category') {
          if (batchEditData[key] !== '') {
            dataToUpdate[key] = batchEditData[key];
          }
        } else if (batchEditData[key] !== '' && batchEditData[key] !== null && batchEditData[key] !== undefined) {
          dataToUpdate[key] = batchEditData[key];
        }
      });
      if (dataToUpdate.stock_quantity !== undefined) {
        dataToUpdate.stock = dataToUpdate.stock_quantity;
      }
      if (Object.keys(dataToUpdate).length === 0) {
        alert("Please fill in fields to batch update.");
        setIsBatchUpdating(false);
        return;
      }
      await Promise.all(selectedProducts.map(id => Product.update(id, dataToUpdate)));
      alert(`Successfully updated ${selectedProducts.length} products!`);
    } catch (error) {
      console.error("Batch update failed:", error);
      alert(`Batch update failed: ${error.message || 'Unknown error'}`);
    }
    setIsBatchUpdating(false);
    setShowBatchEditModal(false);
    setBatchEditData({});
    loadProducts();
  };

  const handleBatchGenerateReviews = async () => {
    if (selectedProducts.length === 0) return;
    setIsGeneratingReviews(true);
    try {
      const updates = await Promise.all(selectedProducts.map(async (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;
        try {
          const result = await InvokeLLM({
            prompt: `Generate 5 realistic customer reviews for "${product.name}". Each review needs a user name, a rating between 4 and 5, a title, and content. Reviews should be diverse, with positive and neutral feedback.`,
            response_json_schema: {
              "type": "object",
              "properties": {
                "reviews": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": { "user_name": { "type": "string" }, "rating": { "type": "number" }, "title": { "type": "string" }, "content": { "type": "string" } },
                    "required": ["user_name", "rating", "title", "content"]
                  }
                }
              },
              "required": ["reviews"]
            }
          });
          const reviewsWithImages = (result.reviews || []).map(review => ({
            ...review,
            user_name: generateRandomUserName(),
            image_url: (product.images && product.images.length > 0 ? product.images : (product.gallery || [])).length > 0 ? (product.images && product.images.length > 0 ? product.images : (product.gallery || []))[Math.floor(Math.random() * ((product.images && product.images.length > 0 ? product.images : (product.gallery || [])).length))] : ''
          }));
          const newRating = reviewsWithImages.length > 0 ? reviewsWithImages.reduce((sum, r) => sum + r.rating, 0) / reviewsWithImages.length : 4.6;
          return Product.update(productId, { generated_reviews: reviewsWithImages, review_count: reviewsWithImages.length, reviews_count: reviewsWithImages.length, rating: newRating });
        } catch (error) {
          console.error(`Failed to generate reviews for product ${product.name}:`, error);
          return null;
        }
      }));
      const successCount = updates.filter(Boolean).length;
      alert(`Successfully generated reviews for ${successCount} products!`);
    } catch (error) {
      console.error("Batch review generation failed:", error);
      alert(`Batch review generation failed: ${error.message || 'Unknown error'}`);
    }
    setIsGeneratingReviews(false);
    setShowBatchEditModal(false);
    loadProducts();
  };

  const handleBatchDeleteReviews = async () => {
    if (selectedProducts.length === 0) return;
    setIsDeletingReviews(true);
    try {
      await Promise.all(selectedProducts.map(productId => Product.update(productId, { generated_reviews: [], review_count: 0, reviews_count: 0, rating: 4.6 })));
      alert(`Successfully deleted all reviews for ${selectedProducts.length} products!`);
    } catch (error) {
      console.error("Batch review deletion failed:", error);
      alert(`Batch review deletion failed: ${error.message || 'Unknown error'}`);
    }
    setIsDeletingReviews(false);
    setShowBatchEditModal(false);
    loadProducts();
  };

  const handleBatchDelete = async () => {
    if (selectedProducts.length === 0) return;
    setIsBatchDeleting(true);
    try {
      await Promise.all(selectedProducts.map(id => Product.delete(id)));
      alert(`Successfully deleted ${selectedProducts.length} products!`);
    } catch (error) {
      console.error("Batch deletion failed:", error);
      alert(`Batch deletion failed: ${error.message || 'Unknown error'}`);
    }
    setIsBatchDeleting(false);
    setShowBatchDeleteModal(false);
    loadProducts();
  };

  const handleBatchAiUpdate = async () => {
    if (selectedProducts.length === 0) return;
    setIsAiUpdating(true);
    try {
      const updates = await Promise.all(selectedProducts.map(async (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return null;
        let result;
        if (useGeminiForAI && geminiReady) {
          try {
            const productContext = `title: ${product.name}\nbrand: ${product.brand || ''}\ncategory: ${product.category || ''}\ntags: ${(product.tags || []).join(', ')}`;
            const details = String(product.description || '').replace(/<[^>]*>/g, '');
            const prompt = `You are a product copy expert. Based on the following product context, write tailored copy that is unique to THIS product. Avoid generic phrases and ensure the copy reflects the title/brand/category.\n\nContext:\n${productContext}\n\nDetails (HTML stripped):\n${details}\n\nReturn ONLY strict JSON (no markdown, no extra text) matching exactly this schema and constraints:\n{ "short_description": string(<=120 chars, catchy, benefits-first, incorporate title or brand or a concrete attribute, one sentence, no quotes), "social_proof": string(optional, <=60 chars) }`;
            const r = await GeminiGenerate({ prompt });
            const txt = r.text || '';
            let parsed = null;
            try {
              const start = txt.indexOf('{');
              const end = txt.lastIndexOf('}');
              if (start !== -1 && end !== -1 && end > start) {
                parsed = JSON.parse(txt.slice(start, end + 1));
              }
            } catch {}
            if (parsed && typeof parsed === 'object') {
              result = {
                reviews: [],
                social_proof: String(parsed.social_proof || ''),
                short_description: sanitizeShortDescription(parsed.short_description)
              };
            } else {
              result = { reviews: [], social_proof: '', short_description: sanitizeShortDescription(txt) };
            }
          } catch (ge) {
            console.warn('Gemini failed, falling back to local:', ge);
            const productContext = `title: ${product.name}\nbrand: ${product.brand || ''}\ncategory: ${product.category || ''}\ntags: ${(product.tags || []).join(', ')}`;
            const details = String(product.description || '').replace(/<[^>]*>/g, '');
            result = await InvokeLLM({
              prompt: `For THIS product, generate tailored copy that reflects its title/brand/category (avoid generic phrasing).\n\nContext:\n${productContext}\n\nDetails (HTML stripped):\n${details}\n\nGenerate:\n1) 5 realistic customer reviews (English names, 4-5 star rating, title, and content).\n2) One social_proof (<=60 chars).\n3) A concise short_description: 1 sentence, <= 120 characters, catchy, benefits-first, and incorporate title or brand or a concrete attribute.`,
            response_json_schema: {
                type: 'object',
                properties: {
                  reviews: { type: 'array', items: { type: 'object', properties: { user_name: { type: 'string' }, rating: { type: 'number' }, title: { type: 'string' }, content: { type: 'string' } } } },
                  social_proof: { type: 'string' },
                  short_description: { type: 'string' }
                },
                required: ['reviews', 'social_proof']
              }
            });
            if (result && result.short_description) {
              result.short_description = sanitizeShortDescription(result.short_description);
            }
          }
        } else {
          const productContext = `title: ${product.name}\nbrand: ${product.brand || ''}\ncategory: ${product.category || ''}\ntags: ${(product.tags || []).join(', ')}`;
          const details = String(product.description || '').replace(/<[^>]*>/g, '');
          result = await InvokeLLM({
            prompt: `For THIS product, generate tailored copy that reflects its title/brand/category (avoid generic phrasing).\n\nContext:\n${productContext}\n\nDetails (HTML stripped):\n${details}\n\nGenerate:\n1) 5 realistic customer reviews (English names, 4-5 star rating, title, and content).\n2) One social_proof (<=60 chars).\n3) A concise short_description: 1 sentence, <= 120 characters, catchy, benefits-first, and incorporate title or brand or a concrete attribute.`,
            response_json_schema: {
              type: 'object',
              properties: {
                reviews: { type: 'array', items: { type: 'object', properties: { user_name: { type: 'string' }, rating: { type: 'number' }, title: { type: 'string' }, content: { type: 'string' } } } },
                social_proof: { type: 'string' },
                short_description: { type: 'string' }
              },
              required: ['reviews', 'social_proof']
            }
          });
          if (result && result.short_description) {
            result.short_description = sanitizeShortDescription(result.short_description);
          }
        }
        const imgs = (product.images && product.images.length ? product.images : (product.gallery || []));
          const reviewsWithEnglishNames = (result.reviews || []).map(review => ({
            ...review,
            user_name: generateRandomUserName(),
          rating: Math.max(4, Math.min(5, review.rating || 5)),
            image_url: imgs.length ? imgs[Math.floor(Math.random() * imgs.length)] : ''
          }));
          const avgRating = reviewsWithEnglishNames.length ? reviewsWithEnglishNames.reduce((sum, r) => sum + r.rating, 0) / reviewsWithEnglishNames.length : 4.6;
        const reviewCount = reviewsWithEnglishNames.length || (Math.floor(Math.random() * 400) + 100);
          const updateData = {
            generated_reviews: reviewsWithEnglishNames,
            social_proof: result.social_proof || '100+ bought in past month',
            rating: parseFloat(avgRating.toFixed(1)),
            review_count: reviewCount,
            reviews_count: reviewCount,
            is_choice: true,
            is_active: true,
          short_description: sanitizeShortDescription(result.short_description || product.short_description || '')
          };
        await Product.update(productId, updateData);
        return true;
      }));
      const successCount = updates.filter(Boolean).length;
      alert(`Successfully updated ${successCount} products with ${useGeminiForAI && geminiReady ? 'Gemini' : 'AI'}!`);
      loadProducts();
    } catch (error) {
      console.error("Batch AI update failed:", error);
      alert(`Batch AI update failed: ${error.message || 'Unknown error'}`);
    }
    setIsAiUpdating(false);
  };

  const isAllSelected = filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length;

  const renderProductTable = () => (
    <div className="hidden md:block">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>Product Info</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox checked={selectedProducts.includes(product.id)} onCheckedChange={(checked) => handleSelectProduct(product.id, checked)} />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img
                      src={(product.images && product.images[0]) || (product.gallery && product.gallery[0]) || product.image_url || 'https://via.placeholder.com/40'}
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.brand}</div>
                      {product.variants && product.variants.length > 0 && (<div className="text-xs text-blue-600">{product.variants.length} variants</div>)}
                      {product.category && (<div className="text-xs text-purple-600">Category: {categories.find(cat => cat.id === product.category_id)?.name || product.category}</div>)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">${Number(product.price || 0).toFixed(2)}</div>
                  {product.original_price ? (<div className="text-sm text-gray-500 line-through">${Number(product.original_price).toFixed(2)}</div>) : null}
                </TableCell>
                <TableCell>{product.stock_quantity ?? product.stock ?? 0}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge className={(product.is_active ?? true) ? 'bg-emerald-600' : 'bg-gray-500'}>{(product.is_active ?? true) ? 'Active' : 'Inactive'}</Badge>
                    {product.is_featured ? <Badge className="bg-indigo-600">Featured</Badge> : null}
                    {product.is_choice ? <Badge className="bg-orange-100 text-orange-800">Choice</Badge> : null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <a href={createPageUrl(`ProductDetail?id=${product.id}`)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><Eye className="w-4 h-4 text-blue-500" /></Button>
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );

  const renderProductCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {filteredProducts.map(product => (
        <Card key={product.id} className="relative">
          <div className="absolute top-4 left-4 z-10">
            <Checkbox className="bg-white" checked={selectedProducts.includes(product.id)} onCheckedChange={(checked) => handleSelectProduct(product.id, checked)} />
          </div>
          <CardHeader>
            <img
              src={(product.images && product.images[0]) || (product.gallery && product.gallery[0]) || product.image_url || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-32 rounded-md object-cover mb-4"
            />
            <CardTitle className="text-base">{product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold">${Number(product.price || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Stock: {product.stock_quantity ?? product.stock ?? 0}</p>
            {product.variants && product.variants.length > 0 && (<p className="text-xs text-blue-600">{product.variants.length} variants</p>)}
            {product.category && (<p className="text-xs text-purple-600">Category: {categories.find(cat => cat.id === product.category_id)?.name || product.category}</p>)}
            <div className="flex gap-1">
              <Badge className={(product.is_active ?? true) ? 'bg-emerald-600' : 'bg-gray-500'}>{(product.is_active ?? true) ? 'Active' : 'Inactive'}</Badge>
              {product.is_featured && <Badge className="bg-indigo-600">Featured</Badge>}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <a href={createPageUrl(`ProductDetail?id=${product.id}`)} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">View</Button></a>
              <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderProductForm = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Basic Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label htmlFor="name">Product Name *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter product name" required /></div>
              <div className="space-y-2"><Label htmlFor="store_link">Store Link</Label><Input id="store_link" value={formData.store_link} onChange={(e) => setFormData({ ...formData, store_link: e.target.value })} placeholder="Store name or link" /></div>
              <div className="space-y-2"><Label htmlFor="price">Current Price *</Label><Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" required /></div>
              <div className="space-y-2"><Label htmlFor="original_price">Original Price</Label><Input id="original_price" type="number" step="0.01" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} placeholder="0.00" /></div>
              <div className="space-y-2"><Label htmlFor="brand">Brand</Label><Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="Product brand" /></div>
              <div className="space-y-2"><Label htmlFor="stock_quantity">Stock Quantity</Label><Input id="stock_quantity" type="number" value={formData.stock_quantity} onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} placeholder="0" /></div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter detailed product description, supports rich text via HTML tags..."
                  rows={6}
                  className="resize-vertical"
                />
                <p className="text-sm text-gray-500">You can use HTML tags for formatting (e.g., &lt;b&gt;, &lt;ul&gt;, &lt;a&gt;).</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="A concise 1–2 sentence blurb (max ~120 characters)"
                  rows={3}
                />
                <p className="text-xs text-gray-500">用于前台简短介绍，也可通过"AI 全量更新"自动生成。</p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex items-center gap-2">
                  <Select
                    value={formData.category_id || ''}
                    onValueChange={(id) => {
                      const cat = categories.find(c => c.id === id);
                      setFormData({
                        ...formData,
                        category_id: id,
                        category: cat?.slug || ''
                      });
                    }}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.category_id && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, category_id: '', category: '' })}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* WooCommerce Integration 已移除 */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />Technical Details</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><Label className="text-base font-semibold">Add product technical details</Label><Button type="button" onClick={addTechnicalDetail} size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Add Detail</Button></div>
                {Object.entries(formData.technical_details).length === 0 ? (<p className="text-sm text-gray-500 italic">No technical details added. Click "Add Detail" to start.</p>) : (<div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">{Object.entries(formData.technical_details).map(([key, value]) => (<div key={key} className="flex gap-2 items-start"><div className="flex-1"><Input placeholder="Detail name (e.g., Brand, Color, Weight)" value={key} onChange={(e) => updateTechnicalDetailKey(key, e.target.value)} className="mb-1" /><Input placeholder="Detail value" value={value} onChange={(e) => updateTechnicalDetailValue(key, e.target.value)} /></div><Button type="button" onClick={() => removeTechnicalDetail(key)} size="icon" variant="ghost" className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></Button></div>))}</div>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5" />About This Item</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><Label className="text-base font-semibold">Add product highlights or features</Label><Button type="button" variant="outline" size="sm" onClick={addAboutItem}><Plus className="w-4 h-4 mr-1" />Add Highlight</Button></div>
                <div className="space-y-2">{formData.about_this_item.map((item, index) => (<div key={index} className="flex gap-2 items-center"><Input value={item} onChange={(e) => updateAboutItem(index, e.target.value)} placeholder={`Highlight ${index + 1}`} className="flex-1" /><Button type="button" variant="ghost" size="icon" onClick={() => removeAboutItem(index)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button></div>))}</div>
                {formData.about_this_item.length === 0 && (<p className="text-sm text-gray-500 italic">No highlights added. Click "Add Highlight" to start.</p>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />Attributes & Variants</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4"><Label className="text-base font-semibold">Product Attributes</Label><Button type="button" onClick={addSpecification} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" />Add Attribute</Button></div>
                {formData.specifications.map((spec, specIndex) => (<div key={specIndex} className="border rounded-lg p-4 mb-4"><div className="flex items-center gap-4 mb-3"><Input placeholder="Attribute name (e.g., Color)" value={spec.name} onChange={(e) => updateSpecification(specIndex, 'name', e.target.value)} className="flex-1" /><Button type="button" onClick={() => removeSpecification(specIndex)} variant="ghost" size="icon" className="text-red-500"><Trash className="w-4 h-4" /></Button></div><div className="space-y-2"><Label className="text-sm">Attribute Options:</Label>{spec.options.map((option, optionIndex) => (<div key={optionIndex} className="flex items-center gap-2"><Input placeholder="Option value (e.g., Red)" value={option} onChange={(e) => updateSpecOption(specIndex, optionIndex, e.target.value)} className="flex-1" /><Button type="button" variant="ghost" size="icon" onClick={() => removeSpecOption(specIndex, optionIndex)} className="text-red-500"><X className="w-4 h-4" /></Button></div>))}<Button type="button" onClick={() => addSpecOption(specIndex)} variant="outline" size="sm" className="mt-2"><Plus className="w-4 h-4 mr-2" />Add Option</Button></div></div>))}
              </div>
              {formData.variants.length > 0 && (
                <div>
                  <Label className="text-base font-semibold mb-4 block">Product Variants ({formData.variants.length})</Label>
                  <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4"> {/* Adjusted from 7 to 6 columns as WooCommerce Variant ID is removed */}
                          <div className="md:col-span-2">
                            <Label className="text-sm">Variant Combo</Label>
                            <div className="mt-1">
                              {formData.specifications.map((spec, specIndex) => (
                                <Badge key={specIndex} variant="outline" className="mr-2 mb-1">{spec.name}: {variant[`option${specIndex + 1}`]}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">SKU</Label>
                            <Input value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} placeholder="SKU" />
                          </div>
                          <div>
                            <Label className="text-sm">Price</Label>
                            <Input type="number" step="0.01" value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} placeholder="0.00" />
                          </div>
                          <div>
                            <Label className="text-sm">Original Price</Label>
                            <Input type="number" step="0.01" value={variant.original_price || ''} onChange={(e) => updateVariant(index, 'original_price', e.target.value)} placeholder="0.00" />
                          </div>
                          <div>
                            <Label className="text-sm">Stock</Label>
                            <Input type="number" value={variant.stock_quantity} onChange={(e) => updateVariant(index, 'stock_quantity', e.target.value)} placeholder="0" />
                          </div>
                          <div>
                            <Label className="text-sm">Variant Image</Label>
                            <Input value={variant.image} onChange={(e) => updateVariant(index, 'image', e.target.value)} placeholder="Image URL" />
                          </div>
                          <div className="md:col-span-2">
                            <Label className="text-sm">Attributes (JSON)</Label>
                            <Textarea
                              value={variant._attributes_raw !== undefined ? variant._attributes_raw : JSON.stringify(variant.attributes || {}, null, 2)}
                              onChange={(e) => updateVariant(index, 'attributes', e.target.value)}
                              placeholder='e.g.: {"color": "blue", "size": "M"}'
                              rows={3}
                            />
                            <p className="text-xs text-gray-500 mt-1">Enter valid JSON. Keys should be attribute slugs.</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5" />Customer Q&A and Reviews</CardTitle></CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="qa"><AccordionTrigger>Customer Q&A Management</AccordionTrigger><AccordionContent className="space-y-4"><div className="flex gap-2"><Button type="button" variant="outline" onClick={handleGenerateQA} disabled={isGenerating || !formData.name}>{isGenerating ? "Generating..." : "AI Generate"}</Button><Button type="button" variant="outline" onClick={addManualQA}><Plus className="w-4 h-4 mr-2" />Add Manually</Button></div><div className="space-y-4">{formData.customer_q_and_a?.map((qa, index) => (<div key={index} className="border rounded-lg p-4"><div className="flex justify-between items-start mb-3"><Label className="text-sm font-semibold">Q&A #{index + 1}</Label><Button type="button" variant="ghost" size="icon" onClick={() => removeQA(index)} className="text-red-500"><Trash className="w-4 h-4" /></Button></div><div className="space-y-3"><div><Label className="text-sm">Question</Label><Textarea value={qa.question} onChange={(e) => updateQA(index, 'question', e.target.value)} placeholder="Enter customer question..." rows={2} /></div><div><Label className="text-sm">Answer</Label><Textarea value={qa.answer} onChange={(e) => updateQA(index, 'answer', e.target.value)} placeholder="Enter answer..." rows={3} /></div></div></div>))}</div></AccordionContent></AccordionItem>
                <AccordionItem value="reviews"><AccordionTrigger>Customer Review Management</AccordionTrigger><AccordionContent className="space-y-4"><div className="flex gap-2"><Button type="button" variant="outline" onClick={handleGenerateReviews} disabled={isGenerating || !formData.name}>{isGenerating ? "Generating..." : "AI Generate"}</Button><Button type="button" variant="outline" onClick={addManualReview}><Plus className="w-4 h-4 mr-2" />Add Manually</Button></div><div className="space-y-4">{formData.generated_reviews?.map((review, index) => (<div key={index} className="border rounded-lg p-4"><div className="flex justify-between items-start mb-3"><Label className="text-sm font-semibold">Review #{index + 1}</Label><Button type="button" variant="ghost" size="icon" onClick={() => removeReview(index)} className="text-red-500"><Trash className="w-4 h-4" /></Button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><Label className="text-sm">User Name</Label><Input value={review.user_name} onChange={(e) => updateReview(index, 'user_name', e.target.value)} placeholder="User name" /></div><div><Label className="text-sm">Rating</Label><Select value={String(review.rating)} onValueChange={(value) => updateReview(index, 'rating', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">1 Star</SelectItem><SelectItem value="2">2 Stars</SelectItem><SelectItem value="3">3 Stars</SelectItem><SelectItem value="4">4 Stars</SelectItem><SelectItem value="5">5 Stars</SelectItem></SelectContent></Select></div><div className="md:col-span-2"><Label className="text-sm">Review Title</Label><Input value={review.title} onChange={(e) => updateReview(index, 'title', e.target.value)} placeholder="Review title" /></div><div className="md:col-span-2"><Label className="text-sm">Review Content</Label><Textarea value={review.content} onChange={(e) => updateReview(index, 'content', e.target.value)} placeholder="Review content..." rows={3} /></div><div className="md:col-span-2"><Label className="text-sm">Review Image URL</Label><Input value={review.image_url} onChange={(e) => updateReview(index, 'image_url', e.target.value)} placeholder="Image URL (optional)" /></div></div></div>))}</div></AccordionContent></AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="w-5 h-5" />Product Images</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 6 }).map((_, index) => (<div key={index} className="space-y-2"><Label>Image {index + 1}</Label><div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">{formData.images[index] ? (<div className="space-y-2"><img src={formData.images[index]} alt={`Product Image ${index + 1}`} className="w-full h-24 object-cover rounded" /><Button type="button" variant="outline" size="sm" onClick={() => { const newImages = [...formData.images]; newImages[index] = ''; setFormData({ ...formData, images: newImages }); }}>Remove</Button></div>) : (<div><Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" /><input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'images', index)} className="hidden" id={`image-${index}`} /><label htmlFor={`image-${index}`} className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">{uploading ? 'Uploading...' : 'Click to upload'}</label></div>)}</div></div>))}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" />Rating & Social Proof</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2"><Label htmlFor="rating">Rating (1-5)</Label><Input id="rating" type="number" min="1" max="5" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="review_count">Review Count</Label><Input id="review_count" type="number" value={formData.review_count} onChange={(e) => setFormData({ ...formData, review_count: e.target.value })} /></div>
              <div className="space-y-2"><Label htmlFor="social_proof">Social Proof</Label><Input id="social_proof" value={formData.social_proof} onChange={(e) => setFormData({ ...formData, social_proof: e.target.value })} placeholder="1K+ bought in past month" /></div>
              <div className="flex items-center space-x-2"><Switch id="is_choice" checked={formData.is_choice} onCheckedChange={(checked) => setFormData({ ...formData, is_choice: !!checked })} /><Label htmlFor="is_choice">Amazon's Choice</Label></div>
              <div className="flex items-center space-x-2"><Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => setFormData({ ...formData, is_featured: !!checked })} /><Label htmlFor="is_featured">Featured Product</Label></div>
              <div className="flex items-center space-x-2"><Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })} /><Label htmlFor="is_active">Active Status</Label></div>
            </CardContent>
          </Card>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" disabled={uploading || isGenerating || saving}><Save className="w-4 h-4 mr-2" />{saving ? 'Saving...' : (uploading ? 'Uploading...' : (isGenerating ? 'Generating...' : (editingProduct ? 'Update Product' : 'Create Product')))}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-600" />
            Product Management
          </h1>
          <p className="text-gray-500 mt-1">Create, edit, and organize your products.</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedProducts.length > 0 && (
            <>
              <Button onClick={() => setShowBatchEditModal(true)} variant="secondary"><Edit className="w-4 h-4 mr-2" />Batch Edit ({selectedProducts.length})</Button>
              <Button onClick={handleBatchAiUpdate} disabled={isAiUpdating} variant="outline" className="bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100">{isAiUpdating ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>AI Updating...</>) : (<><Sparkles className="w-4 h-4 mr-2" />{useGeminiForAI && geminiReady ? 'Gemini' : 'AI'} Full Update ({selectedProducts.length})</>)}</Button>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-white border">
                <Switch id="use_gemini_inline" checked={useGeminiForAI && geminiReady} onCheckedChange={(v) => setUseGeminiForAI(!!v)} disabled={!geminiReady} />
                <Label htmlFor="use_gemini_inline" className="text-sm">使用 Gemini</Label>
                {!geminiReady && <span className="text-xs text-gray-500">未配置 API Key</span>}
            </div>
            </>
          )}
          <Button variant="outline" onClick={() => setShowImporter(true)} className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-300 text-green-700">
            <Upload className="w-5 h-5" />
            <span>Shopify CSV 导入</span>
          </Button>
          <Button onClick={handleAddNew} className="flex items-center gap-2"><Plus className="w-5 h-5" /><span>Add New Product</span></Button>
        </div>
      </header>
      <div className="mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><Input placeholder="Search products..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : (
        <>
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-medium">{error}</span>
                <Button variant="outline" onClick={loadProducts}>重试</Button>
              </div>
            </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold mb-2">No Products Found</p>
              <p>Try adjusting your search or add a new product.</p>
            </div>
          ) : (
            <>
              {renderProductTable()}
              {renderProductCards()}
                </>
              )}
            </>
          )}
        </>
      )}
      {isDialogOpen && renderProductForm()}
      <AnimatePresence>{showImporter && (<ShopifyImporter onImportComplete={handleImportComplete} onClose={() => setShowImporter(false)} />)}</AnimatePresence>
      <AnimatePresence>
        {showBatchEditModal && (
          <Dialog open={showBatchEditModal} onOpenChange={setShowBatchEditModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Batch Edit {selectedProducts.length} Products</DialogTitle></DialogHeader>
              <div className="space-y-6 py-4">
                <p className="text-sm text-gray-600">Only filled fields will be updated. Leave blank to keep existing values.</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><MessageCircle className="w-5 h-5" />Review Management</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button type="button" onClick={handleBatchGenerateReviews} disabled={isGeneratingReviews} variant="outline" className="bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100">{isGeneratingReviews ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>Generating...</>) : (<><MessageSquare className="w-4 h-4 mr-2" />AI Generate Reviews</>)}</Button>
                    <Button type="button" onClick={handleBatchDeleteReviews} disabled={isDeletingReviews} variant="outline" className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100">{isDeletingReviews ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>Deleting...</>) : (<><X className="w-4 h-4 mr-2" />Delete All Reviews</>)}</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="batch-price">Price</Label><Input id="batch-price" type="number" step="0.01" placeholder="e.g.: 99.99" value={batchEditData.price || ''} onChange={e => setBatchEditData({ ...batchEditData, price: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="batch-original-price">Original Price</Label><Input id="batch-original-price" type="number" step="0.01" placeholder="e.g.: 129.99" value={batchEditData.original_price || ''} onChange={e => setBatchEditData({ ...batchEditData, original_price: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="batch-stock">Stock</Label><Input id="batch-stock" type="number" placeholder="e.g.: 100" value={batchEditData.stock_quantity || ''} onChange={e => setBatchEditData({ ...batchEditData, stock_quantity: e.target.value })} /></div>
                  <div className="space-y-2"><Label htmlFor="batch-brand">Brand</Label><Input id="batch-brand" placeholder="e.g.: Apple" value={batchEditData.brand || ''} onChange={e => setBatchEditData({ ...batchEditData, brand: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={batchEditData.category_id || ''}
                        onValueChange={(id) => {
                          const cat = categories.find(c => c.id === id);
                          setBatchEditData({
                            ...batchEditData,
                            category_id: id,
                            category: cat?.slug || ''
                          });
                        }}
                      >
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setBatchEditData({ ...batchEditData, category_id: '', category: '' })}
                      >
                        清除
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">选择后将把所有选中商品归类到该分类。</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="batch-status">Active Status</Label>
                    <Select onValueChange={val => setBatchEditData({ ...batchEditData, is_active: val === 'true' })} value={batchEditData.is_active !== undefined ? String(batchEditData.is_active) : ''}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-featured">Featured Product</Label>
                    <Select onValueChange={val => setBatchEditData({ ...batchEditData, is_featured: val === 'true' })} value={batchEditData.is_featured !== undefined ? String(batchEditData.is_featured) : ''}>
                      <SelectTrigger><SelectValue placeholder="Select if featured" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="secondary" onClick={() => { setShowBatchEditModal(false); setBatchEditData({}); }}>Cancel</Button></DialogClose>
                <Button onClick={handleBatchUpdate} disabled={isBatchUpdating}>{isBatchUpdating ? 'Updating...' : 'Save Changes'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showBatchDeleteModal && (
          <Dialog open={showBatchDeleteModal} onOpenChange={setShowBatchDeleteModal}>
            <DialogContent>
              <DialogHeader><DialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="w-5 h-5" />Confirm Batch Deletion</DialogTitle></DialogHeader>
              <div className="py-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0"><Trash2 className="w-4 h-4 text-red-600" /></div>
                    <div>
                      <h3 className="font-medium text-red-800 mb-1">Warning: This action is irreversible.</h3>
                      <p className="text-red-700 text-sm">You are about to delete <span className="font-bold">{selectedProducts.length}</span> products. All data (images, variants, reviews, etc.) will be permanently lost.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Products to be deleted:</p>
                  <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3">
                    {selectedProducts.slice(0, 10).map(productId => {
                      const product = products.find(p => p.id === productId);
                      return (
                        <div key={productId} className="flex items-center gap-2 py-1">
                          <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0">
                            {((product?.images && product.images[0]) || (product?.gallery && product.gallery[0]) || product?.image_url) && (
                              <img src={(product.images && product.images[0]) || (product.gallery && product.gallery[0]) || product.image_url} alt={product?.name} className="w-full h-full object-cover rounded" />
                            )}
                          </div>
                          <span className="text-sm text-gray-700 truncate">{product?.name || `Product ${productId}`}</span>
                        </div>
                      );
                    })}
                    {selectedProducts.length > 10 && (<div className="py-1 text-sm text-gray-500">... and {selectedProducts.length - 10} more products</div>)}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-sm text-yellow-800"><strong>Hint:</strong> If you want to temporarily hide products, use the "Batch Edit" feature to change their status to "Inactive" instead of deleting them.</p></div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline" onClick={() => setShowBatchDeleteModal(false)}>Cancel</Button></DialogClose>
                <Button onClick={handleBatchDelete} disabled={isBatchDeleting} variant="destructive" className="bg-red-600 hover:bg-red-700">{isBatchDeleting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Deleting...</>) : (<><Trash2 className="w-4 h-4 mr-2" />Confirm Deletion ({selectedProducts.length})</>)}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
