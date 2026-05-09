import { QRCodeCanvas } from 'qrcode.react';
import { Download, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function QRCodeBill({ tokenNumber, amount, items }) {
  const downloadBill = async () => {
    const element = document.getElementById('bill-receipt');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`StayBite_Bill_${tokenNumber}.pdf`);
  };

  return (
    <motion.div 
      id="bill-receipt"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-sm w-full text-center"
    >
      <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Receipt className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold mb-1">Order Confirmed!</h2>
      <p className="text-slate-500 text-sm mb-6">Show this QR to the shopkeeper</p>

      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl inline-block mb-6 shadow-inner">
        <QRCodeCanvas 
          value={`STAYBITE_ORDER:${tokenNumber}`} 
          size={180} 
          bgColor={"#ffffff"} 
          fgColor={"#0f172a"} 
          level={"H"}
        />
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 text-left">
        <div className="flex justify-between mb-2">
          <span className="text-slate-500 text-sm">Token</span>
          <span className="font-bold font-mono text-primary-500">{tokenNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-slate-500 text-sm">Items</span>
          <span className="font-bold text-sm">{items}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
          <span className="font-bold">Total Paid</span>
          <span className="font-bold text-green-500">₹{amount}</span>
        </div>
      </div>

      <button 
        onClick={downloadBill}
        className="w-full py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
      >
        <Download className="w-4 h-4" /> Download PDF Bill
      </button>
    </motion.div>
  );
}
