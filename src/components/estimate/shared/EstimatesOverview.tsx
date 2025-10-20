'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { useContractor } from '@/hooks/use-contractor';
import { useProject } from '@/hooks/use-projects';
import { Hammer, ShowerHead, Layers, Paintbrush, Download } from 'lucide-react';
import { ShowerBaseIcon } from '@/components/icons/ShowerBaseIcon';
import { StructuralIcon } from '@/components/icons/StructuralIcon';
import { TradeIcon } from '@/components/icons/TradeIcon';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

interface EstimatesOverviewProps {
  projectId: string;
}

interface DesignDataWithNotes {
  designClientNotes?: string;
  constructionClientNotes?: string;
  [key: string]: unknown;
}

export default function EstimatesOverview({
  projectId,
}: EstimatesOverviewProps) {
  const estimateRef = useRef<HTMLDivElement>(null);

  const {
    getWorkflowTotals,
    getDesignData,
    getLaborItems,
    getMaterialItems,
    getFlatFeeItems,
    getAllTotals,
    getNotes,
  } = useEstimateWorkflowContext();

  // Get contractor and project data
  const { data: contractor } = useContractor();
  const { data: project } = useProject(projectId);

  // State for pricing adjustments
  const [markup, setMarkup] = useState<string>('0');
  const [discount, setDiscount] = useState<string>('0');

  // PDF Export function
  const handleExportToPDF = async () => {
    if (!estimateRef.current) return;

    let style: HTMLStyleElement | null = null;

    try {
      // Temporarily add CSS overrides to fix color parsing issues
      style = document.createElement('style');
      style.textContent = `
        .pdf-export * {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #e5e7eb !important;
          background: #ffffff !important;
          color-scheme: light !important;
        }
        .pdf-export *::before,
        .pdf-export *::after {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #e5e7eb !important;
          background: #ffffff !important;
        }
        .pdf-export .bg-blue-600 {
          background-color: #2563eb !important;
        }
        .pdf-export .text-blue-600 {
          color: #2563eb !important;
        }
        .pdf-export .text-blue-800 {
          color: #1e40af !important;
        }
        .pdf-export .text-blue-700 {
          color: #1d4ed8 !important;
        }
        .pdf-export .bg-blue-50 {
          background-color: #eff6ff !important;
        }
        .pdf-export .border-blue-600 {
          border-color: #2563eb !important;
        }
        .pdf-export .border-blue-300 {
          border-color: #93c5fd !important;
        }
        .pdf-export .bg-gray-50 {
          background-color: #f9fafb !important;
        }
        .pdf-export .bg-gray-100 {
          background-color: #f3f4f6 !important;
        }
        .pdf-export .text-gray-900 {
          color: #111827 !important;
        }
        .pdf-export .text-gray-700 {
          color: #374151 !important;
        }
        .pdf-export .text-gray-600 {
          color: #4b5563 !important;
        }
        .pdf-export .border-gray-200 {
          border-color: #e5e7eb !important;
        }
        .pdf-export .border-gray-300 {
          border-color: #d1d5db !important;
        }
        .pdf-export .border-gray-400 {
          border-color: #9ca3af !important;
        }
        .pdf-export .text-white {
          color: #ffffff !important;
        }
        .pdf-export .bg-white {
          background-color: #ffffff !important;
        }
        .pdf-export .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .pdf-export .rounded-lg {
          border-radius: 0.5rem !important;
        }
        .pdf-export .rounded-t-lg {
          border-top-left-radius: 0.5rem !important;
          border-top-right-radius: 0.5rem !important;
        }
        .pdf-export .rounded-b-lg {
          border-bottom-left-radius: 0.5rem !important;
          border-bottom-right-radius: 0.5rem !important;
        }
        .pdf-export .px-4 {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        .pdf-export .py-3 {
          padding-top: 0.75rem !important;
          padding-bottom: 0.75rem !important;
        }
        .pdf-export .py-8 {
          padding-top: 2rem !important;
          padding-bottom: 2rem !important;
        }
        .pdf-export .px-8 {
          padding-left: 2rem !important;
          padding-right: 2rem !important;
        }
        .pdf-export .pb-8 {
          padding-bottom: 2rem !important;
        }
        .pdf-export .mb-4 {
          margin-bottom: 1rem !important;
        }
        .pdf-export .mb-2 {
          margin-bottom: 0.5rem !important;
        }
        .pdf-export .mb-1 {
          margin-bottom: 0.25rem !important;
        }
        .pdf-export .space-y-2 > * + * {
          margin-top: 0.5rem !important;
        }
        .pdf-export .space-y-6 > * + * {
          margin-top: 1.5rem !important;
        }
        .pdf-export .flex {
          display: flex !important;
        }
        .pdf-export .justify-between {
          justify-content: space-between !important;
        }
        .pdf-export .justify-center {
          justify-content: center !important;
        }
        .pdf-export .items-center {
          align-items: center !important;
        }
        .pdf-export .items-start {
          align-items: flex-start !important;
        }
        .pdf-export .text-center {
          text-align: center !important;
        }
        .pdf-export .text-right {
          text-align: right !important;
        }
        .pdf-export .w-1/2 {
          width: 50% !important;
        }
        .pdf-export .flex-1 {
          flex: 1 1 0% !important;
        }
        .pdf-export .font-bold {
          font-weight: 700 !important;
        }
        .pdf-export .font-semibold {
          font-weight: 600 !important;
        }
        .pdf-export .text-lg {
          font-size: 1.125rem !important;
          line-height: 1.75rem !important;
        }
        .pdf-export .text-sm {
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
        }
        .pdf-export .text-2xl {
          font-size: 1.5rem !important;
          line-height: 2rem !important;
        }
        .pdf-export .text-4xl {
          font-size: 2.25rem !important;
          line-height: 2.5rem !important;
        }
        .pdf-export .border {
          border-width: 1px !important;
        }
        .pdf-export .border-2 {
          border-width: 2px !important;
        }
        .pdf-export .border-4 {
          border-width: 4px !important;
        }
        .pdf-export .border-t {
          border-top-width: 1px !important;
        }
        .pdf-export .border-b {
          border-bottom-width: 1px !important;
        }
        .pdf-export .border-b-4 {
          border-bottom-width: 4px !important;
        }
        .pdf-export .border-l-2 {
          border-left-width: 2px !important;
        }
        .pdf-export .pl-3 {
          padding-left: 0.75rem !important;
        }
        .pdf-export .gap-3 {
          gap: 0.75rem !important;
        }
        .pdf-export .min-h-screen {
          min-height: 100vh !important;
        }
        .pdf-export .no-pdf {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      // Add PDF export class to the component
      estimateRef.current.classList.add('pdf-export');

      // Wait for styles to be applied
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Create image from the component using dom-to-image
      const imgData = await domtoimage.toPng(estimateRef.current, {
        quality: 1.0,
        bgcolor: '#ffffff',
        width: estimateRef.current.scrollWidth,
        height: estimateRef.current.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calculate dimensions to fit the content
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight =
        (estimateRef.current.scrollHeight * imgWidth) /
        estimateRef.current.scrollWidth;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const projectName = project?.project_name || 'estimate';
      const date = new Date().toISOString().split('T')[0];
      const filename = `${projectName}-estimate-${date}.pdf`;

      // Download PDF
      pdf.save(filename);

      // Cleanup: Remove temporary styles and class
      document.head.removeChild(style);
      estimateRef.current.classList.remove('pdf-export');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');

      // Cleanup on error
      try {
        if (style && document.head.contains(style)) {
          document.head.removeChild(style);
        }
        if (estimateRef.current) {
          estimateRef.current.classList.remove('pdf-export');
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
  };

  // Get demolition workflow data
  const demolitionData = useMemo(() => {
    const designData = getDesignData('demolition') as {
      isDemolitionFlatFee?: 'yes' | 'no';
      debrisDisposal?: 'yes' | 'no';
      demolitionChoices?: {
        removeFlooring: 'yes' | 'no';
        removeShowerWall: 'yes' | 'no';
        removeShowerBase: 'yes' | 'no';
        removeTub: 'yes' | 'no';
        removeVanity: 'yes' | 'no';
        removeToilet: 'yes' | 'no';
        removeAccessories: 'yes' | 'no';
        removeWall: 'yes' | 'no';
      };
      [key: string]: unknown;
    } | null;
    const laborItems = getLaborItems('demolition');
    const materialItems = getMaterialItems('demolition');
    const totals = getWorkflowTotals('demolition');

    // Check if demolition has any data - including design selections
    const hasLaborOrMaterials =
      laborItems.length > 0 || materialItems.length > 0;
    const hasDesignSelections =
      designData &&
      (designData.isDemolitionFlatFee === 'yes' ||
        designData.debrisDisposal === 'yes' ||
        (designData.demolitionChoices &&
          Object.values(designData.demolitionChoices).some(
            (choice) => choice === 'yes'
          )));

    if (!hasLaborOrMaterials && !hasDesignSelections) return null;

    return {
      id: 'demolition',
      name: 'Demolition',
      icon: <Hammer size={24} />,
      color: 'text-blue-600',
      designLabor: 0, // Demolition doesn't have design labor
      constructionLabor: totals.laborTotal,
      designMaterials: 0, // Demolition doesn't have design materials
      constructionMaterials: totals.materialsTotal,
      totalLabor: totals.laborTotal,
      totalMaterials: totals.materialsTotal,
      total: totals.grandTotal,
    };
  }, [getDesignData, getLaborItems, getMaterialItems, getWorkflowTotals]);

  // Get shower walls workflow data
  const showerWallsData = useMemo(() => {
    const designData = getDesignData('showerWalls');
    const laborItems = getLaborItems('showerWalls');
    const materialItems = getMaterialItems('showerWalls');
    const totals = getWorkflowTotals('showerWalls');

    // Check if shower walls has any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

    // Calculate design vs construction labor and materials
    const designLabor = laborItems
      .filter((item) => item.scope === 'showerWalls_design')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const constructionLabor = laborItems
      .filter((item) => item.scope === 'showerWalls_construction')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const designMaterials = materialItems
      .filter((item) => item.scope === 'showerWalls_design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => item.scope === 'showerWalls_construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    return {
      id: 'showerWalls',
      name: 'Shower Walls',
      icon: <ShowerHead size={24} />,
      color: 'text-blue-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor: totals.laborTotal,
      totalMaterials: totals.materialsTotal,
      total: totals.grandTotal,
    };
  }, [getDesignData, getLaborItems, getMaterialItems, getWorkflowTotals]);

  // Get shower base workflow data
  const showerBaseData = useMemo(() => {
    const designData = getDesignData('showerBase');
    const laborItems = getLaborItems('showerBase');
    const materialItems = getMaterialItems('showerBase');
    const totals = getWorkflowTotals('showerBase');

    // Check if there's any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

    // Calculate scope-based totals
    const designLabor = laborItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const constructionLabor = laborItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const designMaterials = materialItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    return {
      id: 'showerBase',
      name: 'Shower Base',
      icon: <ShowerBaseIcon size={24} />,
      color: 'text-blue-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor: totals.laborTotal,
      totalMaterials: totals.materialsTotal,
      total: totals.grandTotal,
    };
  }, [getDesignData, getLaborItems, getMaterialItems, getWorkflowTotals]);

  // Get floors workflow data
  const floorsData = useMemo(() => {
    const designData = getDesignData('floors');
    const laborItems = getLaborItems('floors');
    const materialItems = getMaterialItems('floors');
    const totals = getWorkflowTotals('floors');

    // Check if there's any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

    // Calculate scope-based totals
    const designLabor = laborItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const constructionLabor = laborItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const designMaterials = materialItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    return {
      id: 'floors',
      name: 'Floors',
      icon: <Layers size={24} />,
      color: 'text-blue-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor: totals.laborTotal,
      totalMaterials: totals.materialsTotal,
      total: totals.grandTotal,
    };
  }, [getDesignData, getLaborItems, getMaterialItems, getWorkflowTotals]);

  // Get finishings workflow data
  const finishingsData = useMemo(() => {
    const designData = getDesignData('finishings');
    const laborItems = getLaborItems('finishings');
    const materialItems = getMaterialItems('finishings');
    const totals = getWorkflowTotals('finishings');

    // Check if there's any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

    // Calculate scope-based totals
    const designLabor = laborItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const constructionLabor = laborItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const designMaterials = materialItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    return {
      id: 'finishings',
      name: 'Finishings',
      icon: <Paintbrush size={24} />,
      color: 'text-blue-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor: totals.laborTotal,
      totalMaterials: totals.materialsTotal,
      total: totals.grandTotal,
    };
  }, [getDesignData, getLaborItems, getMaterialItems, getWorkflowTotals]);

  // Get structural workflow data
  const structuralData = useMemo(() => {
    const designData = getDesignData('structural');
    const laborItems = getLaborItems('structural');
    const materialItems = getMaterialItems('structural');
    const totals = getWorkflowTotals('structural');

    // Check if there's any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

    // Calculate scope-based totals
    const designLabor = laborItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const constructionLabor = laborItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const designMaterials = materialItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    return {
      id: 'structural',
      name: 'Structural',
      icon: <StructuralIcon size={24} />,
      color: 'text-blue-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor: totals.laborTotal,
      totalMaterials: totals.materialsTotal,
      total: totals.grandTotal,
    };
  }, [getDesignData, getLaborItems, getMaterialItems, getWorkflowTotals]);

  // Get trade workflow data
  const tradeData = useMemo(() => {
    const designData = getDesignData('trade');
    const laborItems = getLaborItems('trade');
    const materialItems = getMaterialItems('trade');
    const totals = getWorkflowTotals('trade');

    // Check if there's any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

    // Calculate scope-based totals
    const designLabor = laborItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const constructionLabor = laborItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const designMaterials = materialItems
      .filter((item) => item.scope === 'design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => item.scope === 'construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    return {
      id: 'trade',
      name: 'Trade',
      icon: <TradeIcon size={24} />,
      color: 'text-blue-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor: totals.laborTotal,
      totalMaterials: totals.materialsTotal,
      total: totals.grandTotal,
    };
  }, [getDesignData, getLaborItems, getMaterialItems, getWorkflowTotals]);

  // Create workflows array
  const workflows = useMemo(() => {
    const workflowList = [];
    if (demolitionData) {
      workflowList.push(demolitionData);
    }
    if (showerWallsData) {
      workflowList.push(showerWallsData);
    }
    if (showerBaseData) {
      workflowList.push(showerBaseData);
    }
    if (floorsData) {
      workflowList.push(floorsData);
    }
    if (finishingsData) {
      workflowList.push(finishingsData);
    }
    if (structuralData) {
      workflowList.push(structuralData);
    }
    if (tradeData) {
      workflowList.push(tradeData);
    }

    return workflowList;
  }, [
    demolitionData,
    showerWallsData,
    showerBaseData,
    floorsData,
    finishingsData,
    structuralData,
    tradeData,
  ]);

  // Get base total from context
  const baseTotal = useMemo(() => getAllTotals().grandTotal, [getAllTotals]);

  // Calculate final total with markup, discount, and taxes
  const finalTotal = useMemo(() => {
    const subtotal = baseTotal;
    const markupValue = parseFloat(markup) || 0;
    const taxRate = contractor?.tax_rate || 0;

    // Apply markup (percentage)
    const withMarkup = subtotal * (1 + markupValue / 100);

    // Apply discount (percentage only)
    const discountPercent = parseFloat(discount) || 0;
    const withDiscount = withMarkup * (1 - discountPercent / 100);

    // Apply taxes (taxRate is already a decimal, so no need to divide by 100)
    const withTaxes = withDiscount * (1 + taxRate);

    return Math.max(0, withTaxes); // Ensure non-negative total
  }, [baseTotal, markup, discount, contractor?.tax_rate]);

  // Calculate individual components for display
  const pricingBreakdown = useMemo(() => {
    const subtotal = baseTotal;
    const markupValue = parseFloat(markup) || 0;
    const taxRate = contractor?.tax_rate || 0;

    const withMarkup = subtotal * (1 + markupValue / 100);

    // Apply discount (percentage only)
    const discountPercent = parseFloat(discount) || 0;
    const withDiscount = withMarkup * (1 - discountPercent / 100);

    const taxAmount = withDiscount * taxRate;
    const finalTotal = withDiscount + taxAmount;

    return {
      subtotal,
      markupAmount: withMarkup - subtotal,
      discountAmount: withMarkup - withDiscount,
      taxAmount,
      finalTotal: Math.max(0, finalTotal),
    };
  }, [baseTotal, markup, discount, contractor?.tax_rate]);

  // Helper function to get client contact info
  const getClientInfo = () => {
    if (!project) return { name: '', phone: '', address: '', email: '' };

    const emails = project.client_email
      ? project.client_email
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e)
      : [];
    const phones = project.client_phone
      ? project.client_phone
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p)
      : [];

    return {
      name: project.client_name || '',
      phone: phones[0] || '',
      address: project.project_address || '',
      email: emails[0] || '',
    };
  };

  // Helper function to get contractor contact info
  const getContractorInfo = () => {
    if (!contractor)
      return { name: '', phone: '', address: '', email: '', website: '' };

    const emails = contractor.email
      ? contractor.email
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e)
      : [];
    const phones = contractor.phone
      ? contractor.phone
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p)
      : [];

    return {
      name: contractor.name || 'MY SMART ESTIMATE',
      phone: phones[0] || '',
      address: contractor.address || '',
      email: emails[0] || '',
      website: 'yourwebsite.com',
    };
  };

  const clientInfo = getClientInfo();
  const contractorInfo = getContractorInfo();

  return (
    <div ref={estimateRef} className='bg-white min-h-screen'>
      {/* Invoice Header */}
      <div className='bg-white p-8 border-b-4 border-blue-600'>
        <div className='flex flex-col md:flex-row justify-between items-start gap-6'>
          {/* Company Information - First on mobile */}
          <div className='w-full md:w-1/2 text-left md:text-right order-1 md:order-2'>
            <div className='flex items-center justify-start md:justify-end mb-4'>
              <div className='mr-3'>
                <Image
                  src='/logo.svg'
                  alt='My Smart Estimate Logo'
                  width={48}
                  height={48}
                  className='w-[200px] h-12'
                />
              </div>
            </div>
            <div className='text-gray-700'>
              <p>{contractorInfo.name}</p>
              <p>{contractorInfo.phone}</p>
              <p>{contractorInfo.address}</p>
              <p>{contractorInfo.email}</p>
              <p>{contractorInfo.website}</p>
            </div>
          </div>

          {/* Customer Contact - Second on mobile */}
          <div className='w-full md:w-1/2 order-2 md:order-1'>
            <div className='border-b-4 border-blue-600 pb-2 mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                CUSTOMER CONTACT
              </h3>
            </div>
            <div className='bg-white p-4 rounded-b-lg'>
              <p className='font-bold text-lg text-gray-900'>
                {clientInfo.name}
              </p>
              <p className='text-gray-700'>{clientInfo.phone}</p>
              <p className='text-gray-700'>{clientInfo.address}</p>
              <p className='text-gray-700'>{clientInfo.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title */}
      <div className='text-center py-8'>
        <h1 className='text-4xl font-bold text-blue-600'>ESTIMATE</h1>
      </div>

      {/* Service Sections */}
      <div className='px-8 space-y-6'>
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className='bg-white border border-gray-200 rounded-lg'
          >
            {/* Section Header */}
            <div className='border-b-4 border-blue-600 pb-2 px-4 pt-3'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {workflow.name.toUpperCase()}
              </h3>
            </div>

            {/* Section Content */}
            <div className='p-4 space-y-2'>
              {/* Design Options for Shower Walls */}
              {workflow.id === 'showerWalls' &&
                (() => {
                  const designData = getDesignData('showerWalls') as {
                    walls?: Array<{
                      name: string;
                      height: { ft: number; inch: number };
                      width: { ft: number; inch: number };
                    }>;
                    design?: {
                      tileSize?: string;
                      customTileWidth?: string;
                      customTileLength?: string;
                      tilePattern?: string;
                      customTilePatternName?: string;
                      niche?: string;
                      showerDoor?: string;
                      waterproofingSystem?: string;
                      customWaterproofingName?: string;
                      grabBar?: string;
                      clientSuppliesBase?: string;
                      repairWalls?: boolean;
                      reinsulateWalls?: boolean;
                    };
                  } | null;

                  if (!designData?.design) return null;

                  const design = designData.design;
                  const walls = designData.walls || [];

                  return (
                    <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                      <h4 className='font-semibold text-blue-900 mb-2'>
                        Design Specifications
                      </h4>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        {/* Wall Measurements */}
                        {walls.length > 0 && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Walls:
                            </span>
                            <div className='text-gray-600'>
                              {walls.map((wall, index) => (
                                <div key={index} className='text-xs'>
                                  {wall.name}: {wall.height.ft}&apos;
                                  {wall.height.inch}&quot; × {wall.width.ft}
                                  &apos;
                                  {wall.width.inch}&quot;
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tile Specifications */}
                        <div>
                          <span className='font-medium text-gray-700'>
                            Tile Size:
                          </span>
                          <div className='text-gray-600'>
                            {design.tileSize === 'Custom'
                              ? `${design.customTileWidth}" × ${design.customTileLength}"`
                              : design.tileSize}
                          </div>
                        </div>

                        <div>
                          <span className='font-medium text-gray-700'>
                            Tile Pattern:
                          </span>
                          <div className='text-gray-600'>
                            {design.tilePattern === 'Custom'
                              ? design.customTilePatternName || 'Custom'
                              : design.tilePattern}
                          </div>
                        </div>

                        {/* Features */}
                        {design.niche && design.niche !== 'None' && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Niche:
                            </span>
                            <div className='text-gray-600'>{design.niche}</div>
                          </div>
                        )}

                        {design.showerDoor && design.showerDoor !== 'None' && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Shower Door:
                            </span>
                            <div className='text-gray-600'>
                              {design.showerDoor}
                            </div>
                          </div>
                        )}

                        {design.grabBar && design.grabBar !== '0' && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Grab Bars:
                            </span>
                            <div className='text-gray-600'>
                              {design.grabBar}
                            </div>
                          </div>
                        )}

                        {design.waterproofingSystem &&
                          design.waterproofingSystem !==
                            'None / Select System...' && (
                            <div>
                              <span className='font-medium text-gray-700'>
                                Waterproofing:
                              </span>
                              <div className='text-gray-600'>
                                {design.waterproofingSystem === 'Other'
                                  ? design.customWaterproofingName || 'Other'
                                  : design.waterproofingSystem}
                              </div>
                            </div>
                          )}

                        {/* Client Supplies */}
                        {design.clientSuppliesBase &&
                          design.clientSuppliesBase !== 'No' && (
                            <div>
                              <span className='font-medium text-gray-700'>
                                Client Supplies:
                              </span>
                              <div className='text-gray-600'>Tiles</div>
                            </div>
                          )}

                        {/* Construction Options */}
                        {(design.repairWalls || design.reinsulateWalls) && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Construction:
                            </span>
                            <div className='text-gray-600'>
                              {design.repairWalls && 'Wall Repair'}
                              {design.repairWalls &&
                                design.reinsulateWalls &&
                                ', '}
                              {design.reinsulateWalls && 'Re-insulation'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* Design Options for Shower Base */}
              {workflow.id === 'showerBase' &&
                (() => {
                  const designData = getDesignData('showerBase') as {
                    design?: {
                      width?: string;
                      length?: string;
                      baseType?: string;
                      drainType?: string;
                      waterproofingSystem?: string;
                      entryType?: string;
                      drainLocation?: string;
                      subfloorRepair?: boolean;
                      joistModification?: boolean;
                      clientSuppliesBase?: string;
                    };
                  } | null;

                  if (!designData?.design) return null;

                  const design = designData.design;

                  return (
                    <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                      <h4 className='font-semibold text-blue-900 mb-2'>
                        Design Specifications
                      </h4>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        {/* Base Type and Dimensions */}
                        <div>
                          <span className='font-medium text-gray-700'>
                            Base Type:
                          </span>
                          <div className='text-gray-600'>{design.baseType}</div>
                        </div>

                        <div>
                          <span className='font-medium text-gray-700'>
                            Dimensions:
                          </span>
                          <div className='text-gray-600'>
                            {design.width}&quot; × {design.length}&quot;
                          </div>
                        </div>

                        {/* Tiled Base Options */}
                        {design.baseType === 'Tiled Base' && (
                          <>
                            <div>
                              <span className='font-medium text-gray-700'>
                                Entry:
                              </span>
                              <div className='text-gray-600 capitalize'>
                                {design.entryType}
                              </div>
                            </div>

                            <div>
                              <span className='font-medium text-gray-700'>
                                Drain Type:
                              </span>
                              <div className='text-gray-600 capitalize'>
                                {design.drainType === 'regular'
                                  ? 'Regular Drain'
                                  : 'Linear Drain'}
                              </div>
                            </div>

                            <div>
                              <span className='font-medium text-gray-700'>
                                Drain Location:
                              </span>
                              <div className='text-gray-600 capitalize'>
                                {design.drainLocation}
                              </div>
                            </div>

                            {design.waterproofingSystem &&
                              design.waterproofingSystem !== 'none' && (
                                <div>
                                  <span className='font-medium text-gray-700'>
                                    Waterproofing:
                                  </span>
                                  <div className='text-gray-600'>
                                    {design.waterproofingSystem === 'kerdi' &&
                                      'Schluter-Kerdi System'}
                                    {design.waterproofingSystem === 'liquid' &&
                                      'Liquid Membrane'}
                                    {design.waterproofingSystem ===
                                      'kerdi-board' && 'Kerdi-Board'}
                                    {![
                                      'kerdi',
                                      'liquid',
                                      'kerdi-board',
                                    ].includes(design.waterproofingSystem) &&
                                      design.waterproofingSystem}
                                  </div>
                                </div>
                              )}
                          </>
                        )}

                        {/* Client Supplies */}
                        {design.clientSuppliesBase &&
                          design.clientSuppliesBase !== 'No' && (
                            <div>
                              <span className='font-medium text-gray-700'>
                                Client Supplies:
                              </span>
                              <div className='text-gray-600'>Base</div>
                            </div>
                          )}

                        {/* Construction Options */}
                        {(design.subfloorRepair ||
                          design.joistModification) && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Construction:
                            </span>
                            <div className='text-gray-600'>
                              {design.subfloorRepair && 'Subfloor Repair'}
                              {design.subfloorRepair &&
                                design.joistModification &&
                                ', '}
                              {design.joistModification && 'Joist Modification'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* Demolition Detailed Breakdown */}
              {workflow.id === 'demolition' ? (
                <>
                  {/* Demolition Labor Items */}
                  {(() => {
                    const laborItems = getLaborItems('demolition');
                    const flatFeeItems = getFlatFeeItems('demolition');
                    const designData = getDesignData('demolition') as {
                      isDemolitionFlatFee?: 'yes' | 'no';
                      [key: string]: unknown;
                    } | null;

                    if (laborItems.length === 0 && flatFeeItems.length === 0)
                      return null;

                    return (
                      <div className='mb-4'>
                        <h4 className='font-semibold text-gray-800 mb-3 text-sm'>
                          Labor Breakdown
                        </h4>
                        <div className='space-y-2'>
                          {/* Show flat fee items if flat fee mode is selected */}
                          {designData?.isDemolitionFlatFee === 'yes'
                            ? flatFeeItems.map((item) => {
                                const price = parseFloat(item.unitPrice) || 0;

                                return (
                                  <div
                                    key={item.id}
                                    className='flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded'
                                  >
                                    <div className='flex-1'>
                                      <span className='text-gray-700'>
                                        {item.name}
                                      </span>
                                    </div>
                                    <div className='text-right'>
                                      <span className='font-semibold text-gray-900'>
                                        ${price.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            : /* Show individual labor items if hourly mode */
                              laborItems.map((item) => {
                                const hours = parseFloat(item.hours) || 0;
                                const rate = parseFloat(item.rate) || 0;
                                const total = hours * rate;

                                return (
                                  <div
                                    key={item.id}
                                    className='flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded'
                                  >
                                    <div className='flex-1'>
                                      <span className='text-gray-700'>
                                        {item.name}
                                      </span>
                                      {/* <span className='text-gray-500 ml-2'>
                                      ({hours}h × ${rate.toFixed(2)}/h)
                                    </span> */}
                                    </div>
                                    <div className='text-right'>
                                      <span className='font-semibold text-gray-900'>
                                        ${total.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Demolition Material Items */}
                  {(() => {
                    const materialItems = getMaterialItems('demolition');

                    if (materialItems.length === 0) return null;

                    return (
                      <div className='mb-4'>
                        <h4 className='font-semibold text-gray-800 mb-3 text-sm'>
                          Materials Breakdown
                        </h4>
                        <div className='space-y-2'>
                          {materialItems.map((item) => {
                            const quantity = parseFloat(item.quantity) || 0;
                            const price = parseFloat(item.price) || 0;
                            const total = quantity * price;

                            return (
                              <div
                                key={item.id}
                                className='flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded'
                              >
                                <div className='flex-1'>
                                  <span className='text-gray-700'>
                                    {item.name}
                                  </span>
                                  {/* <span className='text-gray-500 ml-2'>
                                    ({quantity} {item.unit} × $
                                    {price.toFixed(2)})
                                  </span> */}
                                </div>
                                <div className='text-right'>
                                  <span className='font-semibold text-gray-900'>
                                    ${total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div className='flex justify-between items-center'>
                    <div className='flex-1'>
                      <p className='text-gray-700'>
                        Labor (e.g., {workflow.name.toLowerCase()},
                        installation)
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-900'>
                        ${workflow.totalLabor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='flex-1'>
                      <p className='text-gray-700'>
                        Materials (e.g., supplies, equipment)
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-900'>
                        ${workflow.totalMaterials.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Section Total */}
            <div className='bg-gray-50 px-4 py-3'>
              <div className='flex justify-between items-center'>
                <span className='font-semibold text-gray-900'>Total</span>
                <span className='text-2xl font-bold text-blue-600'>
                  ${workflow.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Client Notes */}
            {(() => {
              // Get design data to access client notes
              const designData = getDesignData(
                workflow.id as
                  | 'demolition'
                  | 'showerWalls'
                  | 'showerBase'
                  | 'floors'
                  | 'finishings'
                  | 'structural'
                  | 'trade'
              ) as DesignDataWithNotes | null; // Type assertion to access dynamic properties

              // Collect all client notes from design data
              const allClientNotes: string[] = [];

              if (designData) {
                // Check for design client notes
                if (designData.designClientNotes?.trim()) {
                  allClientNotes.push(
                    `Design: ${designData.designClientNotes.trim()}`
                  );
                }

                // Check for construction client notes
                if (designData.constructionClientNotes?.trim()) {
                  allClientNotes.push(
                    `Construction: ${designData.constructionClientNotes.trim()}`
                  );
                }

                // For demolition, also check the workflow notes
                if (workflow.id === 'demolition') {
                  const workflowNotes = getNotes(workflow.id as 'demolition');
                  if (workflowNotes?.clientNotes?.trim()) {
                    allClientNotes.push(workflowNotes.clientNotes.trim());
                  }
                }
              }

              if (allClientNotes.length === 0) return null;

              return (
                <div className='px-4 py-3 bg-blue-50 border-t border-blue-200 rounded-b-lg'>
                  <h4 className='text-sm font-semibold text-blue-800 mb-2'>
                    Client Notes:
                  </h4>
                  <div className='text-sm text-blue-700 space-y-2'>
                    {allClientNotes
                      .join('\n')
                      .split('\n')
                      .filter((line) => line.trim())
                      .map((noteLine, index) => (
                        <p key={index} className='mb-1'>
                          {noteLine.trim().startsWith('-')
                            ? noteLine.trim()
                            : `- ${noteLine.trim()}`}
                        </p>
                      ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ))}
      </div>

      {/* Pricing Summary Section */}
      <div className='px-8 py-8'>
        <div className='bg-gray-100 border-2 border-gray-300 rounded-lg p-6'>
          {/* Subtotal */}
          <div className='flex justify-between items-center mb-4'>
            <span className='text-xl font-semibold text-gray-900'>
              Subtotal
            </span>
            <span className='text-xl font-semibold text-gray-900'>
              $
              {pricingBreakdown.subtotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Markup */}
          <div className='flex justify-between items-center mb-4'>
            <span className='text-lg font-medium text-gray-700'>Markup</span>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                placeholder='0'
                value={markup}
                onChange={(e) => setMarkup(e.target.value)}
                className='w-20 text-right bg-transparent border-b border-gray-400 focus:border-blue-500 focus:outline-none'
              />
              <span className='text-lg font-medium text-gray-700'>%</span>
            </div>
          </div>

          {/* Markup Amount */}
          {parseFloat(markup) > 0 && (
            <div className='flex justify-between items-center mb-4 ml-4'>
              <span className='text-sm text-gray-600'>Markup Amount</span>
              <span className='text-sm text-gray-600'>
                +$
                {pricingBreakdown.markupAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          )}

          {/* Discount */}
          <div className='flex justify-between items-center mb-4'>
            <span className='text-lg font-medium text-gray-700'>Discount</span>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                placeholder='0'
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className='w-20 text-right bg-transparent border-b border-gray-400 focus:border-blue-500 focus:outline-none'
              />
              <span className='text-lg font-medium text-gray-700'>%</span>
            </div>
          </div>

          {/* Discount Amount */}
          {parseFloat(discount) > 0 && (
            <div className='flex justify-between items-center mb-4 ml-4'>
              <span className='text-sm text-gray-600'>Discount Amount</span>
              <span className='text-sm text-red-600'>
                -$
                {pricingBreakdown.discountAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          )}

          {/* Tax Rate */}
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center gap-2'>
              <span className='text-lg font-medium text-gray-700'>Taxes</span>
              <span className='text-sm text-gray-500'>
                ({(contractor?.tax_rate || 0) * 100}%)
              </span>
            </div>
            <span className='text-lg font-medium text-gray-700'>
              $
              {pricingBreakdown.taxAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Grand Total */}
          <div className='border-t-2 border-gray-400 pt-4'>
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2'>
              <span className='text-2xl font-bold text-gray-900'>
                GRAND TOTAL
              </span>
              <span className='text-4xl font-bold text-blue-600'>
                $
                {finalTotal.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Export to PDF Button */}
      <div className='px-8 pb-8'>
        <div className='flex justify-center'>
          <Button
            onClick={handleExportToPDF}
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg flex items-center gap-3 no-pdf'
          >
            <Download size={24} />
            Export to PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
