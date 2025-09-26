'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEstimateWorkflowContext } from '@/contexts/EstimateWorkflowContext';
import { Hammer, ShowerHead } from 'lucide-react';
import { ShowerBaseIcon } from '@/components/icons/ShowerBaseIcon';

export default function EstimatesOverview() {
  const {
    getWorkflowTotals,
    getDesignData,
    getLaborItems,
    getMaterialItems,
    getAllTotals,
  } = useEstimateWorkflowContext();

  // Get demolition workflow data
  const demolitionData = useMemo(() => {
    const designData = getDesignData('demolition');
    const laborItems = getLaborItems('demolition');
    const materialItems = getMaterialItems('demolition');
    const totals = getWorkflowTotals('demolition');

    // Check if demolition has any data
    const hasData =
      laborItems.length > 0 ||
      materialItems.length > 0 ||
      (designData && Object.keys(designData).length > 0);

    if (!hasData) return null;

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
    return workflowList;
  }, [demolitionData, showerWallsData, showerBaseData]);

  // Get grand total from context
  const grandTotal = useMemo(() => getAllTotals().grandTotal, [getAllTotals]);
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
          Project Estimate Overview
        </h2>
        <p className='text-gray-600'>
          Complete breakdown of labor and materials costs by workflow
        </p>
      </div>

      {/* Workflows Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            className='border-blue-200 hover:shadow-lg transition-shadow'
          >
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center space-x-3'>
                <div
                  className={`w-10 h-10 ${workflow.color} rounded-lg flex items-center justify-center`}
                >
                  {workflow.icon}
                </div>
                <div>
                  <h3 className='text-lg font-semibold'>{workflow.name}</h3>
                  <Badge variant='outline' className='text-xs'>
                    Total: ${workflow.total.toFixed(2)}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Labor Breakdown */}
              <div className='space-y-2'>
                <h4 className='font-medium text-gray-900 flex items-center justify-between'>
                  <span>Labor</span>
                  <span className='text-blue-600'>
                    ${workflow.totalLabor.toFixed(2)}
                  </span>
                </h4>
                <div className='space-y-1 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Design</span>
                    <span>${workflow.designLabor.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Construction</span>
                    <span>${workflow.constructionLabor.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Materials Breakdown */}
              <div className='space-y-2'>
                <h4 className='font-medium text-gray-900 flex items-center justify-between'>
                  <span>Materials</span>
                  <span className='text-green-600'>
                    ${workflow.totalMaterials.toFixed(2)}
                  </span>
                </h4>
                <div className='space-y-1 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Design</span>
                    <span>${workflow.designMaterials.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Construction</span>
                    <span>${workflow.constructionMaterials.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='border-blue-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-blue-900'>Total Labor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-blue-600'>
              ${workflows.reduce((sum, w) => sum + w.totalLabor, 0).toFixed(2)}
            </div>
            <p className='text-sm text-gray-600 mt-1'>Across all workflows</p>
          </CardContent>
        </Card>

        <Card className='border-green-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-green-900'>
              Total Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-green-600'>
              $
              {workflows
                .reduce((sum, w) => sum + w.totalMaterials, 0)
                .toFixed(2)}
            </div>
            <p className='text-sm text-gray-600 mt-1'>Across all workflows</p>
          </CardContent>
        </Card>

        <Card className='border-purple-200'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-lg text-purple-900'>
              Grand Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-purple-600'>
              ${grandTotal.toFixed(2)}
            </div>
            <p className='text-sm text-gray-600 mt-1'>
              Complete project estimate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown Table */}
      <Card className='border-gray-200'>
        <CardHeader>
          <CardTitle className='text-xl'>Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 font-medium text-gray-900'>
                    Workflow
                  </th>
                  <th className='text-right py-3 px-4 font-medium text-gray-900'>
                    Design Labor
                  </th>
                  <th className='text-right py-3 px-4 font-medium text-gray-900'>
                    Construction Labor
                  </th>
                  <th className='text-right py-3 px-4 font-medium text-gray-900'>
                    Design Materials
                  </th>
                  <th className='text-right py-3 px-4 font-medium text-gray-900'>
                    Construction Materials
                  </th>
                  <th className='text-right py-3 px-4 font-medium text-gray-900'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((workflow) => (
                  <tr
                    key={workflow.id}
                    className='border-b border-gray-100 hover:bg-gray-50'
                  >
                    <td className='py-3 px-4 font-medium text-gray-900'>
                      {workflow.name}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-600'>
                      ${workflow.designLabor.toFixed(2)}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-600'>
                      ${workflow.constructionLabor.toFixed(2)}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-600'>
                      ${workflow.designMaterials.toFixed(2)}
                    </td>
                    <td className='py-3 px-4 text-right text-gray-600'>
                      ${workflow.constructionMaterials.toFixed(2)}
                    </td>
                    <td className='py-3 px-4 text-right font-semibold text-gray-900'>
                      ${workflow.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className='border-t-2 border-gray-300 bg-gray-50'>
                  <td className='py-3 px-4 font-bold text-gray-900'>
                    Grand Total
                  </td>
                  <td className='py-3 px-4 text-right font-bold text-gray-900'>
                    $
                    {workflows
                      .reduce((sum, w) => sum + w.designLabor, 0)
                      .toFixed(2)}
                  </td>
                  <td className='py-3 px-4 text-right font-bold text-gray-900'>
                    $
                    {workflows
                      .reduce((sum, w) => sum + w.constructionLabor, 0)
                      .toFixed(2)}
                  </td>
                  <td className='py-3 px-4 text-right font-bold text-gray-900'>
                    $
                    {workflows
                      .reduce((sum, w) => sum + w.designMaterials, 0)
                      .toFixed(2)}
                  </td>
                  <td className='py-3 px-4 text-right font-bold text-gray-900'>
                    $
                    {workflows
                      .reduce((sum, w) => sum + w.constructionMaterials, 0)
                      .toFixed(2)}
                  </td>
                  <td className='py-3 px-4 text-right font-bold text-purple-600 text-lg'>
                    ${grandTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
