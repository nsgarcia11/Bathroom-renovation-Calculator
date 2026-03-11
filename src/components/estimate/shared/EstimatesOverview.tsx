'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { useContractor } from '@/hooks/use-contractor';
import { useProject } from '@/hooks/use-projects';
import { useToast } from '@/contexts/ToastContext';
import { Hammer, ShowerHead, Layers, Paintbrush, Download, CreditCard } from 'lucide-react';
import { ShowerBaseIcon } from '@/components/icons/ShowerBaseIcon';
import { StructuralIcon } from '@/components/icons/StructuralIcon';
import { TradeIcon } from '@/components/icons/TradeIcon';
import { LaborItem } from '@/types/estimate';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { useSubscriptionContext } from '@/contexts/SubscriptionContext';
import { UpgradeModal } from '@/components/subscription/UpgradeModal';

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
  const { error: showError, success: showSuccess } = useToast();

  const router = useRouter();
  const { limits, checkAndRecordPdfExport } = useSubscriptionContext();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // State for pricing adjustments
  const [markup, setMarkup] = useState<string>('0');
  const [discount, setDiscount] = useState<string>('0');

  // PDF Export function
  const handleExportToPDF = async () => {
    if (!estimateRef.current) return;

    // Check subscription limits with fresh database check (prevents stale cache bypass)
    const { allowed } = await checkAndRecordPdfExport(projectId);
    if (!allowed) {
      setShowUpgradeModal(true);
      return;
    }

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
      showSuccess('PDF exported successfully');

      // Cleanup: Remove temporary styles and class
      document.head.removeChild(style);
      estimateRef.current.classList.remove('pdf-export');
    } catch (err) {
      console.error('PDF export error:', err);
      showError('Error generating PDF', 'Please try again.');

      // Cleanup on error
      try {
        if (style && document.head.contains(style)) {
          document.head.removeChild(style);
        }
        if (estimateRef.current) {
          estimateRef.current.classList.remove('pdf-export');
        }
      } catch {
        // Silent cleanup error - no need to show to user
      }
    }
  };

  // Get demolition workflow data from saved data
  const demolitionDesignData = getDesignData('demolition');
  const demolitionLaborItems = getLaborItems('demolition');
  const demolitionMaterialItems = getMaterialItems('demolition');
  const demolitionTotals = getWorkflowTotals('demolition');

  const demolitionData = useMemo(() => {
    const designData = demolitionDesignData as {
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
    const laborItems = demolitionLaborItems;
    const materialItems = demolitionMaterialItems;
    const totals = demolitionTotals;

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

    if (!hasLaborOrMaterials && !hasDesignSelections) {
      return null;
    }

    const result = {
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

    return result;
  }, [
    demolitionDesignData,
    demolitionLaborItems,
    demolitionMaterialItems,
    demolitionTotals,
  ]);

  // Get shower walls workflow data
  const showerWallsDesignData = getDesignData('showerWalls');
  const showerWallsLaborItems = getLaborItems('showerWalls');
  const showerWallsMaterialItems = getMaterialItems('showerWalls');
  const showerWallsTotals = getWorkflowTotals('showerWalls');

  const showerWallsData = useMemo(() => {
    const designData = showerWallsDesignData;
    const laborItems = showerWallsLaborItems;
    const materialItems = showerWallsMaterialItems;
    const totals = showerWallsTotals;

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
  }, [
    showerWallsDesignData,
    showerWallsLaborItems,
    showerWallsMaterialItems,
    showerWallsTotals,
  ]);

  // Get shower base workflow data
  const showerBaseDesignData = getDesignData('showerBase');
  const showerBaseLaborItems = getLaborItems('showerBase');
  const showerBaseMaterialItems = getMaterialItems('showerBase');
  const showerBaseTotals = getWorkflowTotals('showerBase');

  const showerBaseData = useMemo(() => {
    const designData = showerBaseDesignData;
    const laborItems = showerBaseLaborItems;
    const materialItems = showerBaseMaterialItems;
    const totals = showerBaseTotals;

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
  }, [
    showerBaseDesignData,
    showerBaseLaborItems,
    showerBaseMaterialItems,
    showerBaseTotals,
  ]);

  // Get floors workflow data
  const floorsDesignData = getDesignData('floors');
  const floorsLaborItems = getLaborItems('floors');
  const floorsMaterialItems = getMaterialItems('floors');
  const floorsTotals = getWorkflowTotals('floors');

  const floorsData = useMemo(() => {
    const designData = floorsDesignData;
    const laborItems = floorsLaborItems;
    const materialItems = floorsMaterialItems;
    const totals = floorsTotals;

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
  }, [floorsDesignData, floorsLaborItems, floorsMaterialItems, floorsTotals]);

  // Get finishings workflow data
  const finishingsDesignData = getDesignData('finishings');
  const finishingsLaborItems = getLaborItems('finishings');
  const finishingsMaterialItems = getMaterialItems('finishings');
  const finishingsTotals = getWorkflowTotals('finishings');

  const finishingsData = useMemo(() => {
    const designData = finishingsDesignData;
    const laborItems = finishingsLaborItems;
    const materialItems = finishingsMaterialItems;
    const totals = finishingsTotals;

    // Check if there's any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

    // Calculate scope-based totals for finishings (uses 'painting', 'carpentry', 'accessories' scopes)
    // Painting is considered "design" work, Carpentry and Accessories are "construction" work
    const designLabor = laborItems
      .filter((item) => item.scope === 'painting')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const constructionLabor = laborItems
      .filter((item) => item.scope === 'carpentry' || item.scope === 'accessories')
      .reduce(
        (sum, item) =>
          sum + (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0),
        0
      );

    const designMaterials = materialItems
      .filter((item) => item.scope === 'painting')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => item.scope === 'carpentry' || item.scope === 'accessories')
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
  }, [
    finishingsDesignData,
    finishingsLaborItems,
    finishingsMaterialItems,
    finishingsTotals,
  ]);

  // Get structural workflow data
  const structuralDesignData = getDesignData('structural');
  const structuralLaborItems = getLaborItems('structural');
  const structuralMaterialItems = getMaterialItems('structural');
  const structuralTotals = getWorkflowTotals('structural');

  const structuralData = useMemo(() => {
    const designData = structuralDesignData;
    const laborItems = structuralLaborItems;
    const materialItems = structuralMaterialItems;
    const totals = structuralTotals;

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
  }, [
    structuralDesignData,
    structuralLaborItems,
    structuralMaterialItems,
    structuralTotals,
  ]);

  // Get trade workflow data
  const tradeLaborItems = getLaborItems('trade');
  const tradeMaterialItems = getMaterialItems('trade');

  const plumbingData = useMemo(() => {
    const laborItems = tradeLaborItems.filter((item) => item.color === 'blue');
    const materialItems = tradeMaterialItems.filter((item) => item.color === 'blue');

    const hasData = laborItems.length > 0 || materialItems.length > 0;
    if (!hasData) return null;

    const calcLaborCost = (item: LaborItem) => {
      const quantity = item.quantity || 1;
      if (item.pricingMode === 'flat') {
        return (parseFloat(item.flatPrice || '0') || 0) * quantity;
      }
      return (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0) * quantity;
    };

    // Trade items use 'category' instead of 'scope', check both
    const designLabor = laborItems
      .filter((item) => (item.scope || item.category) === 'design')
      .reduce((sum, item) => sum + calcLaborCost(item), 0);

    const constructionLabor = laborItems
      .filter((item) => (item.scope || item.category) === 'construction')
      .reduce((sum, item) => sum + calcLaborCost(item), 0);

    const designMaterials = materialItems
      .filter((item) => (item.scope || item.category) === 'design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => (item.scope || item.category) === 'construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    // Compute totals from all items (not just scope-matched) to catch items without scope/category
    const totalLabor = laborItems.reduce(
      (sum, item) => sum + calcLaborCost(item),
      0
    );
    const totalMaterials = materialItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
      0
    );

    return {
      id: 'plumbing',
      name: 'Plumbing',
      icon: <TradeIcon size={24} />,
      color: 'text-blue-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor,
      totalMaterials,
      total: totalLabor + totalMaterials,
    };
  }, [tradeLaborItems, tradeMaterialItems]);

  const electricalData = useMemo(() => {
    const laborItems = tradeLaborItems.filter((item) => item.color === 'green');
    const materialItems = tradeMaterialItems.filter((item) => item.color === 'green');

    const hasData = laborItems.length > 0 || materialItems.length > 0;
    if (!hasData) return null;

    const calcLaborCost = (item: LaborItem) => {
      const quantity = item.quantity || 1;
      if (item.pricingMode === 'flat') {
        return (parseFloat(item.flatPrice || '0') || 0) * quantity;
      }
      return (parseFloat(item.hours) || 0) * (parseFloat(item.rate) || 0) * quantity;
    };

    // Trade items use 'category' instead of 'scope', check both
    const designLabor = laborItems
      .filter((item) => (item.scope || item.category) === 'design')
      .reduce((sum, item) => sum + calcLaborCost(item), 0);

    const constructionLabor = laborItems
      .filter((item) => (item.scope || item.category) === 'construction')
      .reduce((sum, item) => sum + calcLaborCost(item), 0);

    const designMaterials = materialItems
      .filter((item) => (item.scope || item.category) === 'design')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    const constructionMaterials = materialItems
      .filter((item) => (item.scope || item.category) === 'construction')
      .reduce(
        (sum, item) =>
          sum +
          (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
        0
      );

    // Compute totals from all items (not just scope-matched) to catch items without scope/category
    const totalLabor = laborItems.reduce(
      (sum, item) => sum + calcLaborCost(item),
      0
    );
    const totalMaterials = materialItems.reduce(
      (sum, item) =>
        sum +
        (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0),
      0
    );

    return {
      id: 'electrical',
      name: 'Electrical',
      icon: <TradeIcon size={24} />,
      color: 'text-green-600',
      designLabor,
      constructionLabor,
      designMaterials,
      constructionMaterials,
      totalLabor,
      totalMaterials,
      total: totalLabor + totalMaterials,
    };
  }, [tradeLaborItems, tradeMaterialItems]);

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
    if (plumbingData) {
      workflowList.push(plumbingData);
    }
    if (electricalData) {
      workflowList.push(electricalData);
    }

    return workflowList;
  }, [
    demolitionData,
    showerWallsData,
    showerBaseData,
    floorsData,
    finishingsData,
    structuralData,
    plumbingData,
    electricalData,
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjU1LjMxIDEyOS4xIDcwMS4xNSAyNzguMjciPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS43LjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMSBCdWlsZCA4KSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICM1MTg4Yzc7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICMyMzFmMjA7CiAgICAgIH0KCiAgICAgIC5zdDIgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDMgewogICAgICAgIGZpbGw6ICM0MTdiYmY7CiAgICAgIH0KCiAgICAgIC5zdDQgewogICAgICAgIGZpbGw6ICMzODcyYWI7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxnPgogICAgPHBhdGggY2xhc3M9InN0MCIgZD0iTTM3NS40MSwzODYuNDhjMC0uNjIuMTEtMS4yLjM0LTEuNzUuMjMtLjU1LjU0LTEuMDMuOTUtMS40NC40LS40MS44OC0uNzIsMS40NC0uOTUuNTUtLjIzLDEuMTMtLjM0LDEuNzUtLjM0czEuMi4xMSwxLjc1LjM0LDEuMDMuNTQsMS40NC45NWMuNC40MS43Mi44OC45NSwxLjQ0LjIzLjU1LjM0LDEuMTQuMzQsMS43NXMtLjExLDEuMi0uMzQsMS43NWMtLjIzLjU1LS41NSwxLjAzLS45NSwxLjQ0LS40MS40MS0uODguNzItMS40NC45NXMtMS4xNC4zNC0xLjc1LjM0LTEuMi0uMTItMS43NS0uMzRjLS41Ni0uMjMtMS4wMy0uNTQtMS40NC0uOTUtLjQxLS40MS0uNzItLjg4LS45NS0xLjQ0LS4yMy0uNTUtLjM0LTEuMTQtLjM0LTEuNzVaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDEzLjE2LDM2NS4xNWMtLjc1LS45MS0xLjY3LTEuNjEtMi43NS0yLjA5LTEuMDktLjQ5LTIuMzQtLjczLTMuNzctLjczcy0yLjc1LjI4LTMuOTcuODMtMi4yNywxLjMyLTMuMTYsMi4zMWMtLjg5Ljk5LTEuNTksMi4xNy0yLjA5LDMuNTMtLjUxLDEuMzYtLjc2LDIuODQtLjc2LDQuNDNzLjI1LDMuMTEuNzYsNC40NmMuNSwxLjM1LDEuMTksMi41MiwyLjA3LDMuNTEuODguOTksMS45MSwxLjc2LDMuMDksMi4zMSwxLjE4LjU1LDIuNDYuODMsMy44Mi44MywxLjU2LDAsMi45NC0uMzIsNC4xNC0uOTcsMS4yLS42NSwyLjE5LTEuNTYsMi45Ny0yLjczbDYuMzMsNC43MmMtMS40NiwyLjA1LTMuMzEsMy41Ni01LjU1LDQuNTMtMi4yNC45Ny00LjU1LDEuNDYtNi45MiwxLjQ2LTIuNywwLTUuMTgtLjQyLTcuNDUtMS4yNy0yLjI3LS44NC00LjI0LTIuMDUtNS44OS0zLjYzLTEuNjYtMS41Ny0yLjk1LTMuNDgtMy44Ny01Ljcycy0xLjM5LTQuNzQtMS4zOS03LjUuNDYtNS4yNiwxLjM5LTcuNSwyLjIyLTQuMTUsMy44Ny01LjcyLDMuNjItMi43OCw1Ljg5LTMuNjNjMi4yNy0uODQsNC43NS0xLjI3LDcuNDUtMS4yNy45NywwLDEuOTkuMDksMy4wNC4yNywxLjA1LjE4LDIuMDkuNDYsMy4xMi44NSwxLjAyLjM5LDIsLjkxLDIuOTUsMS41Ni45NC42NSwxLjc4LDEuNDQsMi41MywyLjM5bC01Ljg0LDQuNzdaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIyLjEyLDM3My40MmMwLTIuNzYuNDYtNS4yNiwxLjM5LTcuNXMyLjIxLTQuMTUsMy44Ny01LjcyLDMuNjItMi43OCw1Ljg5LTMuNjNjMi4yNy0uODQsNC43Ni0xLjI3LDcuNDUtMS4yN3M1LjE4LjQyLDcuNDUsMS4yN2MyLjI3Ljg0LDQuMjQsMi4wNSw1Ljg5LDMuNjNzMi45NSwzLjQ4LDMuODcsNS43MiwxLjM5LDQuNzQsMS4zOSw3LjUtLjQ2LDUuMjYtMS4zOSw3LjUtMi4yMiw0LjE1LTMuODcsNS43MmMtMS42NiwxLjU4LTMuNjIsMi43OC01Ljg5LDMuNjMtMi4yNy44NC00Ljc1LDEuMjctNy40NSwxLjI3cy01LjE4LS40Mi03LjQ1LTEuMjdjLTIuMjctLjg0LTQuMjQtMi4wNS01Ljg5LTMuNjMtMS42Ni0xLjU3LTIuOTQtMy40OC0zLjg3LTUuNzJzLTEuMzktNC43NC0xLjM5LTcuNVpNNDMwLjAxLDM3My40MmMwLDEuNjMuMjUsMy4xMS43Niw0LjQ2czEuMjIsMi41MiwyLjE3LDMuNTFjLjk0Ljk5LDIuMDcsMS43NiwzLjM4LDIuMzEsMS4zMi41NSwyLjc4LjgzLDQuNDEuODNzMy4wOS0uMjgsNC40MS0uODMsMi40NC0xLjMyLDMuMzktMi4zMWMuOTQtLjk5LDEuNjYtMi4xNiwyLjE2LTMuNTEuNTEtMS4zNS43Ni0yLjgzLjc2LTQuNDZzLS4yNS0zLjA3LS43Ni00LjQzYy0uNS0xLjM2LTEuMjItMi41NC0yLjE2LTMuNTMtLjk0LS45OS0yLjA3LTEuNzYtMy4zOS0yLjMxcy0yLjc4LS44My00LjQxLS44My0zLjA5LjI4LTQuNDEuODNjLTEuMzEuNTUtMi40NCwxLjMyLTMuMzgsMi4zMS0uOTQuOTktMS42NywyLjE3LTIuMTcsMy41M3MtLjc2LDIuODQtLjc2LDQuNDNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDY0LjQ4LDM1Ni4xOWgxMS41bDcuOTQsMjIuNWguMWw3Ljk5LTIyLjVoMTEuNDR2MzQuNDhoLTcuNnYtMjYuNDRoLS4xbC05LjA2LDI2LjQ0aC01Ljc5bC04LjcyLTI2LjQ0aC0uMXYyNi40NGgtNy42di0zNC40OFoiLz4KICA8L2c+CiAgPGc+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzc0LjgsMTM4Ljc3aDE5LjA1bDEzLjE2LDM3LjNoLjE2bDEzLjI0LTM3LjNoMTguOTd2NTcuMTZoLTEyLjZ2LTQzLjg0aC0uMTZsLTE1LjAyLDQzLjg0aC05LjYxbC0xNC40NS00My44NGgtLjE2djQzLjg0aC0xMi41OXYtNTcuMTZaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNDY1LjA1LDE3MS41NGwtMjEuNDctMzIuNzhoMTUuNjZsMTIuMTEsMjEuMzksMTIuODQtMjEuMzloMTQuOTNsLTIxLjQ3LDMyLjc4djI0LjM4aC0xMi41OXYtMjQuMzhaIi8+CiAgPC9nPgogIDxnPgogICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTQwNi44MiwyMjMuOTZjLTEuMDItMS4yOS0yLjQxLTIuMjUtNC4xNi0yLjg3LTEuNzUtLjYyLTMuNC0uOTMtNC45Ni0uOTMtLjkyLDAtMS44Ni4xMS0yLjgzLjMyLS45Ny4yMi0xLjg4LjU1LTIuNzQsMS4wMS0uODYuNDYtMS41NiwxLjA2LTIuMSwxLjgyLS41NC43Ni0uODEsMS42Ny0uODEsMi43NSwwLDEuNzIuNjQsMy4wNCwxLjk0LDMuOTUsMS4yOS45MiwyLjkyLDEuNyw0Ljg4LDIuMzRzNC4wOCwxLjI5LDYuMzQsMS45NGMyLjI2LjY0LDQuMzcsMS41Niw2LjM0LDIuNzRzMy41OSwyLjc3LDQuODgsNC43NmMxLjI5LDEuOTksMS45NCw0LjY2LDEuOTQsNy45OXMtLjYsNS45NS0xLjc4LDguMzFjLTEuMTgsMi4zNy0yLjc4LDQuMzMtNC44LDUuODktMi4wMiwxLjU2LTQuMzYsMi43Mi03LjAyLDMuNDctMi42Ni43NS01LjQ4LDEuMTMtOC40NCwxLjEzLTMuNzEsMC03LjE2LS41Ny0xMC4zMy0xLjdzLTYuMTQtMi45Ni04Ljg4LTUuNDlsOC45Ni05Ljg1YzEuMjksMS43MiwyLjkyLDMuMDYsNC44OCw0LDEuOTYuOTQsNCwxLjQxLDYuMSwxLjQxLDEuMDIsMCwyLjA2LS4xMiwzLjExLS4zNnMxLjk5LS42MSwyLjgyLTEuMDksMS41MS0xLjEsMi4wMi0xLjg2Yy41MS0uNzUuNzYtMS42NC43Ni0yLjY2LDAtMS43Mi0uNjYtMy4wOC0xLjk4LTQuMDgtMS4zMi0uOTktMi45OC0xLjg0LTQuOTYtMi41NC0xLjk5LS43LTQuMTQtMS40LTYuNDYtMi4xLTIuMzEtLjctNC40Ny0xLjY0LTYuNDYtMi44Mi0xLjk5LTEuMTgtMy42NS0yLjc1LTQuOTYtNC42OC0xLjMyLTEuOTQtMS45OC00LjQ5LTEuOTgtNy42N3MuNjEtNS43NiwxLjgyLTguMDdjMS4yMS0yLjMxLDIuODMtNC4yNSw0Ljg0LTUuODEsMi4wMi0xLjU2LDQuMzUtMi43Myw2Ljk4LTMuNTEsMi42NC0uNzgsNS4zNi0xLjE3LDguMTUtMS4xNywzLjIzLDAsNi4zNS40Niw5LjM2LDEuMzcsMy4wMi45Miw1LjczLDIuNDUsOC4xNiw0LjZsLTguNjQsOS40NFoiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00MjQuOTEsMjEwaDE5LjA1bDEzLjE2LDM3LjNoLjE2bDEzLjI0LTM3LjNoMTguOTd2NTcuMTZoLTEyLjU5di00My44NGgtLjE2bC0xNS4wMiw0My44NGgtOS42MWwtMTQuNDUtNDMuODRoLS4xNnY0My44NGgtMTIuNnYtNTcuMTZaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTE5LjkzLDIxMGgxMC40MWwyNC44Nyw1Ny4xNmgtMTQuMjFsLTQuOTItMTIuMTFoLTIyLjJsLTQuNzYsMTIuMTFoLTEzLjg5bDI0LjctNTcuMTZaTTUyNC43NywyMjYuNjNsLTYuOTQsMTcuNzZoMTMuOTdsLTcuMDItMTcuNzZaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTYwLjk0LDIxMGgyMi4xMmMyLjksMCw1LjY2LjI4LDguMjcuODUsMi42MS41Nyw0LjksMS41MSw2Ljg2LDIuODMsMS45NiwxLjMyLDMuNTIsMy4xLDQuNjgsNS4zMywxLjE2LDIuMjMsMS43NCw1LjAyLDEuNzQsOC4zNSwwLDQuMDQtMS4wNSw3LjQ3LTMuMTUsMTAuMjktMi4xLDIuODItNS4xNiw0LjYxLTkuMiw1LjM3bDE0LjUzLDI0LjE0aC0xNS4xbC0xMS45NS0yMi44NWgtNi4yMXYyMi44NWgtMTIuNnYtNTcuMTZaTTU3My41MywyMzMuNjVoNy40M2MxLjEzLDAsMi4zMy0uMDQsMy41OS0uMTJzMi40MS0uMzIsMy40My0uNzNjMS4wMi0uNCwxLjg3LTEuMDQsMi41NC0xLjkuNjctLjg2LDEuMDEtMi4wNywxLjAxLTMuNjMsMC0xLjQ1LS4zLTIuNjEtLjg5LTMuNDctLjU5LS44Ni0xLjM1LTEuNTItMi4yNi0xLjk4LS45Mi0uNDYtMS45Ni0uNzctMy4xNS0uOTMtMS4xOC0uMTYtMi4zNC0uMjQtMy40Ny0uMjRoLTguMjN2MTNaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjIyLjg2LDIyMS4xNGgtMTYuMzF2LTExLjE0aDQ1LjIxdjExLjE0aC0xNi4zMXY0Ni4wMmgtMTIuNTl2LTQ2LjAyWiIvPgogIDwvZz4KICA8Zz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNzMuNzksMjgyLjhoMzguODN2MTEuNjNoLTI2LjI0djEwLjY2aDI0Ljc5djExLjYzaC0yNC43OXYxMS42M2gyNy42OXYxMS42M2gtNDAuMjh2LTU3LjE2WiIvPgogICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTQ1Mi40MiwyOTYuNzZjLTEuMDItMS4yOS0yLjQxLTIuMjUtNC4xNi0yLjg3LTEuNzUtLjYyLTMuNC0uOTMtNC45Ni0uOTMtLjkyLDAtMS44Ni4xMS0yLjgzLjMyLS45Ny4yMi0xLjg4LjU1LTIuNzQsMS4wMS0uODYuNDYtMS41NiwxLjA2LTIuMSwxLjgyLS41NC43Ni0uODEsMS42Ny0uODEsMi43NSwwLDEuNzIuNjQsMy4wNCwxLjk0LDMuOTUsMS4yOS45MiwyLjkyLDEuNyw0Ljg4LDIuMzRzNC4wOCwxLjI5LDYuMzQsMS45NGMyLjI2LjY0LDQuMzcsMS41Niw2LjM0LDIuNzRzMy41OSwyLjc3LDQuODgsNC43NmMxLjI5LDEuOTksMS45NCw0LjY2LDEuOTQsNy45OXMtLjYsNS45NS0xLjc4LDguMzFjLTEuMTgsMi4zNy0yLjc4LDQuMzMtNC44LDUuODktMi4wMiwxLjU2LTQuMzYsMi43Mi03LjAyLDMuNDctMi42Ni43NS01LjQ4LDEuMTMtOC40NCwxLjEzLTMuNzEsMC03LjE2LS41Ny0xMC4zMy0xLjctMy4xOC0xLjEzLTYuMTQtMi45Ni04Ljg4LTUuNDlsOC45Ni05Ljg1YzEuMjksMS43MiwyLjkyLDMuMDYsNC44OCw0LDEuOTYuOTQsNCwxLjQxLDYuMSwxLjQxLDEuMDIsMCwyLjA2LS4xMiwzLjExLS4zNnMxLjk5LS42MSwyLjgyLTEuMDksMS41MS0xLjEsMi4wMi0xLjg2Yy41MS0uNzUuNzYtMS42NC43Ni0yLjY2LDAtMS43Mi0uNjYtMy4wOC0xLjk4LTQuMDgtMS4zMi0uOTktMi45OC0xLjg0LTQuOTYtMi41NC0xLjk5LS43LTQuMTQtMS40LTYuNDYtMi4xLTIuMzEtLjctNC40Ny0xLjY0LTYuNDYtMi44Mi0xLjk5LTEuMTgtMy42NS0yLjc1LTQuOTYtNC42OC0xLjMyLTEuOTQtMS45OC00LjQ5LTEuOTgtNy42N3MuNjEtNS43NiwxLjgyLTguMDdjMS4yMS0yLjMxLDIuODMtNC4yNSw0Ljg0LTUuODEsMi4wMi0xLjU2LDQuMzUtMi43Myw2Ljk4LTMuNTEsMi42NC0uNzgsNS4zNi0xLjE3LDguMTUtMS4xNywzLjIzLDAsNi4zNS40Niw5LjM2LDEuMzcsMy4wMi45Miw1LjczLDIuNDUsOC4xNiw0LjZsLTguNjQsOS40NFoiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik00ODEuNTcsMjkzLjk0aC0xNi4zMXYtMTEuMTRoNDUuMjF2MTEuMTRoLTE2LjMxdjQ2LjAyaC0xMi41OXYtNDYuMDJaIi8+CiAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTE2LjY4LDI4Mi44aDEyLjZ2NTcuMTZoLTEyLjZ2LTU3LjE2WiIvPgogICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTU0MC43NCwyODIuOGgxOS4wNWwxMy4xNiwzNy4zaC4xNmwxMy4yNC0zNy4zaDE4Ljk3djU3LjE2aC0xMi41OXYtNDMuODRoLS4xNmwtMTUuMDIsNDMuODRoLTkuNjFsLTE0LjQ1LTQzLjg0aC0uMTZ2NDMuODRoLTEyLjZ2LTU3LjE2WiIvPgogICAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTYzNS43NiwyODIuOGgxMC40MWwyNC44Nyw1Ny4xNmgtMTQuMjFsLTQuOTItMTIuMTFoLTIyLjJsLTQuNzYsMTIuMTFoLTEzLjg5bDI0LjctNTcuMTZaTTY0MC42LDI5OS40M2wtNi45NCwxNy43NmgxMy45N2wtNy4wMi0xNy43NloiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik02ODAuNCwyOTMuOTRoLTE2LjMxdi0xMS4xNGg0NS4yMXYxMS4xNGgtMTYuMzF2NDYuMDJoLTEyLjU5di00Ni4wMloiLz4KICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik03MTYuMTcsMjgyLjhoMzguODN2MTEuNjNoLTI2LjIzdjEwLjY2aDI0Ljc4djExLjYzaC0yNC43OHYxMS42M2gyNy42OXYxMS42M2gtNDAuMjl2LTU3LjE2WiIvPgogIDwvZz4KICA8Zz4KICAgIDxyZWN0IGNsYXNzPSJzdDAiIHg9IjU1LjMxIiB5PSIxMjkuMSIgd2lkdGg9IjI4NS44MiIgaGVpZ2h0PSIyNzguMjciIHJ4PSIxMi4xOCIgcnk9IjEyLjE4Ii8+CiAgICA8Zz4KICAgICAgPHJlY3QgY2xhc3M9InN0MyIgeD0iNTUuMzEiIHk9IjMxNS41IiB3aWR0aD0iMjg1LjQ4IiBoZWlnaHQ9IjguMiIvPgogICAgICA8cmVjdCBjbGFzcz0ic3Q0IiB4PSIxNDUuMjEiIHk9IjEzMC45NSIgd2lkdGg9IjguMiIgaGVpZ2h0PSIyNzYuNDIiLz4KICAgICAgPHJlY3QgY2xhc3M9InN0MyIgeD0iMjQ1LjEyIiB5PSIxMzAuOTUiIHdpZHRoPSI4LjIiIGhlaWdodD0iMjc2LjQyIi8+CiAgICAgIDxyZWN0IGNsYXNzPSJzdDQiIHg9IjU1LjMxIiB5PSIyMTguNzEiIHdpZHRoPSIyODUuNDgiIGhlaWdodD0iOC4yIi8+CiAgICAgIDxyZWN0IGNsYXNzPSJzdDMiIHg9IjI0NS40NiIgeT0iMjE4Ljg1IiB3aWR0aD0iOTUuNjYiIGhlaWdodD0iNy45MiIvPgogICAgPC9nPgogICAgPHBhdGggY2xhc3M9InN0MiIgZD0iTTE3Ny4zMywyNzQuNTlsLTI2LjkzLTMwLjcycy00LjE2LTIuMzEtNy4xNi0uNDNjLTIuNTEsMS41Ny03LjQ3LDUuMTEtOS4xMSw3LjU3LTEuMDUsMS41Ny0xLjU1LDQuMzMtLjQ1LDcuNTNsMzguNjUsNDQuMzJzNi4wOCwzLjEzLDEwLjY1LjYzbDkwLjg4LTgxLjY5czIuNDctMi44OS0uNTMtNy4xMmMwLDAtNi4yMy03LjI2LTguNTUtOS42Ni0xLjk4LTIuMDUtNC4yMS0zLjQ3LTguMzQtLjE2bC03OS4xMiw2OS43M1oiLz4KICA8L2c+Cjwvc3ZnPg=='
                  alt='My Smart Estimate Logo'
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

              {/* Design Options for Floors */}
              {workflow.id === 'floors' &&
                (() => {
                  const design = getDesignData('floors') as {
                    width?: string;
                    length?: string;
                    extraMeasurements?: Array<{
                      id: number;
                      label: string;
                      width: string;
                      length: string;
                    }>;
                    clientSuppliesTiles?: boolean;
                    selectedTileSizeOption?: string;
                    tileSize?: {
                      width: string;
                      length: string;
                    };
                    tilePattern?: string;
                    customPattern?: string;
                    isHeatedFloor?: boolean;
                    heatedFloorType?: string;
                    customHeatedFloorName?: string;
                    selectedPrepTasks?: string[];
                    plywoodThickness?: string;
                    joistCount?: number;
                  } | null;

                  if (!design || (!design.width && !design.length)) return null;

                  // Calculate total square footage
                  let totalSqFt = 0;
                  const mainWidth = parseFloat(design.width || '0') || 0;
                  const mainLength = parseFloat(design.length || '0') || 0;
                  if (mainWidth > 0 && mainLength > 0) {
                    totalSqFt += (mainWidth * mainLength) / 144;
                  }
                  if (design.extraMeasurements && Array.isArray(design.extraMeasurements)) {
                    design.extraMeasurements.forEach((m) => {
                      const sideWidth = parseFloat(m.width) || 0;
                      const sideLength = parseFloat(m.length) || 0;
                      if (sideWidth > 0 && sideLength > 0) {
                        totalSqFt += (sideWidth * sideLength) / 144;
                      }
                    });
                  }

                  // Get tile size display
                  const getTileSizeDisplay = () => {
                    if (design.selectedTileSizeOption === 'custom' && design.tileSize) {
                      return `${design.tileSize.width}" × ${design.tileSize.length}"`;
                    }
                    if (design.selectedTileSizeOption && design.selectedTileSizeOption !== 'select_option') {
                      const [w, l] = design.selectedTileSizeOption.split('x');
                      return `${w}" × ${l}"`;
                    }
                    return null;
                  };

                  // Get tile pattern display
                  const getTilePatternDisplay = () => {
                    const patterns: Record<string, string> = {
                      'stacked': 'Stacked (straight grid)',
                      'offset': 'Offset 1/2 or 1/3 (running bond)',
                      '1/2_offset': 'Offset 1/2 (running bond)',
                      '1/3_offset': 'Offset 1/3 (running bond)',
                      'diagonal': 'Diagonal grid 45°',
                      'hexagonal': 'Hexagonal',
                      'herringbone': 'Herringbone / Checkerboard',
                      'checkerboard': 'Checkerboard',
                      'other': design.customPattern || 'Custom',
                    };
                    return patterns[design.tilePattern || ''] || null;
                  };

                  // Get heated floor display
                  const getHeatedFloorDisplay = () => {
                    if (!design.isHeatedFloor) return null;
                    const types: Record<string, string> = {
                      'schluter': 'Schluter-DITRA-HEAT',
                      'nuheat': 'Nuheat Cable System',
                      'custom': design.customHeatedFloorName || 'Custom System',
                    };
                    return types[design.heatedFloorType || ''] || design.heatedFloorType;
                  };

                  // Get construction tasks display
                  const getConstructionTasksDisplay = () => {
                    if (!design.selectedPrepTasks || design.selectedPrepTasks.length === 0) return null;
                    const taskLabels: Record<string, string> = {
                      'self_leveling': 'Self-Leveling',
                      'ditra': 'Ditra Membrane',
                      'ditra_xl': 'Ditra XL Membrane',
                      'add_plywood': `Add Plywood (${design.plywoodThickness || '3/4'}")`,
                      'repair_subfloor': 'Repair Subfloor',
                      'repair_joist': `Repair Joists (${design.joistCount || 1})`,
                    };
                    return design.selectedPrepTasks.map(task => taskLabels[task] || task);
                  };

                  const tileSizeDisplay = getTileSizeDisplay();
                  const tilePatternDisplay = getTilePatternDisplay();
                  const heatedFloorDisplay = getHeatedFloorDisplay();
                  const constructionTasks = getConstructionTasksDisplay();

                  return (
                    <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                      <h4 className='font-semibold text-blue-900 mb-2'>
                        Design Specifications
                      </h4>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        {/* Total Area */}
                        <div>
                          <span className='font-medium text-gray-700'>
                            Total Area:
                          </span>
                          <div className='text-gray-600'>
                            {totalSqFt.toFixed(2)} sq/ft
                          </div>
                        </div>

                        {/* Main Dimensions */}
                        <div>
                          <span className='font-medium text-gray-700'>
                            Main Dimensions:
                          </span>
                          <div className='text-gray-600'>
                            {design.width}&quot; × {design.length}&quot;
                          </div>
                        </div>

                        {/* Extra Measurements */}
                        {design.extraMeasurements && design.extraMeasurements.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium text-gray-700'>
                              Additional Areas:
                            </span>
                            <div className='text-gray-600'>
                              {design.extraMeasurements.map((m, index) => (
                                <div key={index} className='text-xs'>
                                  {m.label || `Area ${index + 1}`}: {m.width}&quot; × {m.length}&quot;
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tile Size */}
                        {tileSizeDisplay && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Tile Size:
                            </span>
                            <div className='text-gray-600'>{tileSizeDisplay}</div>
                          </div>
                        )}

                        {/* Tile Pattern */}
                        {tilePatternDisplay && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Tile Pattern:
                            </span>
                            <div className='text-gray-600'>{tilePatternDisplay}</div>
                          </div>
                        )}

                        {/* Client Supplies Tiles */}
                        {design.clientSuppliesTiles && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Client Supplies:
                            </span>
                            <div className='text-gray-600'>Tiles</div>
                          </div>
                        )}

                        {/* Heated Floor */}
                        {heatedFloorDisplay && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Heated Floor:
                            </span>
                            <div className='text-gray-600'>{heatedFloorDisplay}</div>
                          </div>
                        )}

                        {/* Construction Tasks */}
                        {constructionTasks && constructionTasks.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium text-gray-700'>
                              Construction:
                            </span>
                            <div className='text-gray-600'>
                              {constructionTasks.join(', ')}
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
                  const design = getDesignData('showerBase') as {
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
                    installationBy?: string;
                  } | null;

                  if (!design || !design.baseType || design.baseType === 'Select base type') return null;

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

                        {/* Tub/Acrylic Base Options */}
                        {(design.baseType === 'Tub' || design.baseType === 'Acrylic Base') && (
                          <>
                            <div>
                              <span className='font-medium text-gray-700'>
                                Client Supplies Base:
                              </span>
                              <div className='text-gray-600'>
                                {design.clientSuppliesBase || 'No'}
                              </div>
                            </div>

                            <div>
                              <span className='font-medium text-gray-700'>
                                Installation By:
                              </span>
                              <div className='text-gray-600'>
                                {design.installationBy || 'Me'}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Tiled Base Options */}
                        {design.baseType === 'Tiled Base' && (
                          <>
                            <div>
                              <span className='font-medium text-gray-700'>
                                Entry:
                              </span>
                              <div className='text-gray-600 capitalize'>
                                {design.entryType || 'curb'}
                              </div>
                            </div>

                            <div>
                              <span className='font-medium text-gray-700'>
                                Drain Type:
                              </span>
                              <div className='text-gray-600 capitalize'>
                                {design.drainType === 'linear'
                                  ? 'Linear Drain'
                                  : 'Regular Drain'}
                              </div>
                            </div>

                            <div>
                              <span className='font-medium text-gray-700'>
                                Drain Location:
                              </span>
                              <div className='text-gray-600 capitalize'>
                                {design.drainLocation || 'center'}
                              </div>
                            </div>

                            {design.waterproofingSystem &&
                              design.waterproofingSystem !== 'none' && (
                                <div>
                                  <span className='font-medium text-gray-700'>
                                    Waterproofing:
                                  </span>
                                  <div className='text-gray-600'>
                                    {design.waterproofingSystem === 'schluter' &&
                                      'Schluter'}
                                    {design.waterproofingSystem === 'mortar' &&
                                      'Mortar Bed'}
                                    {design.waterproofingSystem === 'wedi' &&
                                      'Wedi'}
                                    {design.waterproofingSystem === 'laticrete' &&
                                      'Laticrete'}
                                    {![
                                      'schluter',
                                      'mortar',
                                      'wedi',
                                      'laticrete',
                                    ].includes(design.waterproofingSystem) &&
                                      design.waterproofingSystem}
                                  </div>
                                </div>
                              )}
                          </>
                        )}

                        {/* Construction Options */}
                        {(design.subfloorRepair ||
                          design.joistModification) && (
                          <div className='col-span-2'>
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

                      {/* Notes for Tub/Acrylic Base */}
                      {(design.baseType === 'Tub' || design.baseType === 'Acrylic Base') && (
                        <div className='mt-3 space-y-2'>
                          {design.clientSuppliesBase === 'Yes' && (
                            <div className='flex items-center gap-2 text-orange-600 text-xs bg-orange-50 p-2 rounded border border-orange-200'>
                              <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                              </svg>
                              <span>Note: Base will be removed from the Materials screen.</span>
                            </div>
                          )}
                          {design.installationBy === 'Trade' && (
                            <div className='flex items-center gap-2 text-orange-600 text-xs bg-orange-50 p-2 rounded border border-orange-200'>
                              <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                                <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                              </svg>
                              <span>Note: The cost for installation by a trade professional should be added on the Trades screen.</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

              {/* Design Options for Finishings */}
              {workflow.id === 'finishings' &&
                (() => {
                  const design = getDesignData('finishings') as {
                    width?: string;
                    length?: string;
                    height?: string;
                    fixWalls?: boolean;
                    drywallRepairsLevel?: 'LIGHT' | 'MEDIUM' | 'HEAVY';
                    priming?: boolean;
                    paintWalls?: boolean;
                    paintCeiling?: boolean;
                    paintTrim?: boolean;
                    paintDoor?: boolean;
                    installBaseboard?: boolean;
                    installDoorCasing?: boolean;
                    installShoeQuarterRound?: boolean;
                    installDoorHardware?: boolean;
                    installMirror?: boolean;
                    installTowelBar?: boolean;
                    installTPHolder?: boolean;
                    installRobeHook?: boolean;
                    installTowelRing?: boolean;
                    installShowerRod?: boolean;
                    installWallShelf?: boolean;
                  } | null;

                  if (!design) return null;

                  // Calculate areas
                  const width = parseFloat(design.width || '0') || 0;
                  const length = parseFloat(design.length || '0') || 0;
                  const height = parseFloat(design.height || '0') || 0;
                  const floorArea = (width * length) / 144;
                  const wallArea = (2 * (width + length) * height) / 144;
                  const perimeter = (2 * (width + length)) / 12;

                  // Collect painting options
                  const paintingOptions: string[] = [];
                  if (design.fixWalls) paintingOptions.push(`Drywall Repairs (${design.drywallRepairsLevel || 'LIGHT'})`);
                  if (design.priming) paintingOptions.push('Priming');
                  if (design.paintWalls) paintingOptions.push('Paint Walls');
                  if (design.paintCeiling) paintingOptions.push('Paint Ceiling');
                  if (design.paintTrim) paintingOptions.push('Paint Trim');
                  if (design.paintDoor) paintingOptions.push('Paint Door');

                  // Collect carpentry options
                  const carpentryOptions: string[] = [];
                  if (design.installBaseboard) carpentryOptions.push('Baseboard');
                  if (design.installDoorCasing) carpentryOptions.push('Door Casing');
                  if (design.installShoeQuarterRound) carpentryOptions.push('Shoe/Quarter Round');
                  if (design.installDoorHardware) carpentryOptions.push('Door Hardware');

                  // Collect accessory options
                  const accessoryOptions: string[] = [];
                  if (design.installTowelBar) accessoryOptions.push('Towel Bar');
                  if (design.installTPHolder) accessoryOptions.push('TP Holder');
                  if (design.installRobeHook) accessoryOptions.push('Robe Hook');
                  if (design.installTowelRing) accessoryOptions.push('Towel Ring');
                  if (design.installShowerRod) accessoryOptions.push('Shower Rod');
                  if (design.installWallShelf) accessoryOptions.push('Wall Shelf');
                  if (design.installMirror) accessoryOptions.push('Mirror');

                  const hasAnyOption = paintingOptions.length > 0 || carpentryOptions.length > 0 || accessoryOptions.length > 0;
                  if (!hasAnyOption && !design.width) return null;

                  return (
                    <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                      <h4 className='font-semibold text-blue-900 mb-2'>
                        Design Specifications
                      </h4>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        {/* Room Dimensions */}
                        {design.width && design.length && (
                          <>
                            <div>
                              <span className='font-medium text-gray-700'>
                                Room Dimensions:
                              </span>
                              <div className='text-gray-600'>
                                {design.width}&quot; × {design.length}&quot; × {design.height}&quot;
                              </div>
                            </div>
                            <div>
                              <span className='font-medium text-gray-700'>
                                Floor Area:
                              </span>
                              <div className='text-gray-600'>
                                {floorArea.toFixed(1)} sq/ft
                              </div>
                            </div>
                            <div>
                              <span className='font-medium text-gray-700'>
                                Wall Area:
                              </span>
                              <div className='text-gray-600'>
                                {wallArea.toFixed(1)} sq/ft
                              </div>
                            </div>
                            <div>
                              <span className='font-medium text-gray-700'>
                                Perimeter:
                              </span>
                              <div className='text-gray-600'>
                                {perimeter.toFixed(1)} ft
                              </div>
                            </div>
                          </>
                        )}

                        {/* Painting Options */}
                        {paintingOptions.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium text-gray-700'>
                              Painting:
                            </span>
                            <div className='text-gray-600'>
                              {paintingOptions.join(', ')}
                            </div>
                          </div>
                        )}

                        {/* Carpentry Options */}
                        {carpentryOptions.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium text-gray-700'>
                              Carpentry:
                            </span>
                            <div className='text-gray-600'>
                              {carpentryOptions.join(', ')}
                            </div>
                          </div>
                        )}

                        {/* Accessory Options */}
                        {accessoryOptions.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium text-gray-700'>
                              Accessories:
                            </span>
                            <div className='text-gray-600'>
                              {accessoryOptions.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* Design Options for Structural */}
              {workflow.id === 'structural' &&
                (() => {
                  const design = getDesignData('structural') as {
                    frameNewWall?: boolean;
                    relocateWall?: boolean;
                    relocateWallLength?: string;
                    removeNonLoadBearingWall?: boolean;
                    installBlocking?: boolean;
                    frameShowerNiche?: boolean;
                    addInsulation?: boolean;
                    changeDoorwayOpening?: boolean;
                    repairSisterFloorJoists?: boolean;
                    levelFloor?: boolean;
                    installNewPlywoodSubfloor?: boolean;
                    plywoodThickness?: string;
                    replaceRottenSubfloor?: boolean;
                  } | null;

                  if (!design) return null;

                  // Collect wall modifications
                  const wallModifications: string[] = [];
                  if (design.frameNewWall) wallModifications.push('Frame New Wall');
                  if (design.relocateWall) wallModifications.push(`Relocate Wall (${design.relocateWallLength || '8'}ft)`);
                  if (design.removeNonLoadBearingWall) wallModifications.push('Remove Non-Load Bearing Wall');
                  if (design.installBlocking) wallModifications.push('Install Blocking');
                  if (design.frameShowerNiche) wallModifications.push('Frame Shower Niche');
                  if (design.addInsulation) wallModifications.push('Add Insulation');
                  if (design.changeDoorwayOpening) wallModifications.push('Change Doorway Opening');

                  // Collect floor tasks
                  const floorTasks: string[] = [];
                  if (design.repairSisterFloorJoists) floorTasks.push('Repair/Sister Floor Joists');
                  if (design.levelFloor) floorTasks.push('Level Floor');
                  if (design.installNewPlywoodSubfloor) floorTasks.push(`Install Plywood Subfloor (${design.plywoodThickness || '3/4'}")`);
                  if (design.replaceRottenSubfloor) floorTasks.push('Replace Rotten Subfloor');

                  const hasAnyOption = wallModifications.length > 0 || floorTasks.length > 0;
                  if (!hasAnyOption) return null;

                  return (
                    <div className='mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                      <h4 className='font-semibold text-blue-900 mb-2'>
                        Design Specifications
                      </h4>
                      <div className='grid grid-cols-2 gap-2 text-sm'>
                        {/* Wall Modifications */}
                        {wallModifications.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium text-gray-700'>
                              Wall Modifications:
                            </span>
                            <div className='text-gray-600'>
                              {wallModifications.join(', ')}
                            </div>
                          </div>
                        )}

                        {/* Floor Tasks */}
                        {floorTasks.length > 0 && (
                          <div className='col-span-2'>
                            <span className='font-medium text-gray-700'>
                              Floors:
                            </span>
                            <div className='text-gray-600'>
                              {floorTasks.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* Demolition: list labor item names in one line, no individual prices */}
              {workflow.id === 'demolition' ? (
                (() => {
                  const laborItems = getLaborItems('demolition');
                  const flatFeeItems = getFlatFeeItems('demolition');
                  const designData = getDesignData('demolition') as {
                    isDemolitionFlatFee?: 'yes' | 'no';
                    [key: string]: unknown;
                  } | null;

                  const items = designData?.isDemolitionFlatFee === 'yes'
                    ? flatFeeItems
                    : laborItems;

                  if (items.length === 0) return null;

                  // Shorten demolition labels for estimate display
                  const shortenLabel = (name: string) => {
                    const labelMap: Record<string, string> = {
                      'Remove Flooring': 'Remove Flooring',
                      'Remove Shower Wall': 'Shower Wall',
                      'Remove Shower Base': 'Shower Base',
                      'Remove Tub': 'Tub',
                      'Remove Vanity': 'Vanity',
                      'Remove Toilet': 'Toilet',
                      'Remove Accessories': 'Accessories',
                      'Remove Wall': 'Wall',
                    };
                    return labelMap[name] || name;
                  };

                  const itemNames = items.map((item) => shortenLabel(item.name)).join(', ');

                  return (
                    <div className='text-sm text-gray-700'>
                      {itemNames}
                    </div>
                  );
                })()
              ) : (
                <>
                  {/* All other sections: show only Labor & Materials totals */}
                  <div className='flex justify-between items-center'>
                    <div className='flex-1'>
                      <p className='text-gray-700'>Labor</p>
                    </div>
                    <div className='text-right'>
                      <p className='font-semibold text-gray-900'>
                        ${workflow.totalLabor.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className='flex-1'>
                      <p className='text-gray-700'>Materials</p>
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
              // Map plumbing/electrical IDs back to 'trade' for data fetching
              const workflowKey = (workflow.id === 'plumbing' || workflow.id === 'electrical') ? 'trade' : workflow.id;
              // Get design data to access client notes
              const designData = getDesignData(
                workflowKey as
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

      {/* Action Buttons */}
      {/* Export to PDF or Upgrade Button */}
      <div className='px-8 pb-8'>
        <div className='flex justify-center'>
          {limits.canExportPdf ? (
            <Button
              onClick={handleExportToPDF}
              className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg flex items-center gap-3 no-pdf'
            >
              <Download size={24} />
              Export to PDF
            </Button>
          ) : (
            <Button
              onClick={() => router.push('/pricing')}
              className='bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-semibold rounded-lg flex items-center gap-3 no-pdf'
            >
              <CreditCard size={24} />
              Upgrade to Export
            </Button>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title='PDF Export Limit Reached'
        message={`You've used all 3 free PDF exports. Subscribe to a plan for unlimited exports.`}
      />
    </div>
  );
}
