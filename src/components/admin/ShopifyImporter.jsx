import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Download, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { LocalProduct as Product } from '@/api/localEntities';
import { UploadFile, ExtractDataFromUploadedFile } from '@/api/localIntegrations';

export default function ShopifyImporter({ onImportComplete, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    // 兼容部分浏览器将 CSV 识别为 application/vnd.ms-excel
    const isCsv = selected.type.includes('csv') || selected.name.toLowerCase().endsWith('.csv') || selected.type.startsWith('text/');
    if (isCsv) {
      setFile(selected);
      setError(null);
    } else {
      setError('请选择CSV文件');
    }
  };

  const handleButtonClick = () => fileInputRef.current?.click();

  // 处理 Shopify CSV 数据
  const processShopifyData = async (csvData) => {
    const res = { success: 0, failed: 0, errors: [], total: 0 };
    const groups = {};

    // 以 Handle 分组
    csvData.forEach((row) => {
      if (row && typeof row === 'object' && row.Handle) {
        const h = row.Handle;
        if (!groups[h]) groups[h] = [];
        groups[h].push(row);
      }
    });

    const handles = Object.keys(groups);
    res.total = handles.length;

    for (const handle of handles) {
      try {
        const rows = groups[handle];
        const mainRow = rows[0];

        // 收集图片（主图 + 变体图）
        const imagesSet = new Set();
        rows.forEach(r => {
          if (r['Image Src']) imagesSet.add(r['Image Src']);
          if (r['Variant Image']) imagesSet.add(r['Variant Image']);
        });
        const gallery = Array.from(imagesSet).filter(Boolean);

        // 规格
        const option1Values = [...new Set(rows.map(r => r['Option1 Value']).filter(Boolean))];
        const option2Values = [...new Set(rows.map(r => r['Option2 Value']).filter(Boolean))];
        const option3Values = [...new Set(rows.map(r => r['Option3 Value']).filter(Boolean))];

        const specifications = [];
        if (mainRow['Option1 Name'] && option1Values.length) {
          specifications.push({ name: mainRow['Option1 Name'], options: option1Values });
        }
        if (mainRow['Option2 Name'] && option2Values.length) {
          specifications.push({ name: mainRow['Option2 Name'], options: option2Values });
        }
        if (mainRow['Option3 Name'] && option3Values.length) {
          specifications.push({ name: mainRow['Option3 Name'], options: option3Values });
        }

        // 变体
        const variants = [];
        rows.forEach(r => {
          if (r['Variant SKU'] || r['Option1 Value'] || r['Variant Price']) {
            variants.push({
              sku: r['Variant SKU'] || `${handle}-${Date.now()}`,
              price: parseFloat(r['Variant Price']) || 0,
              original_price: parseFloat(r['Variant Compare At Price']) || parseFloat(r['Variant Price']) || 0,
              stock_quantity: parseInt(r['Variant Inventory Qty']) || 0,
              image: r['Variant Image'] || gallery[0] || '',
              option1: r['Option1 Value'] || '',
              option2: r['Option2 Value'] || '',
              option3: r['Option3 Value'] || ''
            });
          }
        });

        // 技术细节
        const technical_details = {};
        if (mainRow['Vendor']) technical_details['品牌'] = mainRow['Vendor'];
        if (mainRow['Type']) technical_details['产品类型'] = mainRow['Type'];
        if (mainRow['Handle']) technical_details['Handle'] = mainRow['Handle'];
        if (mainRow['Tags']) technical_details['标签'] = mainRow['Tags'];
        if (mainRow['SEO Title']) technical_details['SEO标题'] = mainRow['SEO Title'];
        if (mainRow['SEO Description']) technical_details['SEO描述'] = mainRow['SEO Description'];
        if (mainRow['Google Shopping / Google Product Category']) {
          technical_details['产品分类'] = mainRow['Google Shopping / Google Product Category'];
        }

        const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock_quantity) || 0), 0);
        const price = parseFloat(mainRow['Variant Price']) || (variants[0]?.price || 0);
        const original_price = parseFloat(mainRow['Variant Compare At Price']) || variants[0]?.original_price || price;

        // 必填与前台字段补全
        const image_url = gallery[0] || '';
        const category = (mainRow['Type'] && String(mainRow['Type']).toLowerCase()) || 'electronics';

        const productData = {
          name: mainRow.Title || 'Untitled Product',
          description: mainRow['Body (HTML)'] || '',
          brand: mainRow.Vendor || '',
          price,
          original_price,
          // 后台/前台库存同步
          stock_quantity: totalStock,
          stock: totalStock,
          // 图片与相册
          image_url,
          images: gallery,
          gallery,
          // 规格与变体
          specifications,
          variants,
          technical_details,
          // 状态与展示
          is_active: String(mainRow.Published || '').toUpperCase() !== 'FALSE',
          rating: Math.min(5, Math.max(1, 4 + Math.random())), // 4.0-5.0
          review_count: Math.floor(Math.random() * 100) + 10,
          reviews_count: undefined, // 稍后映射
          social_proof: `${Math.floor(Math.random() * 500) + 100}+ bought in past month`,
          about_this_item: [
            `High-quality ${mainRow.Title || 'product'}`,
            `An excellent product from ${mainRow.Vendor || 'a well-known brand'}`,
            'Undergoes strict quality control',
            'Supports fast shipping and returns'
          ],
          // 必填分类（与实体枚举对齐或降级为默认）
          category: ['electronics','fashion','home','beauty','sports','books'].includes(String(category)) ? category : 'electronics',
          // 标签
          tags: (mainRow['Tags'] ? String(mainRow['Tags']).split(',').map(t => t.trim()).filter(Boolean) : [])
        };

        // 将后台 review_count 同步到前台字段
        productData.reviews_count = productData.review_count;

        await Product.create(productData);
        res.success += 1;
      } catch (err) {
        console.error(`处理产品 ${handle} 失败:`, err);
        res.failed += 1;
        res.errors.push(`${handle}: ${err.message || '未知错误'}`);
      }
    }

    return res;
  };

  const handleImport = async () => {
    if (!file) {
      setError('请先选择CSV文件');
      return;
    }
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      setProgress(20);
      const { file_url } = await UploadFile({ file });

      setProgress(40);
      const csvSchema = {
        type: "array",
        items: {
          type: "object",
          properties: {
            "Handle": { "type": "string" },
            "Title": { "type": "string" },
            "Body (HTML)": { "type": "string" },
            "Vendor": { "type": "string" },
            "Type": { "type": "string" },
            "Tags": { "type": "string" },
            "Published": { "type": "string" },
            "Option1 Name": { "type": "string" },
            "Option1 Value": { "type": "string" },
            "Option2 Name": { "type": "string" },
            "Option2 Value": { "type": "string" },
            "Option3 Name": { "type": "string" },
            "Option3 Value": { "type": "string" },
            "Variant SKU": { "type": "string" },
            "Variant Inventory Qty": { "type": "string" },
            "Variant Price": { "type": "string" },
            "Variant Compare At Price": { "type": "string" },
            "Image Src": { "type": "string" },
            "Variant Image": { "type": "string" },
            "SEO Title": { "type": "string" },
            "SEO Description": { "type": "string" },
            "Google Shopping / Google Product Category": { "type": "string" }
          }
        }
      };

      setProgress(60);
      const extract = await ExtractDataFromUploadedFile({ file_url, json_schema: csvSchema });

      if (extract.status === 'error') {
        throw new Error(extract.details || 'CSV文件解析失败');
      }
      const csvData = extract.output;
      if (!Array.isArray(csvData) || csvData.length === 0) {
        throw new Error('CSV文件中没有找到有效数据');
      }

      setProgress(80);
      const processed = await processShopifyData(csvData);

      setProgress(100);
      setResults(processed);

      if (processed.success > 0) {
        setTimeout(() => onImportComplete?.(), 800);
      }
    } catch (err) {
      console.error('CSV导入失败:', err);
      setError(`导入失败: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'Handle','Title','Body (HTML)','Vendor','Type','Tags','Published',
      'Option1 Name','Option1 Value','Option2 Name','Option2 Value','Option3 Name','Option3 Value',
      'Variant SKU','Variant Inventory Qty','Variant Price','Variant Compare At Price',
      'Image Src','Variant Image','SEO Title','SEO Description'
    ];
    const csv = [
      headers.join(','),
      'sample-product,Sample Product,"<p>Desc</p>",Sample Brand,Electronics,new,TRUE,Color,Red,Size,Large,,SAMPLE-001,10,99.99,129.99,https://example.com/image1.jpg,https://example.com/red-large.jpg,Sample SEO Title,Sample SEO Description',
      'sample-product,Sample Product,,,,,,Color,Blue,Size,Large,,SAMPLE-002,5,99.99,129.99,,https://example.com/blue-large.jpg,,'
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = 'shopify-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            Shopify CSV 批量导入
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!results && (
            <>
              <div className="text-center space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">选择 Shopify CSV 文件</p>
                    <p className="text-sm text-gray-500">支持标准的 Shopify 产品导出格式</p>

                    <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                    <Button variant="outline" className="cursor-pointer" onClick={handleButtonClick}>选择文件</Button>
                  </div>
                </div>

                {file && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="text-green-600 hover:text-green-800">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  下载 CSV 模板文件
                </Button>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">导入失败</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="space-y-3">
                  <Progress value={progress} className="w-full" />
                  <p className="text-center text-sm text-gray-600">正在处理... {progress}%</p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose}>取消</Button>
                <Button onClick={handleImport} disabled={!file || uploading} className="bg-green-600 hover:bg-green-700">
                  {uploading ? '导入中...' : '开始导入'}
                </Button>
              </div>
            </>
          )}

          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">导入完成！</h3>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-green-600">✓ 成功导入 {results.success} 个产品</p>
                  {results.failed > 0 && <p className="text-red-600">✗ 失败 {results.failed} 个产品</p>}
                  <p className="text-gray-500">总计处理 {results.total} 个产品</p>
                </div>
              </div>

              {results.errors.length > 0 && (
                <div className="text-left max-h-40 overflow-y-auto bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-medium text-red-800 mb-2">错误详情：</p>
                  {results.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-600 mb-1">• {e}</p>
                  ))}
                </div>
              )}

              <Button onClick={onClose} className="w-full">完成</Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}